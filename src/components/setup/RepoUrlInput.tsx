import { useState, useEffect } from 'react'
import { Button } from '../shared/Button'

interface RepoUrlInputProps {
  onSubmit: (url: string, localPath: string) => void
  isLoading: boolean
}

export function RepoUrlInput({ onSubmit, isLoading }: RepoUrlInputProps) {
  const [url, setUrl] = useState('')
  const [localPath, setLocalPath] = useState('')
  const [homePath, setHomePath] = useState('')

  useEffect(() => {
    window.electronAPI.getHomePath().then(setHomePath)
  }, [])

  const repoName = url
    ? (url.split('/').pop()?.replace('.git', '') ?? 'repo')
    : ''
  const defaultPath = homePath && repoName
    ? `${homePath}/gitboard-repos/${repoName}`
    : ''

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) return
    onSubmit(url.trim(), localPath.trim() || defaultPath)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="repo-url"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Repository URL
        </label>
        <input
          id="repo-url"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://github.com/user/repo.git"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          disabled={isLoading}
        />
      </div>

      <div>
        <label
          htmlFor="local-path"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Local Path
        </label>
        <input
          id="local-path"
          type="text"
          value={localPath}
          onChange={(e) => setLocalPath(e.target.value)}
          placeholder={defaultPath || 'Will be auto-generated'}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          disabled={isLoading}
        />
      </div>

      <div>
        <label
          htmlFor="author"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Your Name (for commits)
        </label>
        <input
          id="author"
          type="text"
          defaultValue=""
          placeholder="Your Name"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          disabled={isLoading}
        />
      </div>

      <Button type="submit" disabled={!url.trim() || isLoading} className="w-full">
        {isLoading ? 'Cloning...' : 'Clone & Setup'}
      </Button>
    </form>
  )
}
