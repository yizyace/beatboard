export interface Card {
  id: string
  title: string
  description: string
  tags: string[]
  comments: Comment[]
  laneId: string
  orderKey: string
  createdAt: string
  updatedAt: string
  author: string
}

export interface Comment {
  id: string
  text: string
  author: string
  createdAt: string
}

export interface Lane {
  id: string
  title: string
  orderKey: string
}

export interface Board {
  id: string
  name: string
  lanes: Lane[]
}

export interface GitBoardConfig {
  version: number
  boards: string[]
}

export interface AppSettings {
  repoUrl: string
  localRepoPath: string
  pollIntervalMs: number
  author: string
  zoomLevel: ZoomLevel
}

export interface LastSeen {
  commitSha: string
  timestamp: string
}

export type ZoomLevel = 'compact' | 'normal' | 'expanded'

export type SyncStatusType = 'idle' | 'syncing' | 'offline' | 'conflict' | 'error'

export interface SyncStatus {
  status: SyncStatusType
  lastSyncedAt: string | null
  pendingCommitCount: number
  error: string | null
}

export interface ConflictInfo {
  cardId: string
  field: string
  localValue: unknown
  remoteValue: unknown
  baseValue: unknown
}

export interface ConflictSet {
  cardId: string
  cardTitle: string
  conflicts: ConflictInfo[]
  localCard: Card
  remoteCard: Card
  baseCard: Card
}
