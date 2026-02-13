import { describe, it, expect, beforeEach } from 'vitest'
import { useBoardStore } from '../stores/board-store'
import { useSyncStore } from '../stores/sync-store'
import { useSettingsStore } from '../stores/settings-store'
import { createBoard, createCard } from './factories'

describe('board-store', () => {
  beforeEach(() => {
    useBoardStore.setState({
      boards: [],
      activeBoardId: null,
      cards: [],
    })
  })

  it('sets boards', () => {
    const board = createBoard({ id: 'b1' })
    useBoardStore.getState().setBoards([board])
    expect(useBoardStore.getState().boards).toHaveLength(1)
  })

  it('adds a card', () => {
    const card = createCard({ id: 'c1' })
    useBoardStore.getState().addCard(card)
    expect(useBoardStore.getState().cards).toHaveLength(1)
  })

  it('updates a card', () => {
    const card = createCard({ id: 'c1', title: 'Old' })
    useBoardStore.getState().addCard(card)
    useBoardStore.getState().updateCard('c1', { title: 'New' })
    expect(useBoardStore.getState().cards[0].title).toBe('New')
  })

  it('deletes a card', () => {
    const card = createCard({ id: 'c1' })
    useBoardStore.getState().addCard(card)
    useBoardStore.getState().deleteCard('c1')
    expect(useBoardStore.getState().cards).toHaveLength(0)
  })

  it('moves a card to a new lane', () => {
    const card = createCard({ id: 'c1', laneId: 'todo' })
    useBoardStore.getState().addCard(card)
    useBoardStore.getState().moveCard('c1', 'doing', 'b0')
    const moved = useBoardStore.getState().cards[0]
    expect(moved.laneId).toBe('doing')
    expect(moved.orderKey).toBe('b0')
  })

  it('replaces all data', () => {
    const board = createBoard({ id: 'b1' })
    const card = createCard({ id: 'c1' })
    useBoardStore.getState().addCard(createCard({ id: 'old' }))
    useBoardStore.getState().replaceAll([board], [card])
    expect(useBoardStore.getState().boards).toHaveLength(1)
    expect(useBoardStore.getState().cards).toHaveLength(1)
    expect(useBoardStore.getState().cards[0].id).toBe('c1')
  })

  it('getCardsForLane returns sorted cards', () => {
    useBoardStore.getState().addCard(
      createCard({ id: 'c2', laneId: 'todo', orderKey: 'b0' }),
    )
    useBoardStore.getState().addCard(
      createCard({ id: 'c1', laneId: 'todo', orderKey: 'a0' }),
    )
    useBoardStore.getState().addCard(
      createCard({ id: 'c3', laneId: 'doing', orderKey: 'a0' }),
    )
    const todoCards = useBoardStore.getState().getCardsForLane('todo')
    expect(todoCards).toHaveLength(2)
    expect(todoCards[0].id).toBe('c1')
    expect(todoCards[1].id).toBe('c2')
  })

  it('adds a lane to a board', () => {
    const board = createBoard({ id: 'b1', lanes: [] })
    useBoardStore.getState().setBoards([board])
    useBoardStore.getState().addLane('b1', {
      id: 'new',
      title: 'New Lane',
      orderKey: 'a0',
    })
    expect(useBoardStore.getState().boards[0].lanes).toHaveLength(1)
  })
})

describe('sync-store', () => {
  beforeEach(() => {
    useSyncStore.setState({
      status: 'idle',
      isOnline: true,
      lastSyncedAt: null,
      pendingCommitCount: 0,
      error: null,
      conflicts: [],
    })
  })

  it('sets status', () => {
    useSyncStore.getState().setStatus('syncing')
    expect(useSyncStore.getState().status).toBe('syncing')
  })

  it('sets online/offline', () => {
    useSyncStore.getState().setOnline(false)
    expect(useSyncStore.getState().isOnline).toBe(false)
  })

  it('sets conflicts and updates status', () => {
    useSyncStore.getState().setConflicts([
      {
        cardId: 'c1',
        cardTitle: 'Test',
        conflicts: [],
        localCard: createCard(),
        remoteCard: createCard(),
        baseCard: createCard(),
      },
    ])
    expect(useSyncStore.getState().status).toBe('conflict')
  })

  it('resolves a conflict', () => {
    useSyncStore.getState().setConflicts([
      {
        cardId: 'c1',
        cardTitle: 'Test',
        conflicts: [],
        localCard: createCard(),
        remoteCard: createCard(),
        baseCard: createCard(),
      },
    ])
    useSyncStore.getState().resolveConflict('c1')
    expect(useSyncStore.getState().conflicts).toHaveLength(0)
    expect(useSyncStore.getState().status).toBe('idle')
  })
})

describe('settings-store', () => {
  it('sets settings', () => {
    useSettingsStore.getState().setSettings({
      repoUrl: 'https://github.com/user/repo',
      localRepoPath: '/tmp/repo',
      pollIntervalMs: 30000,
      author: 'User',
      zoomLevel: 'normal',
    })
    expect(useSettingsStore.getState().repoUrl).toBe(
      'https://github.com/user/repo',
    )
    expect(useSettingsStore.getState().isConfigured).toBe(true)
  })

  it('sets zoom level', () => {
    useSettingsStore.getState().setZoomLevel('compact')
    expect(useSettingsStore.getState().zoomLevel).toBe('compact')
  })
})
