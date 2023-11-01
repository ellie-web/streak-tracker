import { isSameDay } from "./isSameDay"

export const isDateYesterday = (date: Date): Boolean => {
  const yesterday = new Date()
  yesterday.setUTCDate(yesterday.getUTCDate() - 1)

  return isSameDay(yesterday, date)
}