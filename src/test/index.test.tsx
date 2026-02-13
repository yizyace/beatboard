import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithRouter } from './test-utils'

describe('Index page', () => {
  it('redirects to setup when not configured', async () => {
    renderWithRouter('/')
    // Should redirect to setup and show the setup form
    expect(await screen.findByText('GitBoard')).toBeInTheDocument()
  })
})

describe('Setup page', () => {
  it('renders setup flow', async () => {
    renderWithRouter('/setup')
    expect(await screen.findByText('GitBoard')).toBeInTheDocument()
    expect(
      await screen.findByText(/Connect a GitHub repository/),
    ).toBeInTheDocument()
  })

  it('renders repo URL input', async () => {
    renderWithRouter('/setup')
    expect(
      await screen.findByLabelText('Repository URL'),
    ).toBeInTheDocument()
  })
})
