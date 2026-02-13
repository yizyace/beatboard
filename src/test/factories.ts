import type { Board, Card, Comment, Lane } from '../lib/schema/types'

let counter = 0
function nextId(prefix: string): string {
  counter++
  return `${prefix}_${counter}`
}

export function createComment(overrides: Partial<Comment> = {}): Comment {
  return {
    id: nextId('comment'),
    text: 'Test comment',
    author: 'Test User',
    createdAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  }
}

export function createCard(overrides: Partial<Card> = {}): Card {
  return {
    id: nextId('card'),
    title: 'Test Card',
    description: 'Test description',
    tags: [],
    comments: [],
    laneId: 'todo',
    orderKey: 'a0',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    author: 'Test User',
    ...overrides,
  }
}

export function createLane(overrides: Partial<Lane> = {}): Lane {
  return {
    id: nextId('lane'),
    title: 'Test Lane',
    orderKey: 'a0',
    ...overrides,
  }
}

export function createBoard(overrides: Partial<Board> = {}): Board {
  return {
    id: nextId('board'),
    name: 'Test Board',
    lanes: [
      { id: 'todo', title: 'Todo', orderKey: 'a0' },
      { id: 'doing', title: 'Doing', orderKey: 'a1' },
      { id: 'done', title: 'Done', orderKey: 'a2' },
    ],
    ...overrides,
  }
}

export function resetFactoryCounter(): void {
  counter = 0
}
