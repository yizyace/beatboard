import { ipcMain, app } from 'electron'
import { execFile } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'

export function registerIpcHandlers(): void {
  ipcMain.handle('app:homePath', (): string => {
    return os.homedir()
  })

  ipcMain.handle('app:userDataPath', (): string => {
    return app.getPath('userData')
  })
  ipcMain.handle(
    'git:exec',
    async (_event, args: string[], cwd: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        execFile('git', args, { cwd, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
          if (error) {
            reject(new Error(`git ${args.join(' ')} failed: ${stderr || error.message}`))
          } else {
            resolve(stdout)
          }
        })
      })
    },
  )

  ipcMain.handle(
    'fs:read',
    async (_event, filePath: string): Promise<string> => {
      return fs.readFile(filePath, 'utf-8')
    },
  )

  ipcMain.handle(
    'fs:write',
    async (_event, filePath: string, content: string): Promise<void> => {
      await fs.mkdir(path.dirname(filePath), { recursive: true })
      await fs.writeFile(filePath, content, 'utf-8')
    },
  )

  ipcMain.handle(
    'fs:readDir',
    async (_event, dirPath: string): Promise<string[]> => {
      try {
        const entries = await fs.readdir(dirPath)
        return entries
      } catch {
        return []
      }
    },
  )

  ipcMain.handle(
    'fs:exists',
    async (_event, filePath: string): Promise<boolean> => {
      try {
        await fs.access(filePath)
        return true
      } catch {
        return false
      }
    },
  )

  ipcMain.handle(
    'fs:mkdir',
    async (_event, dirPath: string): Promise<void> => {
      await fs.mkdir(dirPath, { recursive: true })
    },
  )

  ipcMain.handle(
    'fs:remove',
    async (_event, filePath: string): Promise<void> => {
      await fs.rm(filePath, { recursive: true, force: true })
    },
  )
}
