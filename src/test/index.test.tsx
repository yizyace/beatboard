import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import {
  createRouter,
  createMemoryHistory,
  RouterProvider,
} from '@tanstack/react-router'
import { routeTree } from '../routeTree.gen'

function renderWithRouter(initialPath = '/') {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  })
  return render(<RouterProvider router={router} />)
}

describe('Index page', () => {
  it('renders hello world', async () => {
    renderWithRouter('/')
    expect(await screen.findByText('Hello World')).toBeInTheDocument()
  })
})
