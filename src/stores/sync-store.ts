import { create } from 'zustand'
import type { ConflictSet, SyncStatusType } from '../lib/schema/types'

interface SyncState {
  status: SyncStatusType
  isOnline: boolean
  lastSyncedAt: string | null
  pendingCommitCount: number
  error: string | null
  conflicts: ConflictSet[]

  setStatus: (status: SyncStatusType) => void
  setOnline: (online: boolean) => void
  setLastSyncedAt: (timestamp: string) => void
  setPendingCommitCount: (count: number) => void
  setError: (error: string | null) => void
  setConflicts: (conflicts: ConflictSet[]) => void
  resolveConflict: (cardId: string) => void
  clearConflicts: () => void
}

export const useSyncStore = create<SyncState>((set) => ({
  status: 'idle',
  isOnline: true,
  lastSyncedAt: null,
  pendingCommitCount: 0,
  error: null,
  conflicts: [],

  setStatus: (status) => set({ status }),
  setOnline: (isOnline) => set({ isOnline }),
  setLastSyncedAt: (lastSyncedAt) => set({ lastSyncedAt }),
  setPendingCommitCount: (pendingCommitCount) => set({ pendingCommitCount }),
  setError: (error) => set({ error }),
  setConflicts: (conflicts) =>
    set({ conflicts, status: conflicts.length > 0 ? 'conflict' : 'idle' }),
  resolveConflict: (cardId) =>
    set((state) => {
      const conflicts = state.conflicts.filter((c) => c.cardId !== cardId)
      return {
        conflicts,
        status: conflicts.length > 0 ? 'conflict' : 'idle',
      }
    }),
  clearConflicts: () => set({ conflicts: [], status: 'idle' }),
}))
