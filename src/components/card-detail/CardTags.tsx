import { useState } from 'react'
import { Badge } from '../shared/Badge'

interface CardTagsProps {
  tags: string[]
  onAdd: (tag: string) => void
  onRemove: (tag: string) => void
}

export function CardTags({ tags, onAdd, onRemove }: CardTagsProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newTag, setNewTag] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const tag = newTag.trim()
    if (tag && !tags.includes(tag)) {
      onAdd(tag)
    }
    setNewTag('')
    setIsAdding(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      setIsAdding(false)
      setNewTag('')
    }
  }

  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
        Tags
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <Badge key={tag} onRemove={() => onRemove(tag)}>
            {tag}
          </Badge>
        ))}

        {isAdding ? (
          <form onSubmit={handleSubmit} className="inline-flex">
            <input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                setIsAdding(false)
                setNewTag('')
              }}
              placeholder="Tag name"
              className="w-24 rounded border border-gray-300 px-2 py-0.5 text-xs focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              autoFocus
            />
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="rounded-full border border-dashed border-gray-300 px-2 py-0.5 text-xs text-gray-500 hover:border-gray-400 hover:text-gray-600 dark:border-gray-600 dark:text-gray-400"
          >
            + Add
          </button>
        )}
      </div>
    </div>
  )
}
