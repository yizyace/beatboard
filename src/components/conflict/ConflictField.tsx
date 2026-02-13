import type { ConflictInfo } from '../../lib/schema/types'
import { Button } from '../shared/Button'

interface ConflictFieldProps {
  conflict: ConflictInfo
  onResolve: (value: unknown) => void
}

export function ConflictField({ conflict, onResolve }: ConflictFieldProps) {
  return (
    <div className="rounded-md border border-yellow-300 p-3 dark:border-yellow-700">
      <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        {conflict.field}
      </h4>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
            Local
          </p>
          <div className="rounded bg-blue-50 p-2 text-xs text-gray-800 dark:bg-blue-900/20 dark:text-gray-200">
            {String(conflict.localValue)}
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onResolve(conflict.localValue)}
            className="w-full"
          >
            Keep Local
          </Button>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-green-600 dark:text-green-400">
            Remote
          </p>
          <div className="rounded bg-green-50 p-2 text-xs text-gray-800 dark:bg-green-900/20 dark:text-gray-200">
            {String(conflict.remoteValue)}
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onResolve(conflict.remoteValue)}
            className="w-full"
          >
            Keep Remote
          </Button>
        </div>
      </div>
    </div>
  )
}
