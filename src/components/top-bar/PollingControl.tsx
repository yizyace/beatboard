import { useSettingsStore } from '../../stores/settings-store'

const intervals = [
  { label: '10s', value: 10_000 },
  { label: '30s', value: 30_000 },
  { label: '1m', value: 60_000 },
  { label: '5m', value: 300_000 },
]

export function PollingControl() {
  const pollIntervalMs = useSettingsStore((s) => s.pollIntervalMs)
  const setPollInterval = useSettingsStore((s) => s.setPollInterval)

  return (
    <select
      value={pollIntervalMs}
      onChange={(e) => setPollInterval(Number(e.target.value))}
      className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
      aria-label="Poll interval"
    >
      {intervals.map((i) => (
        <option key={i.value} value={i.value}>
          Poll: {i.label}
        </option>
      ))}
    </select>
  )
}
