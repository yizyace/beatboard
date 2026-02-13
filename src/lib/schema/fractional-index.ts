import { generateKeyBetween } from 'fractional-indexing'

export function getOrderKeyBetween(
  before: string | null,
  after: string | null,
): string {
  return generateKeyBetween(before, after)
}

export function getOrderKeyForEnd(lastKey: string | null): string {
  return generateKeyBetween(lastKey, null)
}

export function getOrderKeyForStart(firstKey: string | null): string {
  return generateKeyBetween(null, firstKey)
}

export function generateOrderKeys(count: number): string[] {
  const keys: string[] = []
  let prev: string | null = null
  for (let i = 0; i < count; i++) {
    const key = generateKeyBetween(prev, null)
    keys.push(key)
    prev = key
  }
  return keys
}
