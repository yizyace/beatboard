import { execGit } from './git-command'

export async function gitClone(url: string, dest: string): Promise<string> {
  return execGit(['clone', url, dest], '.')
}

export async function gitFetch(cwd: string): Promise<string> {
  return execGit(['fetch', 'origin'], cwd)
}

export async function gitRebase(cwd: string): Promise<string> {
  return execGit(['rebase', 'origin/main'], cwd)
}

export async function gitAdd(cwd: string, files: string[]): Promise<string> {
  return execGit(['add', ...files], cwd)
}

export async function gitCommit(
  cwd: string,
  message: string,
): Promise<string> {
  return execGit(['commit', '-m', message], cwd)
}

export async function gitPush(cwd: string): Promise<string> {
  return execGit(['push', 'origin', 'main'], cwd)
}

export async function gitLog(
  cwd: string,
  maxCount = 20,
): Promise<string> {
  return execGit(
    ['log', `--max-count=${maxCount}`, '--format=%H %s'],
    cwd,
  )
}

export async function gitDiffTree(
  cwd: string,
  fromSha: string,
  toSha: string,
): Promise<string> {
  return execGit(
    ['diff-tree', '-r', '--name-status', fromSha, toSha],
    cwd,
  )
}

export async function gitRevParse(
  cwd: string,
  ref: string,
): Promise<string> {
  const result = await execGit(['rev-parse', ref], cwd)
  return result.trim()
}

export async function gitStatus(cwd: string): Promise<string> {
  return execGit(['status', '--porcelain'], cwd)
}

export async function gitCurrentBranch(cwd: string): Promise<string> {
  const result = await execGit(['rev-parse', '--abbrev-ref', 'HEAD'], cwd)
  return result.trim()
}

export async function gitHasRemote(cwd: string): Promise<boolean> {
  try {
    const result = await execGit(['remote'], cwd)
    return result.trim().length > 0
  } catch {
    return false
  }
}

export async function gitUnpushedCount(cwd: string): Promise<number> {
  try {
    const result = await execGit(
      ['rev-list', '--count', 'origin/main..HEAD'],
      cwd,
    )
    return parseInt(result.trim(), 10)
  } catch {
    return 0
  }
}
