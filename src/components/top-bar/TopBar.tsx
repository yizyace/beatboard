import { SyncStatus } from './SyncStatus'
import { ZoomControl } from './ZoomControl'
import { PollingControl } from './PollingControl'
import { BoardSelector } from './BoardSelector'
import { Button } from '../shared/Button'
import { useSync } from '../../hooks/use-sync'

export function TopBar() {
  const { triggerSync } = useSync()

  return (
    <header className="flex h-12 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-4">
        <BoardSelector />
      </div>

      <div className="flex items-center gap-3">
        <SyncStatus />
        <PollingControl />
        <ZoomControl />
        <Button variant="ghost" size="sm" onClick={triggerSync}>
          Sync
        </Button>
      </div>
    </header>
  )
}
