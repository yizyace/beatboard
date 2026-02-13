import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { SlidePanel } from '../components/shared/SlidePanel'
import { CardDetailPanel } from '../components/card-detail/CardDetailPanel'

export const Route = createFileRoute('/board/card/$cardId')({
  component: CardDetailRoute,
})

function CardDetailRoute() {
  const { cardId } = Route.useParams()
  const navigate = useNavigate()

  function handleClose() {
    navigate({ to: '/board' })
  }

  return (
    <SlidePanel isOpen onClose={handleClose}>
      <CardDetailPanel cardId={cardId} onClose={handleClose} />
    </SlidePanel>
  )
}
