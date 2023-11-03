export const getDays = (end: Date, start: Date): number => {
  const difference = end.getTime() - start.getTime()
  return Math.ceil(difference / (1000 * 3600 * 24))
}