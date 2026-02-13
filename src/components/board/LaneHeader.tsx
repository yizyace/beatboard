import type { Lane } from '../../lib/schema/types'

interface LaneHeaderProps {
  lane: Lane
  cardCount: number
}

export function LaneHeader({ lane, cardCount }: LaneHeaderProps) {
  return (
    <div className="flex items-center justify-between px-1 pb-3">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {lane.title}
      </h3>
      <span className="text-xs text-gray-400 dark:text-gray-500">
        {cardCount}
      </span>
    </div>
  )
}
