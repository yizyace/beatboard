import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { RepoUrlInput } from './RepoUrlInput'
import { CloningProgress } from './CloningProgress'
import { setupRepo } from '../../lib/repo/repo-setup'
import { useSettingsStore } from '../../stores/settings-store'
import { useBoardStore } from '../../stores/board-store'
import { writeSettings } from '../../lib/repo/settings'
import { readAllCards } from '../../lib/repo/repo-reader'

type SetupStep = 'input' | 'cloning' | 'error'

export function SetupFlow() {
  const [step, setStep] = useState<SetupStep>('input')
  const [progress, setProgress] = useState('Checking git availability...')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const setSettings = useSettingsStore((s) => s.setSettings)
  const { setBoards, setCards, setActiveBoardId } = useBoardStore()

  async function handleSubmit(url: string, localPath: string) {
    setStep('cloning')
    setProgress('Cloning repository...')

    try {
      const board = await setupRepo(url, localPath)

      setProgress('Loading board data...')

      const cards = await readAllCards(localPath, board.id)

      const settings = {
        repoUrl: url,
        localRepoPath: localPath,
        pollIntervalMs: 30_000,
        author: 'User',
        zoomLevel: 'normal' as const,
      }

      await writeSettings(settings)
      setSettings(settings)
      setBoards([board])
      setCards(cards)
      setActiveBoardId(board.id)

      navigate({ to: '/board' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Setup failed')
      setStep('error')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-900">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          GitBoard
        </h1>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Connect a GitHub repository to use as your Kanban board.
        </p>

        {step === 'input' && (
          <RepoUrlInput onSubmit={handleSubmit} isLoading={false} />
        )}

        {step === 'cloning' && <CloningProgress message={progress} />}

        {step === 'error' && (
          <div className="space-y-4">
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
            <button
              onClick={() => {
                setStep('input')
                setError('')
              }}
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
