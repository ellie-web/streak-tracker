import type { Streak } from "@prisma/client"
import { prisma } from "~/db.server"

export const createStreak = async (data: Omit<Streak, 'id'>): Promise<Streak> => {
  return await prisma.streak.create({data})
}

export const updateStreak = async (data: Omit<Streak, 'start'>): Promise<Streak> => {
  return await prisma.streak.update({where: {id: data.id}, data})
}

export const deleteAllStreaks = async (goalId: number) => {
  return await prisma.streak.deleteMany({where: {goalId}})
}

export const getLastStreak = async (goalId: number) => {
  return await prisma.streak.findFirst({where: {goalId}, orderBy: {lastCheckIn: 'desc'}})
}