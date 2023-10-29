import type { User } from "@prisma/client"
import { prisma } from "~/db.server"

export const updateUserName = async (userId: number, name: string): Promise<User> => {
  
  const updatedUser = await prisma.user.update({where: {id: userId}, data: {name: name}})
  console.log(updatedUser)
  const users = await prisma.user.findMany()
  console.log(users)
  return updatedUser
}