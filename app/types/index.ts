import type { Goal } from "@prisma/client"

export type UserPublic = {
  id: number
  name: string
}

export type GoalPublic = Goal & {currentStreak: number}

export type TypographyProps = {
  children: React.ReactNode
  className?: string
}