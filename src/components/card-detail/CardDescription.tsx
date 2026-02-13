import { useState, useEffect } from 'react'

interface CardDescriptionProps {
  description: string
  onSave: (description: string) => void
}

export function CardDescription({
  description,
  onSave,
}: CardDescriptionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(description)

  useEffect(() => {
    setValue(description)
  }, [description])

  function handleBlur() {
    setIsEditing(false)
    if (value !== description) {
      onSave(value)
    }
  }

  if (isEditing) {
    return (
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        rows={6}
        className="w-full rounded border border-blue-500 px-3 py-2 text-sm focus:outline-none dark:bg-gray-800 dark:text-white"
        autoFocus
      />
    )
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="min-h-[80px] cursor-pointer rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
    >
      {description || (
        <span className="text-gray-400 dark:text-gray-500">
          Add a description...
        </span>
      )}
    </div>
  )
}
