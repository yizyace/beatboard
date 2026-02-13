import {
  gitFetch,
  gitRebase,
  gitRevParse,
  gitDiffTree,
  gitPush,
  gitUnpushedCount,
} from '../git/git-operations'
import { readAllBoards } from '../repo/repo-reader'
import { writeLastSeen, readLastSeen } from '../repo/settings'
import { parseDiffTree, getAffectedBoardIds } from './change-detector'
import { useBoardStore } from '../../stores/board-store'
import { useSyncStore } from '../../stores/sync-store'

let syncTimer: ReturnType<typeof setTimeout> | null = null
let isSyncing = false

export async function syncTick(
  repoPath: string,
): Promise<void> {
  if (isSyncing) return
  isSyncing = true

  const syncStore = useSyncStore.getState()
  syncStore.setStatus('syncing')

  try {
    // 1. Try to fetch
    try {
      await gitFetch(repoPath)
      if (!syncStore.isOnline) {
        syncStore.setOnline(true)
      }
    } catch {
      syncStore.setOnline(false)
      syncStore.setStatus('offline')
      // Still update pending count
      const pending = await gitUnpushedCount(repoPath).catch(() => 0)
      syncStore.setPendingCommitCount(pending)
      return
    }

    // 2. Check if we're behind
    const localHead = await gitRevParse(repoPath, 'HEAD')
    const remoteHead = await gitRevParse(repoPath, 'origin/main').catch(
      () => localHead,
    )
    const lastSeen = await readLastSeen()

    if (localHead !== remoteHead) {
      // 3. Rebase
      try {
        await gitRebase(repoPath)
      } catch (err) {
        syncStore.setStatus('error')
        syncStore.setError(
          `Rebase failed: ${err instanceof Error ? err.message : 'unknown'}`,
        )
        return
      }
    }

    // 4. Detect changes since last seen
    const currentHead = await gitRevParse(repoPath, 'HEAD')
    const baseCommit = lastSeen?.commitSha ?? currentHead

    if (baseCommit !== currentHead) {
      const diffOutput = await gitDiffTree(repoPath, baseCommit, currentHead)
      const changes = parseDiffTree(diffOutput)
      const affectedBoards = getAffectedBoardIds(changes)

      if (affectedBoards.length > 0) {
        // 5. Reload data
        const allData = await readAllBoards(repoPath)
        const boards = allData.map((d) => d.board)
        const cards = allData.flatMap((d) => d.cards)
        useBoardStore.getState().replaceAll(boards, cards)
      }
    }

    // 6. Push any unpushed commits
    const pendingCount = await gitUnpushedCount(repoPath)
    syncStore.setPendingCommitCount(pendingCount)
    if (pendingCount > 0) {
      try {
        await gitPush(repoPath)
        syncStore.setPendingCommitCount(0)
      } catch {
        // Push failed — will retry next tick
      }
    }

    // 7. Update last seen
    const finalHead = await gitRevParse(repoPath, 'HEAD')
    await writeLastSeen({
      commitSha: finalHead,
      timestamp: new Date().toISOString(),
    })

    syncStore.setLastSyncedAt(new Date().toISOString())
    syncStore.setStatus('idle')
  } catch (err) {
    syncStore.setStatus('error')
    syncStore.setError(
      err instanceof Error ? err.message : 'Sync failed',
    )
  } finally {
    isSyncing = false
  }
}

export function startSyncLoop(
  repoPath: string,
  intervalMs: number,
): void {
  stopSyncLoop()

  const tick = async () => {
    await syncTick(repoPath)
    syncTimer = setTimeout(tick, intervalMs)
  }

  // Start first tick after a short delay
  syncTimer = setTimeout(tick, 1000)
}

export function stopSyncLoop(): void {
  if (syncTimer !== null) {
    clearTimeout(syncTimer)
    syncTimer = null
  }
}

export async function triggerSync(repoPath: string): Promise<void> {
  await syncTick(repoPath)
}
