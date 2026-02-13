import { useBoardStore } from '../../stores/board-store'
import { useBoardActions } from '../../hooks/use-board-actions'
import { CardTitle } from './CardTitle'
import { CardDescription } from './CardDescription'
import { CardTags } from './CardTags'
import { CardComments } from './CardComments'
import { Button } from '../shared/Button'

interface CardDetailPanelProps {
  cardId: string
  onClose: () => void
}

export function CardDetailPanel({ cardId, onClose }: CardDetailPanelProps) {
  const card = useBoardStore((s) => s.getCard(cardId))
  const board = useBoardStore((s) => s.getActiveBoard())
  const { updateCard, deleteCard, addComment, deleteComment } =
    useBoardActions()

  if (!card) {
    return (
      <div className="p-6 text-gray-500">Card not found</div>
    )
  }

  const lane = board?.lanes.find((l) => l.id === card.laneId)

  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-4">
        <CardTitle
          title={card.title}
          onSave={(title) => updateCard(cardId, { title })}
        />
        {lane && (
          <p className="mt-1 px-2 text-xs text-gray-400 dark:text-gray-500">
            in {lane.title}
          </p>
        )}
      </div>

      <div className="mb-6">
        <h3 className="mb-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
          Description
        </h3>
        <CardDescription
          description={card.description}
          onSave={(description) => updateCard(cardId, { description })}
        />
      </div>

      <div className="mb-6">
        <CardTags
          tags={card.tags}
          onAdd={(tag) =>
            updateCard(cardId, { tags: [...card.tags, tag] })
          }
          onRemove={(tag) =>
            updateCard(cardId, {
              tags: card.tags.filter((t) => t !== tag),
            })
          }
        />
      </div>

      <div className="mb-6 flex-1">
        <CardComments
          comments={card.comments}
          onAdd={(text) => addComment(cardId, text)}
          onDelete={(commentId) => deleteComment(cardId, commentId)}
        />
      </div>

      <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
        <div className="mb-3 space-y-1 text-xs text-gray-400 dark:text-gray-500">
          <p>Created: {new Date(card.createdAt).toLocaleString()}</p>
          <p>Updated: {new Date(card.updatedAt).toLocaleString()}</p>
          <p>Author: {card.author}</p>
        </div>
        <Button
          variant="danger"
          size="sm"
          onClick={async () => {
            await deleteCard(cardId)
            onClose()
          }}
        >
          Delete Card
        </Button>
      </div>
    </div>
  )
}
