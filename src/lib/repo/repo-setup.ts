import { gitClone } from '../git/git-operations'
import { generateOrderKeys } from '../schema/fractional-index'
import type { Board, GitBoardConfig } from '../schema/types'
import { writeBoard, writeGitBoardConfig } from './repo-writer'
import { gitAdd, gitCommit } from '../git/git-operations'

const api = () => window.electronAPI

export async function cloneRepo(
  url: string,
  localPath: string,
): Promise<void> {
  await gitClone(url, localPath)
}

export async function isGitBoardRepo(localPath: string): Promise<boolean> {
  return api().exists(`${localPath}/gitboard.json`)
}

export async function scaffoldDefaultBoard(
  localPath: string,
): Promise<Board> {
  const boardId = 'main'
  const laneKeys = generateOrderKeys(3)

  const board: Board = {
    id: boardId,
    name: 'Main Board',
    lanes: [
      { id: 'todo', title: 'Todo', orderKey: laneKeys[0] },
      { id: 'doing', title: 'Doing', orderKey: laneKeys[1] },
      { id: 'done', title: 'Done', orderKey: laneKeys[2] },
    ],
  }

  const config: GitBoardConfig = {
    version: 1,
    boards: [boardId],
  }

  // Create directory structure
  await api().mkdir(`${localPath}/boards/${boardId}/cards`)

  // Write files
  await writeGitBoardConfig(localPath, config)
  await writeBoard(localPath, board)

  // Commit scaffold
  await gitAdd(localPath, ['.'])
  await gitCommit(localPath, 'feat: scaffold default gitboard')

  return board
}

export async function setupRepo(
  url: string,
  localPath: string,
): Promise<Board> {
  await cloneRepo(url, localPath)

  const hasConfig = await isGitBoardRepo(localPath)
  if (hasConfig) {
    // Existing GitBoard repo — read the first board
    const { readBoard, readGitBoardConfig } = await import('./repo-reader')
    const config = await readGitBoardConfig(localPath)
    return readBoard(localPath, config.boards[0])
  }

  // Empty/non-gitboard repo — scaffold
  return scaffoldDefaultBoard(localPath)
}
