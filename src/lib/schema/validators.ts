import { z } from 'zod/v4'

export const CommentSchema = z.object({
  id: z.string(),
  text: z.string(),
  author: z.string(),
  createdAt: z.string(),
})

export const CardSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  comments: z.array(CommentSchema),
  laneId: z.string(),
  orderKey: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  author: z.string(),
})

export const LaneSchema = z.object({
  id: z.string(),
  title: z.string(),
  orderKey: z.string(),
})

export const BoardSchema = z.object({
  id: z.string(),
  name: z.string(),
  lanes: z.array(LaneSchema),
})

export const GitBoardConfigSchema = z.object({
  version: z.number(),
  boards: z.array(z.string()),
})

export const AppSettingsSchema = z.object({
  repoUrl: z.string(),
  localRepoPath: z.string(),
  pollIntervalMs: z.number(),
  author: z.string(),
  zoomLevel: z.enum(['compact', 'normal', 'expanded']),
})

export const LastSeenSchema = z.object({
  commitSha: z.string(),
  timestamp: z.string(),
})
