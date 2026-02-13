import { useBoardStore } from '../../stores/board-store'

export function BoardSelector() {
  const boards = useBoardStore((s) => s.boards)
  const activeBoardId = useBoardStore((s) => s.activeBoardId)
  const setActiveBoardId = useBoardStore((s) => s.setActiveBoardId)

  if (boards.length <= 1) {
    const name = boards[0]?.name ?? 'Board'
    return (
      <span className="text-sm font-semibold text-gray-900 dark:text-white">
        {name}
      </span>
    )
  }

  return (
    <select
      value={activeBoardId ?? ''}
      onChange={(e) => setActiveBoardId(e.target.value)}
      className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm font-semibold text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
    >
      {boards.map((b) => (
        <option key={b.id} value={b.id}>
          {b.name}
        </option>
      ))}
    </select>
  )
}
