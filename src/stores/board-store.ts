import { create } from 'zustand'
import type { Board, Card } from '../lib/schema/types'

interface BoardState {
  boards: Board[]
  activeBoardId: string | null
  cards: Card[]

  // Board actions
  setBoards: (boards: Board[]) => void
  setActiveBoardId: (id: string) => void

  // Card actions
  setCards: (cards: Card[]) => void
  addCard: (card: Card) => void
  updateCard: (cardId: string, updates: Partial<Card>) => void
  deleteCard: (cardId: string) => void
  moveCard: (
    cardId: string,
    targetLaneId: string,
    newOrderKey: string,
  ) => void

  // Lane actions
  addLane: (boardId: string, lane: Board['lanes'][0]) => void
  updateLane: (
    boardId: string,
    laneId: string,
    updates: Partial<Board['lanes'][0]>,
  ) => void
  moveLane: (boardId: string, laneId: string, newOrderKey: string) => void

  // Bulk replace (used by sync)
  replaceAll: (boards: Board[], cards: Card[]) => void

  // Selectors
  getActiveBoard: () => Board | undefined
  getCardsForLane: (laneId: string) => Card[]
  getCard: (cardId: string) => Card | undefined
}

export const useBoardStore = create<BoardState>((set, get) => ({
  boards: [],
  activeBoardId: null,
  cards: [],

  setBoards: (boards) => set({ boards }),
  setActiveBoardId: (id) => set({ activeBoardId: id }),

  setCards: (cards) => set({ cards }),

  addCard: (card) =>
    set((state) => ({ cards: [...state.cards, card] })),

  updateCard: (cardId, updates) =>
    set((state) => ({
      cards: state.cards.map((c) =>
        c.id === cardId ? { ...c, ...updates } : c,
      ),
    })),

  deleteCard: (cardId) =>
    set((state) => ({
      cards: state.cards.filter((c) => c.id !== cardId),
    })),

  moveCard: (cardId, targetLaneId, newOrderKey) =>
    set((state) => ({
      cards: state.cards.map((c) =>
        c.id === cardId
          ? {
              ...c,
              laneId: targetLaneId,
              orderKey: newOrderKey,
              updatedAt: new Date().toISOString(),
            }
          : c,
      ),
    })),

  addLane: (boardId, lane) =>
    set((state) => ({
      boards: state.boards.map((b) =>
        b.id === boardId ? { ...b, lanes: [...b.lanes, lane] } : b,
      ),
    })),

  updateLane: (boardId, laneId, updates) =>
    set((state) => ({
      boards: state.boards.map((b) =>
        b.id === boardId
          ? {
              ...b,
              lanes: b.lanes.map((l) =>
                l.id === laneId ? { ...l, ...updates } : l,
              ),
            }
          : b,
      ),
    })),

  moveLane: (boardId, laneId, newOrderKey) =>
    set((state) => ({
      boards: state.boards.map((b) =>
        b.id === boardId
          ? {
              ...b,
              lanes: b.lanes.map((l) =>
                l.id === laneId ? { ...l, orderKey: newOrderKey } : l,
              ),
            }
          : b,
      ),
    })),

  replaceAll: (boards, cards) => set({ boards, cards }),

  getActiveBoard: () => {
    const { boards, activeBoardId } = get()
    return boards.find((b) => b.id === activeBoardId)
  },

  getCardsForLane: (laneId) => {
    return get()
      .cards.filter((c) => c.laneId === laneId)
      .sort((a, b) => a.orderKey.localeCompare(b.orderKey))
  },

  getCard: (cardId) => {
    return get().cards.find((c) => c.id === cardId)
  },
}))
