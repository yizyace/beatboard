import { useSettingsStore } from '../../stores/settings-store'
import type { ZoomLevel } from '../../lib/schema/types'

const levels: ZoomLevel[] = ['compact', 'normal', 'expanded']

export function ZoomControl() {
  const zoomLevel = useSettingsStore((s) => s.zoomLevel)
  const setZoomLevel = useSettingsStore((s) => s.setZoomLevel)

  return (
    <div className="flex items-center gap-1 rounded-md border border-gray-200 dark:border-gray-700">
      {levels.map((level) => (
        <button
          key={level}
          onClick={() => setZoomLevel(level)}
          className={`px-2 py-1 text-xs capitalize transition-colors ${
            zoomLevel === level
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
          } ${level === 'compact' ? 'rounded-l-md' : ''} ${level === 'expanded' ? 'rounded-r-md' : ''}`}
          aria-label={`Zoom: ${level}`}
        >
          {level}
        </button>
      ))}
    </div>
  )
}
