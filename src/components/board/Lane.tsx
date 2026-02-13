import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { useBoardStore } from '../../stores/board-store'
import { Card } from './Card'
import { AddCard } from './AddCard'
import { LaneHeader } from './LaneHeader'
import type { Lane as LaneType } from '../../lib/schema/types'

interface LaneProps {
  lane: LaneType
}

export function Lane({ lane }: LaneProps) {
  const cards = useBoardStore((s) => s.getCardsForLane(lane.id))
  const cardIds = cards.map((c) => c.id)

  const { setNodeRef } = useDroppable({
    id: `lane:${lane.id}`,
    data: { type: 'lane', laneId: lane.id },
  })

  return (
    <div className="flex h-full w-72 flex-shrink-0 flex-col rounded-lg bg-gray-100 p-3 dark:bg-gray-850 dark:bg-gray-800/50">
      <LaneHeader lane={lane} cardCount={cards.length} />

      <div
        ref={setNodeRef}
        className="flex flex-1 flex-col gap-2 overflow-y-auto"
      >
        <SortableContext
          items={cardIds}
          strategy={verticalListSortingStrategy}
        >
          {cards.map((card) => (
            <Card key={card.id} card={card} />
          ))}
        </SortableContext>
      </div>

      <div className="mt-2">
        <AddCard laneId={lane.id} />
      </div>
    </div>
  )
}
