import { useState, useRef, useEffect } from 'react'

interface CardTitleProps {
  title: string
  onSave: (title: string) => void
}

export function CardTitle({ title, onSave }: CardTitleProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setValue(title)
  }, [title])

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  function handleBlur() {
    setIsEditing(false)
    if (value.trim() && value.trim() !== title) {
      onSave(value.trim())
    } else {
      setValue(title)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleBlur()
    } else if (e.key === 'Escape') {
      setValue(title)
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-full rounded border border-blue-500 px-2 py-1 text-lg font-semibold focus:outline-none dark:bg-gray-800 dark:text-white"
      />
    )
  }

  return (
    <h2
      onClick={() => setIsEditing(true)}
      className="cursor-pointer rounded px-2 py-1 text-lg font-semibold text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
    >
      {title}
    </h2>
  )
}
