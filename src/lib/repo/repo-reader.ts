import type { Board, Card, GitBoardConfig } from '../schema/types'
import {
  BoardSchema,
  CardSchema,
  GitBoardConfigSchema,
} from '../schema/validators'

const api = () => window.electronAPI

export async function readGitBoardConfig(
  repoPath: string,
): Promise<GitBoardConfig> {
  const content = await api().readFile(`${repoPath}/gitboard.json`)
  return GitBoardConfigSchema.parse(JSON.parse(content))
}

export async function readBoard(
  repoPath: string,
  boardId: string,
): Promise<Board> {
  const content = await api().readFile(
    `${repoPath}/boards/${boardId}/board.json`,
  )
  return BoardSchema.parse(JSON.parse(content))
}

export async function readCard(
  repoPath: string,
  boardId: string,
  cardId: string,
): Promise<Card> {
  const content = await api().readFile(
    `${repoPath}/boards/${boardId}/cards/${cardId}.json`,
  )
  return CardSchema.parse(JSON.parse(content))
}

export async function readAllCards(
  repoPath: string,
  boardId: string,
): Promise<Card[]> {
  const cardsDir = `${repoPath}/boards/${boardId}/cards`
  const dirExists = await api().exists(cardsDir)
  if (!dirExists) return []

  const files = await api().readDir(cardsDir)
  const cardFiles = files.filter((f) => f.endsWith('.json'))

  const cards: Card[] = []
  for (const file of cardFiles) {
    try {
      const content = await api().readFile(`${cardsDir}/${file}`)
      cards.push(CardSchema.parse(JSON.parse(content)))
    } catch {
      console.warn(`Failed to parse card file: ${file}`)
    }
  }

  return cards
}

export async function readAllBoards(
  repoPath: string,
): Promise<{ board: Board; cards: Card[] }[]> {
  const config = await readGitBoardConfig(repoPath)
  const results: { board: Board; cards: Card[] }[] = []

  for (const boardId of config.boards) {
    const board = await readBoard(repoPath, boardId)
    const cards = await readAllCards(repoPath, boardId)
    results.push({ board, cards })
  }

  return results
}
