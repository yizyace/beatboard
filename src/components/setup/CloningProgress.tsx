interface CloningProgressProps {
  message: string
}

export function CloningProgress({ message }: CloningProgressProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  )
}
