import { createRootRoute, Outlet } from '@tanstack/react-router'
import { ConflictModal } from '../components/conflict/ConflictModal'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <>
      <Outlet />
      <ConflictModal />
    </>
  )
}
