export type CommitOperation =
  | { type: 'add-card'; cardId: string; title: string; laneTitle: string }
  | { type: 'update-card'; cardId: string; title: string; fields: string[] }
  | { type: 'delete-card'; cardId: string; title: string }
  | { type: 'move-card'; cardId: string; title: string; toLaneTitle: string }
  | { type: 'add-lane'; laneId: string; title: string }
  | { type: 'update-lane'; laneId: string; title: string }
  | { type: 'move-lane'; laneId: string; title: string }
  | { type: 'add-comment'; cardId: string; cardTitle: string }
  | { type: 'delete-comment'; cardId: string; cardTitle: string }

export function buildCommitMessage(op: CommitOperation): string {
  switch (op.type) {
    case 'add-card':
      return `card(${op.cardId}): add "${op.title}" to ${op.laneTitle}`
    case 'update-card':
      return `card(${op.cardId}): update ${op.fields.join(', ')}`
    case 'delete-card':
      return `card(${op.cardId}): delete "${op.title}"`
    case 'move-card':
      return `card(${op.cardId}): move to ${op.toLaneTitle}`
    case 'add-lane':
      return `lane(${op.laneId}): add "${op.title}"`
    case 'update-lane':
      return `lane(${op.laneId}): update "${op.title}"`
    case 'move-lane':
      return `lane(${op.laneId}): reorder "${op.title}"`
    case 'add-comment':
      return `card(${op.cardId}): add comment`
    case 'delete-comment':
      return `card(${op.cardId}): delete comment`
  }
}
