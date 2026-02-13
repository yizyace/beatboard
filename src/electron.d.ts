export interface ElectronAPI {
  getHomePath(): Promise<string>
  execGit(args: string[], cwd: string): Promise<string>
  readFile(filePath: string): Promise<string>
  writeFile(filePath: string, content: string): Promise<void>
  readDir(dirPath: string): Promise<string[]>
  exists(filePath: string): Promise<boolean>
  mkdir(dirPath: string): Promise<void>
  remove(filePath: string): Promise<void>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
