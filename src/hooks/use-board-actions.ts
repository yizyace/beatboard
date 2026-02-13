import { useCallback } from 'react'
import { useBoardStore } from '../stores/board-store'
import { useSettingsStore } from '../stores/settings-store'
import { writeCard, deleteCardFile } from '../lib/repo/repo-writer'
import { writeBoard } from '../lib/repo/repo-writer'
import { gitAdd, gitCommit } from '../lib/git/git-operations'
import { buildCommitMessage } from '../lib/sync/commit-builder'
import { getOrderKeyForEnd, getOrderKeyBetween } from '../lib/schema/fractional-index'
import type { Card, Comment } from '../lib/schema/types'

function generateId(): string {
  return `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export function useBoardActions() {
  const store = useBoardStore()
  const repoPath = useSettingsStore((s) => s.localRepoPath)
  const author = useSettingsStore((s) => s.author)

  const commitCardChange = useCallback(
    async (boardId: string, card: Card, message: string) => {
      const cardPath = `boards/${boardId}/cards/${card.id}.json`
      await writeCard(repoPath, boardId, card)
      await gitAdd(repoPath, [cardPath])
      await gitCommit(repoPath, message)
    },
    [repoPath],
  )

  const addCard = useCallback(
    async (laneId: string, title: string) => {
      const board = store.getActiveBoard()
      if (!board) return

      const laneCards = store.getCardsForLane(laneId)
      const lastKey = laneCards.length > 0
        ? laneCards[laneCards.length - 1].orderKey
        : null

      const lane = board.lanes.find((l) => l.id === laneId)

      const card: Card = {
        id: generateId(),
        title,
        description: '',
        tags: [],
        comments: [],
        laneId,
        orderKey: getOrderKeyForEnd(lastKey),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author,
      }

      // Optimistic update
      store.addCard(card)

      try {
        await commitCardChange(
          board.id,
          card,
          buildCommitMessage({
            type: 'add-card',
            cardId: card.id,
            title,
            laneTitle: lane?.title ?? laneId,
          }),
        )
      } catch (err) {
        // Rollback
        store.deleteCard(card.id)
        console.error('Failed to add card:', err)
      }
    },
    [store, author, commitCardChange],
  )

  const updateCard = useCallback(
    async (cardId: string, updates: Partial<Card>) => {
      const board = store.getActiveBoard()
      const prevCard = store.getCard(cardId)
      if (!board || !prevCard) return

      const updatedCard = {
        ...prevCard,
        ...updates,
        updatedAt: new Date().toISOString(),
      }

      // Optimistic update
      store.updateCard(cardId, updatedCard)

      const changedFields = Object.keys(updates).filter(
        (k) => k !== 'updatedAt',
      )

      try {
        await commitCardChange(
          board.id,
          updatedCard,
          buildCommitMessage({
            type: 'update-card',
            cardId,
            title: updatedCard.title,
            fields: changedFields,
          }),
        )
      } catch (err) {
        // Rollback
        store.updateCard(cardId, prevCard)
        console.error('Failed to update card:', err)
      }
    },
    [store, commitCardChange],
  )

  const deleteCard = useCallback(
    async (cardId: string) => {
      const board = store.getActiveBoard()
      const card = store.getCard(cardId)
      if (!board || !card) return

      // Optimistic update
      store.deleteCard(cardId)

      try {
        await deleteCardFile(repoPath, board.id, cardId)
        const cardPath = `boards/${board.id}/cards/${cardId}.json`
        await gitAdd(repoPath, [cardPath])
        await gitCommit(
          repoPath,
          buildCommitMessage({
            type: 'delete-card',
            cardId,
            title: card.title,
          }),
        )
      } catch (err) {
        // Rollback
        store.addCard(card)
        console.error('Failed to delete card:', err)
      }
    },
    [store, repoPath],
  )

  const moveCard = useCallback(
    async (
      cardId: string,
      targetLaneId: string,
      beforeKey: string | null,
      afterKey: string | null,
    ) => {
      const board = store.getActiveBoard()
      const card = store.getCard(cardId)
      if (!board || !card) return

      const newOrderKey = getOrderKeyBetween(beforeKey, afterKey)
      const prevLaneId = card.laneId
      const prevOrderKey = card.orderKey

      // Optimistic update
      store.moveCard(cardId, targetLaneId, newOrderKey)

      const lane = board.lanes.find((l) => l.id === targetLaneId)

      try {
        const updatedCard = {
          ...card,
          laneId: targetLaneId,
          orderKey: newOrderKey,
          updatedAt: new Date().toISOString(),
        }
        await commitCardChange(
          board.id,
          updatedCard,
          buildCommitMessage({
            type: 'move-card',
            cardId,
            title: card.title,
            toLaneTitle: lane?.title ?? targetLaneId,
          }),
        )
      } catch (err) {
        // Rollback
        store.moveCard(cardId, prevLaneId, prevOrderKey)
        console.error('Failed to move card:', err)
      }
    },
    [store, commitCardChange],
  )

  const addComment = useCallback(
    async (cardId: string, text: string) => {
      const board = store.getActiveBoard()
      const card = store.getCard(cardId)
      if (!board || !card) return

      const comment: Comment = {
        id: generateId(),
        text,
        author,
        createdAt: new Date().toISOString(),
      }

      const updatedCard = {
        ...card,
        comments: [...card.comments, comment],
        updatedAt: new Date().toISOString(),
      }

      store.updateCard(cardId, updatedCard)

      try {
        await commitCardChange(
          board.id,
          updatedCard,
          buildCommitMessage({
            type: 'add-comment',
            cardId,
            cardTitle: card.title,
          }),
        )
      } catch (err) {
        store.updateCard(cardId, card)
        console.error('Failed to add comment:', err)
      }
    },
    [store, author, commitCardChange],
  )

  const deleteComment = useCallback(
    async (cardId: string, commentId: string) => {
      const board = store.getActiveBoard()
      const card = store.getCard(cardId)
      if (!board || !card) return

      const updatedCard = {
        ...card,
        comments: card.comments.filter((c) => c.id !== commentId),
        updatedAt: new Date().toISOString(),
      }

      store.updateCard(cardId, updatedCard)

      try {
        await commitCardChange(
          board.id,
          updatedCard,
          buildCommitMessage({
            type: 'delete-comment',
            cardId,
            cardTitle: card.title,
          }),
        )
      } catch (err) {
        store.updateCard(cardId, card)
        console.error('Failed to delete comment:', err)
      }
    },
    [store, commitCardChange],
  )

  const addLane = useCallback(
    async (title: string) => {
      const board = store.getActiveBoard()
      if (!board) return

      const lastKey = board.lanes.length > 0
        ? board.lanes.sort((a, b) => a.orderKey.localeCompare(b.orderKey))[
            board.lanes.length - 1
          ].orderKey
        : null

      const lane = {
        id: `lane_${Date.now().toString(36)}`,
        title,
        orderKey: getOrderKeyForEnd(lastKey),
      }

      store.addLane(board.id, lane)

      try {
        const updatedBoard = {
          ...board,
          lanes: [...board.lanes, lane],
        }
        await writeBoard(repoPath, updatedBoard)
        const boardPath = `boards/${board.id}/board.json`
        await gitAdd(repoPath, [boardPath])
        await gitCommit(
          repoPath,
          buildCommitMessage({
            type: 'add-lane',
            laneId: lane.id,
            title,
          }),
        )
      } catch (err) {
        // Rollback by reloading — simpler than tracking lane removal
        console.error('Failed to add lane:', err)
      }
    },
    [store, repoPath],
  )

  return {
    addCard,
    updateCard,
    deleteCard,
    moveCard,
    addComment,
    deleteComment,
    addLane,
  }
}
