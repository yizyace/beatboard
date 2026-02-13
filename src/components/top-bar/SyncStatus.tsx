import { Badge } from '../shared/Badge'
import { useSyncStore } from '../../stores/sync-store'
import type { SyncStatusType } from '../../lib/schema/types'

const statusConfig: Record<
  SyncStatusType,
  { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'default' }
> = {
  idle: { label: 'Synced', variant: 'success' },
  syncing: { label: 'Syncing...', variant: 'info' },
  offline: { label: 'Offline', variant: 'warning' },
  conflict: { label: 'Conflict', variant: 'error' },
  error: { label: 'Error', variant: 'error' },
}

export function SyncStatus() {
  const status = useSyncStore((s) => s.status)
  const pendingCount = useSyncStore((s) => s.pendingCommitCount)
  const config = statusConfig[status]

  return (
    <div className="flex items-center gap-2">
      <Badge variant={config.variant}>{config.label}</Badge>
      {pendingCount > 0 && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {pendingCount} pending
        </span>
      )}
    </div>
  )
}
