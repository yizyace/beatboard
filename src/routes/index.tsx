import { createFileRoute, redirect } from '@tanstack/react-router'
import { readSettings } from '../lib/repo/settings'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    try {
      const settings = await readSettings()
      if (settings) {
        throw redirect({ to: '/board' })
      }
    } catch (err) {
      // Re-throw redirects
      if (
        err &&
        typeof err === 'object' &&
        'to' in err
      ) {
        throw err
      }
      // Settings don't exist — go to setup
    }
    throw redirect({ to: '/setup' })
  },
})
