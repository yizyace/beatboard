import { contextBridge, ipcRenderer } from 'electron'

const electronAPI = {
  getHomePath: (): Promise<string> =>
    ipcRenderer.invoke('app:homePath'),

  execGit: (args: string[], cwd: string): Promise<string> =>
    ipcRenderer.invoke('git:exec', args, cwd),

  readFile: (filePath: string): Promise<string> =>
    ipcRenderer.invoke('fs:read', filePath),

  writeFile: (filePath: string, content: string): Promise<void> =>
    ipcRenderer.invoke('fs:write', filePath, content),

  readDir: (dirPath: string): Promise<string[]> =>
    ipcRenderer.invoke('fs:readDir', dirPath),

  exists: (filePath: string): Promise<boolean> =>
    ipcRenderer.invoke('fs:exists', filePath),

  mkdir: (dirPath: string): Promise<void> =>
    ipcRenderer.invoke('fs:mkdir', dirPath),

  remove: (filePath: string): Promise<void> =>
    ipcRenderer.invoke('fs:remove', filePath),
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)

export type ElectronAPI = typeof electronAPI
