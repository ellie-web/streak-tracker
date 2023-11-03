import type { Goal } from "@prisma/client"

export type UserPublic = {
  id: number
  name: string
}

export type TypographyProps = {
  children: React.ReactNode
  className?: string
}