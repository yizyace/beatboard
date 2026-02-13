import { useState } from 'react'
import type { Comment } from '../../lib/schema/types'
import { Button } from '../shared/Button'

interface CardCommentsProps {
  comments: Comment[]
  onAdd: (text: string) => void
  onDelete: (commentId: string) => void
}

export function CardComments({
  comments,
  onAdd,
  onDelete,
}: CardCommentsProps) {
  const [newComment, setNewComment] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!newComment.trim()) return
    onAdd(newComment.trim())
    setNewComment('')
  }

  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
        Comments
      </h3>

      <div className="space-y-3">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="rounded-md border border-gray-200 p-3 dark:border-gray-700"
          >
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {comment.author}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => onDelete(comment.id)}
                  className="text-xs text-red-400 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {comment.text}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
        <Button type="submit" size="sm" disabled={!newComment.trim()}>
          Add
        </Button>
      </form>
    </div>
  )
}
