import type { Goal, Streak } from "@prisma/client"
import { prisma } from "~/db.server"
import { createStreak, deleteAllStreaks, getLastStreak, updateStreak } from "./streak.server"
import { isDateYesterday } from "../utils/isDateYesterday"
import { isSameDay } from "~/utils/isSameDay"

export const getAllGoals = async (userId: number)
  : Promise<(Goal & {streaks: Streak[]})[]> => {
  return await prisma.goal.findMany({
    where: {userId}, 
    include: {streaks: true}
  })
}

export const getGoal = async (goalId: number): Promise<Goal & {streaks: Streak[]} | null> => {
  return await prisma.goal.findUnique({
    where: {id: goalId},
    include: {streaks: true}
  })
}

export const createGoal = async (data: Omit<Goal, 'id'>): Promise<Goal> => {
  return await prisma.goal.create({data})
}

export const deleteGoal = async (goalId: number) => {
  await deleteAllStreaks(goalId)
  return await prisma.goal.delete({where: {id: goalId}})
}

export const checkInWithGoal = async (goalId: number, date: Date): Promise<Streak | null> => {
  const lastStreak = await getLastStreak(goalId)

  // if no streak yet create first streak
  if (!lastStreak) {
    return await createStreak({
      goalId,
      start: date,
      lastCheckIn: date
    })
  }

  // dont check in if the same day
  if (isSameDay(lastStreak.lastCheckIn, date)) {
    return null
  }

  // check in if the last check in was yesterday
  if (isDateYesterday(lastStreak.lastCheckIn)) {
    return await updateStreak({...lastStreak, lastCheckIn: date})
  }

  // if the last check in was more than 2 days ago, start a new streak
  else {
    return await createStreak({
      goalId,
      start: date,
      lastCheckIn: date
    })
  }
}
