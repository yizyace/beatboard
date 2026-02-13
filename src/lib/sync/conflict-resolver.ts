import type { Card, Comment, ConflictInfo } from '../schema/types'

/**
 * Three-way merge for card JSON.
 * Returns merged card + any unresolvable conflicts.
 */
export function mergeCards(
  base: Card,
  local: Card,
  remote: Card,
): { merged: Card; conflicts: ConflictInfo[] } {
  const conflicts: ConflictInfo[] = []
  const merged = { ...base }

  // Scalar fields: take whichever side changed, conflict if both changed differently
  const scalarFields = [
    'title',
    'description',
    'laneId',
    'orderKey',
    'author',
  ] as const

  for (const field of scalarFields) {
    const baseVal = base[field]
    const localVal = local[field]
    const remoteVal = remote[field]

    if (localVal === remoteVal) {
      // Same change or no change
      merged[field] = localVal as never
    } else if (localVal === baseVal) {
      // Only remote changed
      merged[field] = remoteVal as never
    } else if (remoteVal === baseVal) {
      // Only local changed
      merged[field] = localVal as never
    } else {
      // Both changed differently — conflict
      conflicts.push({
        cardId: base.id,
        field,
        localValue: localVal,
        remoteValue: remoteVal,
        baseValue: baseVal,
      })
      // Default to local for now; conflict UI will resolve
      merged[field] = localVal as never
    }
  }

  // Tags: union as set
  merged.tags = Array.from(
    new Set([...local.tags, ...remote.tags]),
  ).sort()

  // Comments: merge by ID
  merged.comments = mergeComments(base.comments, local.comments, remote.comments)

  // Timestamps: take the latest
  merged.updatedAt =
    local.updatedAt > remote.updatedAt ? local.updatedAt : remote.updatedAt
  merged.createdAt = base.createdAt

  return { merged, conflicts }
}

function mergeComments(
  base: Comment[],
  local: Comment[],
  remote: Comment[],
): Comment[] {
  const baseIds = new Set(base.map((c) => c.id))
  const localIds = new Set(local.map((c) => c.id))
  const remoteIds = new Set(remote.map((c) => c.id))

  const allIds = new Set([...localIds, ...remoteIds])
  const result: Comment[] = []

  for (const id of allIds) {
    const inBase = baseIds.has(id)
    const inLocal = localIds.has(id)
    const inRemote = remoteIds.has(id)

    if (inLocal && inRemote) {
      // Both have it — keep local version
      result.push(local.find((c) => c.id === id)!)
    } else if (inLocal && !inRemote) {
      if (inBase) {
        // Was in base, removed by remote — skip (remote deletion wins)
      } else {
        // New in local — keep
        result.push(local.find((c) => c.id === id)!)
      }
    } else if (!inLocal && inRemote) {
      if (inBase) {
        // Was in base, removed by local — skip (local deletion wins)
      } else {
        // New in remote — keep
        result.push(remote.find((c) => c.id === id)!)
      }
    }
  }

  return result.sort(
    (a, b) => a.createdAt.localeCompare(b.createdAt),
  )
}
