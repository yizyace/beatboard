/**
 * Single I/O boundary for all git operations.
 * All git interaction in the app flows through this function.
 */
export async function execGit(args: string[], cwd: string): Promise<string> {
  return window.electronAPI.execGit(args, cwd)
}
