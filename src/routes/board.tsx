import { createFileRoute, Outlet } from '@tanstack/react-router'
import { TopBar } from '../components/top-bar/TopBar'
import { BoardView } from '../components/board/BoardView'
import { useSettingsStore } from '../stores/settings-store'
import { useBoardStore } from '../stores/board-store'
import { readSettings } from '../lib/repo/settings'
import { readAllBoards } from '../lib/repo/repo-reader'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/board')({
  component: BoardPage,
})

function BoardPage() {
  const isConfigured = useSettingsStore((s) => s.isConfigured)
  const setSettings = useSettingsStore((s) => s.setSettings)
  const { setBoards, setCards, setActiveBoardId, activeBoardId } =
    useBoardStore()
  const [loading, setLoading] = useState(!isConfigured)

  useEffect(() => {
    if (isConfigured) return

    async function loadData() {
      try {
        const settings = await readSettings()
        if (!settings) return

        setSettings(settings)

        const allData = await readAllBoards(settings.localRepoPath)
        const boards = allData.map((d) => d.board)
        const cards = allData.flatMap((d) => d.cards)

        setBoards(boards)
        setCards(cards)
        if (boards.length > 0 && !activeBoardId) {
          setActiveBoardId(boards[0].id)
        }
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [isConfigured, setSettings, setBoards, setCards, setActiveBoardId, activeBoardId])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <TopBar />
      <BoardView />
      <Outlet />
    </div>
  )
}
