import { describe, it, expect } from 'vitest'
import { mergeCards } from '../lib/sync/conflict-resolver'
import { createCard, createComment } from './factories'

describe('conflict-resolver', () => {
  it('auto-merges when only one side changed', () => {
    const base = createCard({ title: 'Original' })
    const local = { ...base, title: 'Local Change' }
    const remote = { ...base }

    const { merged, conflicts } = mergeCards(base, local, remote)
    expect(merged.title).toBe('Local Change')
    expect(conflicts).toHaveLength(0)
  })

  it('auto-merges when both sides made the same change', () => {
    const base = createCard({ title: 'Original' })
    const local = { ...base, title: 'Same Change' }
    const remote = { ...base, title: 'Same Change' }

    const { merged, conflicts } = mergeCards(base, local, remote)
    expect(merged.title).toBe('Same Change')
    expect(conflicts).toHaveLength(0)
  })

  it('detects conflict when both sides changed differently', () => {
    const base = createCard({ title: 'Original' })
    const local = { ...base, title: 'Local Title' }
    const remote = { ...base, title: 'Remote Title' }

    const { merged, conflicts } = mergeCards(base, local, remote)
    expect(conflicts).toHaveLength(1)
    expect(conflicts[0].field).toBe('title')
    expect(conflicts[0].localValue).toBe('Local Title')
    expect(conflicts[0].remoteValue).toBe('Remote Title')
    // Defaults to local
    expect(merged.title).toBe('Local Title')
  })

  it('auto-merges different fields changed on each side', () => {
    const base = createCard({ title: 'Original', description: 'Base desc' })
    const local = { ...base, title: 'New Title' }
    const remote = { ...base, description: 'New desc' }

    const { merged, conflicts } = mergeCards(base, local, remote)
    expect(merged.title).toBe('New Title')
    expect(merged.description).toBe('New desc')
    expect(conflicts).toHaveLength(0)
  })

  it('unions tags', () => {
    const base = createCard({ tags: ['bug'] })
    const local = { ...base, tags: ['bug', 'urgent'] }
    const remote = { ...base, tags: ['bug', 'feature'] }

    const { merged } = mergeCards(base, local, remote)
    expect(merged.tags).toContain('bug')
    expect(merged.tags).toContain('urgent')
    expect(merged.tags).toContain('feature')
  })

  it('merges comments by ID — keeps new from both sides', () => {
    const base = createCard({ comments: [] })
    const localComment = createComment({
      id: 'lc1',
      text: 'Local comment',
    })
    const remoteComment = createComment({
      id: 'rc1',
      text: 'Remote comment',
    })

    const local = { ...base, comments: [localComment] }
    const remote = { ...base, comments: [remoteComment] }

    const { merged } = mergeCards(base, local, remote)
    expect(merged.comments).toHaveLength(2)
    expect(merged.comments.map((c) => c.id)).toContain('lc1')
    expect(merged.comments.map((c) => c.id)).toContain('rc1')
  })

  it('handles comment deletion — remote deletes base comment', () => {
    const comment = createComment({ id: 'shared' })
    const base = createCard({ comments: [comment] })
    const local = { ...base, comments: [comment] }
    const remote = { ...base, comments: [] }

    const { merged } = mergeCards(base, local, remote)
    // Remote deleted it, so it should be gone
    expect(merged.comments).toHaveLength(0)
  })

  it('takes the latest updatedAt', () => {
    const base = createCard({ updatedAt: '2024-01-01T00:00:00.000Z' })
    const local = { ...base, updatedAt: '2024-01-02T00:00:00.000Z' }
    const remote = { ...base, updatedAt: '2024-01-03T00:00:00.000Z' }

    const { merged } = mergeCards(base, local, remote)
    expect(merged.updatedAt).toBe('2024-01-03T00:00:00.000Z')
  })
})
