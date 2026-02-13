import type { AppSettings, LastSeen } from '../schema/types'
import { AppSettingsSchema, LastSeenSchema } from '../schema/validators'

const SETTINGS_DIR = '.gitboard'
const SETTINGS_FILE = 'settings.json'
const LAST_SEEN_FILE = 'last_seen.json'

const api = () => window.electronAPI

let cachedHome: string | null = null

async function getHome(): Promise<string> {
  if (cachedHome) return cachedHome
  cachedHome = await api().getHomePath()
  return cachedHome
}

async function settingsPath(): Promise<string> {
  const home = await getHome()
  return `${home}/${SETTINGS_DIR}`
}

export async function readSettings(): Promise<AppSettings | null> {
  const dir = await settingsPath()
  try {
    const content = await api().readFile(`${dir}/${SETTINGS_FILE}`)
    return AppSettingsSchema.parse(JSON.parse(content))
  } catch {
    return null
  }
}

export async function writeSettings(settings: AppSettings): Promise<void> {
  const dir = await settingsPath()
  await api().mkdir(dir)
  await api().writeFile(
    `${dir}/${SETTINGS_FILE}`,
    JSON.stringify(settings, null, 2) + '\n',
  )
}

export async function readLastSeen(): Promise<LastSeen | null> {
  const dir = await settingsPath()
  try {
    const content = await api().readFile(`${dir}/${LAST_SEEN_FILE}`)
    return LastSeenSchema.parse(JSON.parse(content))
  } catch {
    return null
  }
}

export async function writeLastSeen(lastSeen: LastSeen): Promise<void> {
  const dir = await settingsPath()
  await api().mkdir(dir)
  await api().writeFile(
    `${dir}/${LAST_SEEN_FILE}`,
    JSON.stringify(lastSeen, null, 2) + '\n',
  )
}
