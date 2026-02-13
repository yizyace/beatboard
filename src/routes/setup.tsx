import { createFileRoute } from '@tanstack/react-router'
import { SetupFlow } from '../components/setup/SetupFlow'

export const Route = createFileRoute('/setup')({
  component: SetupFlow,
})
