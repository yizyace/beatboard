import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// Mock window.electronAPI for all tests
const mockElectronAPI = {
  getHomePath: vi.fn().mockResolvedValue('/mock/home'),
  execGit: vi.fn().mockResolvedValue(''),
  readFile: vi.fn().mockRejectedValue(new Error('File not found')),
  writeFile: vi.fn().mockResolvedValue(undefined),
  readDir: vi.fn().mockResolvedValue([]),
  exists: vi.fn().mockResolvedValue(false),
  mkdir: vi.fn().mockResolvedValue(undefined),
  remove: vi.fn().mockResolvedValue(undefined),
}

Object.defineProperty(window, 'electronAPI', {
  value: mockElectronAPI,
  writable: true,
})
