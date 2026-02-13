import { describe, it, expect } from 'vitest'
import {
  parseDiffTree,
  getAffectedBoardIds,
} from '../lib/sync/change-detector'

describe('change-detector', () => {
  describe('parseDiffTree', () => {
    it('parses empty output', () => {
      expect(parseDiffTree('')).toEqual([])
    })

    it('parses card changes', () => {
      const output = 'M\tboards/main/cards/c_123.json'
      const changes = parseDiffTree(output)
      expect(changes).toEqual([
        {
          status: 'M',
          path: 'boards/main/cards/c_123.json',
          type: 'card',
          boardId: 'main',
          cardId: 'c_123',
        },
      ])
    })

    it('parses board changes', () => {
      const output = 'M\tboards/main/board.json'
      const changes = parseDiffTree(output)
      expect(changes).toEqual([
        {
          status: 'M',
          path: 'boards/main/board.json',
          type: 'board',
          boardId: 'main',
        },
      ])
    })

    it('parses config changes', () => {
      const output = 'M\tgitboard.json'
      const changes = parseDiffTree(output)
      expect(changes).toEqual([
        {
          status: 'M',
          path: 'gitboard.json',
          type: 'config',
        },
      ])
    })

    it('parses multiple changes', () => {
      const output = [
        'A\tboards/main/cards/c_new.json',
        'M\tboards/main/board.json',
        'D\tboards/main/cards/c_old.json',
      ].join('\n')

      const changes = parseDiffTree(output)
      expect(changes).toHaveLength(3)
      expect(changes[0].status).toBe('A')
      expect(changes[1].type).toBe('board')
      expect(changes[2].status).toBe('D')
    })

    it('marks unknown file types', () => {
      const output = 'M\tREADME.md'
      const changes = parseDiffTree(output)
      expect(changes[0].type).toBe('unknown')
    })
  })

  describe('getAffectedBoardIds', () => {
    it('returns board ids from card changes', () => {
      const changes = parseDiffTree(
        'M\tboards/main/cards/c_123.json\nM\tboards/other/cards/c_456.json',
      )
      const ids = getAffectedBoardIds(changes)
      expect(ids).toContain('main')
      expect(ids).toContain('other')
    })

    it('returns __all__ for config changes', () => {
      const changes = parseDiffTree('M\tgitboard.json')
      expect(getAffectedBoardIds(changes)).toEqual(['__all__'])
    })
  })
})
