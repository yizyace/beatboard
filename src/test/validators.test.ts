import { describe, it, expect } from 'vitest'
import {
  CardSchema,
  BoardSchema,
  GitBoardConfigSchema,
  CommentSchema,
  LaneSchema,
  AppSettingsSchema,
  LastSeenSchema,
} from '../lib/schema/validators'

describe('validators', () => {
  describe('CommentSchema', () => {
    it('validates a valid comment', () => {
      const comment = {
        id: 'c1',
        text: 'Hello',
        author: 'User',
        createdAt: '2024-01-01T00:00:00.000Z',
      }
      expect(CommentSchema.parse(comment)).toEqual(comment)
    })

    it('rejects missing fields', () => {
      expect(() => CommentSchema.parse({ id: 'c1' })).toThrow()
    })
  })

  describe('CardSchema', () => {
    it('validates a valid card', () => {
      const card = {
        id: 'card_1',
        title: 'Test',
        description: 'Desc',
        tags: ['bug'],
        comments: [],
        laneId: 'todo',
        orderKey: 'a0',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        author: 'User',
      }
      expect(CardSchema.parse(card)).toEqual(card)
    })

    it('rejects invalid card', () => {
      expect(() => CardSchema.parse({ id: 'x' })).toThrow()
    })
  })

  describe('LaneSchema', () => {
    it('validates a valid lane', () => {
      const lane = { id: 'todo', title: 'Todo', orderKey: 'a0' }
      expect(LaneSchema.parse(lane)).toEqual(lane)
    })
  })

  describe('BoardSchema', () => {
    it('validates a valid board', () => {
      const board = {
        id: 'main',
        name: 'Main Board',
        lanes: [{ id: 'todo', title: 'Todo', orderKey: 'a0' }],
      }
      expect(BoardSchema.parse(board)).toEqual(board)
    })
  })

  describe('GitBoardConfigSchema', () => {
    it('validates a valid config', () => {
      const config = { version: 1, boards: ['main'] }
      expect(GitBoardConfigSchema.parse(config)).toEqual(config)
    })
  })

  describe('AppSettingsSchema', () => {
    it('validates valid settings', () => {
      const settings = {
        repoUrl: 'https://github.com/user/repo',
        localRepoPath: '/tmp/repo',
        pollIntervalMs: 30000,
        author: 'User',
        zoomLevel: 'normal',
      }
      expect(AppSettingsSchema.parse(settings)).toEqual(settings)
    })

    it('rejects invalid zoom level', () => {
      expect(() =>
        AppSettingsSchema.parse({
          repoUrl: 'x',
          localRepoPath: 'x',
          pollIntervalMs: 1000,
          author: 'x',
          zoomLevel: 'invalid',
        }),
      ).toThrow()
    })
  })

  describe('LastSeenSchema', () => {
    it('validates valid last seen', () => {
      const lastSeen = {
        commitSha: 'abc123',
        timestamp: '2024-01-01T00:00:00.000Z',
      }
      expect(LastSeenSchema.parse(lastSeen)).toEqual(lastSeen)
    })
  })
})
