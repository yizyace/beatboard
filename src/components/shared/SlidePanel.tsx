import { useEffect, useRef } from 'react'

interface SlidePanelProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  width?: string
}

export function SlidePanel({
  isOpen,
  onClose,
  children,
  width = 'w-[480px]',
}: SlidePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        ref={panelRef}
        className={`relative ${width} h-full bg-white shadow-xl overflow-y-auto animate-slide-in dark:bg-gray-900`}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Close"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 5l10 10M15 5l-10 10" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  )
}
