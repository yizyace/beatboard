import { Modal } from '../shared/Modal'
import { ConflictField } from './ConflictField'
import { useSyncStore } from '../../stores/sync-store'
import { useBoardActions } from '../../hooks/use-board-actions'
import { Button } from '../shared/Button'

export function ConflictModal() {
  const conflicts = useSyncStore((s) => s.conflicts)
  const resolveConflict = useSyncStore((s) => s.resolveConflict)
  const clearConflicts = useSyncStore((s) => s.clearConflicts)
  const { updateCard } = useBoardActions()

  const currentConflictSet = conflicts[0]
  if (!currentConflictSet) return null

  async function handleResolveField(
    field: string,
    value: unknown,
  ) {
    if (!currentConflictSet) return

    await updateCard(currentConflictSet.cardId, {
      [field]: value,
    })
  }

  function handleDismiss() {
    if (currentConflictSet) {
      resolveConflict(currentConflictSet.cardId)
    }
  }

  return (
    <Modal
      isOpen={conflicts.length > 0}
      onClose={clearConflicts}
      title={`Conflict: ${currentConflictSet.cardTitle}`}
    >
      <div className="space-y-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          This card was modified both locally and remotely. Choose which
          version to keep for each field.
        </p>

        {currentConflictSet.conflicts.map((conflict) => (
          <ConflictField
            key={conflict.field}
            conflict={conflict}
            onResolve={(value) =>
              handleResolveField(conflict.field, value)
            }
          />
        ))}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={clearConflicts}>
            Dismiss All
          </Button>
          <Button onClick={handleDismiss}>
            Resolve & Next
          </Button>
        </div>
      </div>
    </Modal>
  )
}
