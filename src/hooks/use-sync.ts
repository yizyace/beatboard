import { useEffect, useCallback } from 'react'
import {
  startSyncLoop,
  stopSyncLoop,
  triggerSync,
} from '../lib/sync/synchronizer'
import { useSettingsStore } from '../stores/settings-store'

export function useSync() {
  const repoPath = useSettingsStore((s) => s.localRepoPath)
  const pollIntervalMs = useSettingsStore((s) => s.pollIntervalMs)

  useEffect(() => {
    if (!repoPath) return

    startSyncLoop(repoPath, pollIntervalMs)
    return () => stopSyncLoop()
  }, [repoPath, pollIntervalMs])

  const sync = useCallback(async () => {
    if (!repoPath) return
    await triggerSync(repoPath)
  }, [repoPath])

  return { triggerSync: sync }
}
