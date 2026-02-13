import { describe, it, expect } from 'vitest'
import { buildCommitMessage } from '../lib/sync/commit-builder'

describe('commit-builder', () => {
  it('builds add-card message', () => {
    const msg = buildCommitMessage({
      type: 'add-card',
      cardId: 'c_123',
      title: 'My Card',
      laneTitle: 'Todo',
    })
    expect(msg).toBe('card(c_123): add "My Card" to Todo')
  })

  it('builds update-card message', () => {
    const msg = buildCommitMessage({
      type: 'update-card',
      cardId: 'c_123',
      title: 'My Card',
      fields: ['title', 'description'],
    })
    expect(msg).toBe('card(c_123): update title, description')
  })

  it('builds delete-card message', () => {
    const msg = buildCommitMessage({
      type: 'delete-card',
      cardId: 'c_123',
      title: 'My Card',
    })
    expect(msg).toBe('card(c_123): delete "My Card"')
  })

  it('builds move-card message', () => {
    const msg = buildCommitMessage({
      type: 'move-card',
      cardId: 'c_123',
      title: 'My Card',
      toLaneTitle: 'Doing',
    })
    expect(msg).toBe('card(c_123): move to Doing')
  })

  it('builds add-lane message', () => {
    const msg = buildCommitMessage({
      type: 'add-lane',
      laneId: 'lane_1',
      title: 'New Lane',
    })
    expect(msg).toBe('lane(lane_1): add "New Lane"')
  })

  it('builds add-comment message', () => {
    const msg = buildCommitMessage({
      type: 'add-comment',
      cardId: 'c_123',
      cardTitle: 'My Card',
    })
    expect(msg).toBe('card(c_123): add comment')
  })

  it('builds delete-comment message', () => {
    const msg = buildCommitMessage({
      type: 'delete-comment',
      cardId: 'c_123',
      cardTitle: 'My Card',
    })
    expect(msg).toBe('card(c_123): delete comment')
  })
})
