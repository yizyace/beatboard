export interface FileChange {
  status: 'A' | 'M' | 'D'
  path: string
  type: 'board' | 'card' | 'config' | 'unknown'
  boardId?: string
  cardId?: string
}

/**
 * Parse git diff-tree output into structured change objects.
 * Each line looks like: "M\tboards/main/cards/c_123.json"
 */
export function parseDiffTree(output: string): FileChange[] {
  if (!output.trim()) return []

  return output
    .trim()
    .split('\n')
    .map((line) => {
      const [status, path] = line.split('\t')
      if (!status || !path) return null

      const change: FileChange = {
        status: status as FileChange['status'],
        path,
        type: 'unknown',
      }

      if (path === 'gitboard.json') {
        change.type = 'config'
      } else if (path.match(/^boards\/([^/]+)\/board\.json$/)) {
        change.type = 'board'
        change.boardId = path.split('/')[1]
      } else if (path.match(/^boards\/([^/]+)\/cards\/([^/]+)\.json$/)) {
        change.type = 'card'
        const parts = path.split('/')
        change.boardId = parts[1]
        change.cardId = parts[3].replace('.json', '')
      }

      return change
    })
    .filter((c): c is FileChange => c !== null)
}

/**
 * Determine which boards need reloading based on detected changes.
 */
export function getAffectedBoardIds(changes: FileChange[]): string[] {
  const boardIds = new Set<string>()
  for (const change of changes) {
    if (change.boardId) {
      boardIds.add(change.boardId)
    }
    if (change.type === 'config') {
      // Config change means all boards may be affected
      return ['__all__']
    }
  }
  return Array.from(boardIds)
}
