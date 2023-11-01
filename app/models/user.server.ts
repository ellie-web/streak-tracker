import type { User } from "@prisma/client"
import { prisma } from "~/db.server"
import type { UserPublic } from "~/types"

export const getUser = async (userId: number): Promise<UserPublic | null> => {
  const user = await prisma.user.findUnique({where: {id: userId}})
  if (!user) return null
  return {id: user.id, name: user.name}
}

export const updateUserName = async (userId: number, name: string): Promise<User> => {
  return await prisma.user.update({where: {id: userId}, data: {name: name}})
}