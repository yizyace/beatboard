import { describe, it, expect } from 'vitest'
import {
  getOrderKeyBetween,
  getOrderKeyForEnd,
  getOrderKeyForStart,
  generateOrderKeys,
} from '../lib/schema/fractional-index'

describe('fractional-index', () => {
  it('generates a key for end of list', () => {
    const key = getOrderKeyForEnd(null)
    expect(typeof key).toBe('string')
    expect(key.length).toBeGreaterThan(0)
  })

  it('generates a key after an existing key', () => {
    const first = getOrderKeyForEnd(null)
    const second = getOrderKeyForEnd(first)
    expect(second > first).toBe(true)
  })

  it('generates a key for start of list', () => {
    const first = getOrderKeyForEnd(null)
    const before = getOrderKeyForStart(first)
    expect(before < first).toBe(true)
  })

  it('generates a key between two keys', () => {
    const first = getOrderKeyForEnd(null)
    const second = getOrderKeyForEnd(first)
    const between = getOrderKeyBetween(first, second)
    expect(between > first).toBe(true)
    expect(between < second).toBe(true)
  })

  it('generates multiple ordered keys', () => {
    const keys = generateOrderKeys(5)
    expect(keys).toHaveLength(5)
    for (let i = 1; i < keys.length; i++) {
      expect(keys[i] > keys[i - 1]).toBe(true)
    }
  })
})
