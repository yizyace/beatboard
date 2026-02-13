import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useNavigate } from '@tanstack/react-router'
import { Badge } from '../shared/Badge'
import { useSettingsStore } from '../../stores/settings-store'
import type { Card as CardType } from '../../lib/schema/types'

interface CardProps {
  card: CardType
}

export function Card({ card }: CardProps) {
  const zoomLevel = useSettingsStore((s) => s.zoomLevel)
  const navigate = useNavigate()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  function handleClick() {
    navigate({ to: '/board/card/$cardId', params: { cardId: card.id } })
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={`cursor-pointer rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800 ${
        isDragging ? 'opacity-50 shadow-lg' : ''
      }`}
    >
      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
        {card.title}
      </h4>

      {zoomLevel !== 'compact' && card.tags.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {card.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      )}

      {zoomLevel === 'expanded' && card.description && (
        <p className="mt-2 text-xs text-gray-500 line-clamp-2 dark:text-gray-400">
          {card.description}
        </p>
      )}

      {zoomLevel !== 'compact' && card.comments.length > 0 && (
        <div className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
          {card.comments.length} comment{card.comments.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}
