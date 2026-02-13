import { create } from 'zustand'
import type { AppSettings, ZoomLevel } from '../lib/schema/types'

interface SettingsState {
  repoUrl: string
  localRepoPath: string
  pollIntervalMs: number
  author: string
  zoomLevel: ZoomLevel
  isConfigured: boolean

  setSettings: (settings: AppSettings) => void
  setRepoUrl: (url: string) => void
  setLocalRepoPath: (path: string) => void
  setPollInterval: (ms: number) => void
  setAuthor: (author: string) => void
  setZoomLevel: (level: ZoomLevel) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  repoUrl: '',
  localRepoPath: '',
  pollIntervalMs: 30_000,
  author: 'Unknown',
  zoomLevel: 'normal',
  isConfigured: false,

  setSettings: (settings) =>
    set({
      ...settings,
      isConfigured: true,
    }),

  setRepoUrl: (repoUrl) => set({ repoUrl }),
  setLocalRepoPath: (localRepoPath) => set({ localRepoPath }),
  setPollInterval: (pollIntervalMs) => set({ pollIntervalMs }),
  setAuthor: (author) => set({ author }),
  setZoomLevel: (zoomLevel) => set({ zoomLevel }),
}))
