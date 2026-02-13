import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core'
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { useState } from 'react'
import { useBoardStore } from '../../stores/board-store'
import { useBoardActions } from '../../hooks/use-board-actions'
import { Lane } from './Lane'
import { Card } from './Card'
import type { Card as CardType } from '../../lib/schema/types'

export function BoardView() {
  const board = useBoardStore((s) => s.getActiveBoard())
  const cards = useBoardStore((s) => s.cards)
  const { moveCard } = useBoardActions()
  const [activeCard, setActiveCard] = useState<CardType | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  if (!board) {
    return (
      <div className="flex flex-1 items-center justify-center text-gray-500">
        No board selected
      </div>
    )
  }

  const sortedLanes = [...board.lanes].sort((a, b) =>
    a.orderKey.localeCompare(b.orderKey),
  )

  function handleDragStart(event: DragStartEvent) {
    const cardId = event.active.id as string
    const card = cards.find((c) => c.id === cardId)
    if (card) setActiveCard(card)
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return

    const activeCardId = active.id as string
    const activeCard = cards.find((c) => c.id === activeCardId)
    if (!activeCard) return

    // Determine target lane
    let targetLaneId: string | null = null

    if (typeof over.id === 'string' && over.id.startsWith('lane:')) {
      targetLaneId = over.id.replace('lane:', '')
    } else {
      const overCard = cards.find((c) => c.id === over.id)
      if (overCard) targetLaneId = overCard.laneId
    }

    // If moving to a different lane, update laneId in store (visual feedback)
    if (targetLaneId && targetLaneId !== activeCard.laneId) {
      useBoardStore.getState().updateCard(activeCardId, { laneId: targetLaneId })
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveCard(null)
    const { active, over } = event
    if (!over) return

    const activeCardId = active.id as string
    const card = cards.find((c) => c.id === activeCardId)
    if (!card) return

    // Determine target lane
    let targetLaneId = card.laneId
    if (typeof over.id === 'string' && over.id.startsWith('lane:')) {
      targetLaneId = over.id.replace('lane:', '')
    } else {
      const overCard = cards.find((c) => c.id === over.id)
      if (overCard) targetLaneId = overCard.laneId
    }

    // Calculate new position
    const laneCards = cards
      .filter((c) => c.laneId === targetLaneId && c.id !== activeCardId)
      .sort((a, b) => a.orderKey.localeCompare(b.orderKey))

    let beforeKey: string | null = null
    let afterKey: string | null = null

    if (typeof over.id === 'string' && over.id.startsWith('lane:')) {
      // Dropped on empty lane
      beforeKey = laneCards.length > 0 ? laneCards[laneCards.length - 1].orderKey : null
      afterKey = null
    } else {
      const overIndex = laneCards.findIndex((c) => c.id === over.id)
      if (overIndex >= 0) {
        beforeKey = overIndex > 0 ? laneCards[overIndex - 1].orderKey : null
        afterKey = laneCards[overIndex].orderKey
      }
    }

    await moveCard(activeCardId, targetLaneId, beforeKey, afterKey)
  }

  return (
    <div className="flex flex-1 gap-4 overflow-x-auto p-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {sortedLanes.map((lane) => (
          <Lane key={lane.id} lane={lane} />
        ))}

        <DragOverlay>
          {activeCard ? (
            <div className="rotate-3 opacity-90">
              <Card card={activeCard} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
