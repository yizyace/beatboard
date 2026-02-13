import type { Board, Card, GitBoardConfig } from '../schema/types'

const api = () => window.electronAPI

export async function writeGitBoardConfig(
  repoPath: string,
  config: GitBoardConfig,
): Promise<void> {
  await api().writeFile(
    `${repoPath}/gitboard.json`,
    JSON.stringify(config, null, 2) + '\n',
  )
}

export async function writeBoard(
  repoPath: string,
  board: Board,
): Promise<void> {
  await api().writeFile(
    `${repoPath}/boards/${board.id}/board.json`,
    JSON.stringify(board, null, 2) + '\n',
  )
}

export async function writeCard(
  repoPath: string,
  boardId: string,
  card: Card,
): Promise<void> {
  await api().writeFile(
    `${repoPath}/boards/${boardId}/cards/${card.id}.json`,
    JSON.stringify(card, null, 2) + '\n',
  )
}

export async function deleteCardFile(
  repoPath: string,
  boardId: string,
  cardId: string,
): Promise<void> {
  await api().remove(
    `${repoPath}/boards/${boardId}/cards/${cardId}.json`,
  )
}
