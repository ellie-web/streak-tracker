export const getDays = (end: Date, start: Date): number => {
  const difference = new Date(end).getTime() - new Date(start).getTime()
  return Math.ceil(difference / (1000 * 3600 * 24))
}