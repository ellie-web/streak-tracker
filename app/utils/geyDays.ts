export const getDays = (d1: Date, d2: Date): number => {
  const difference = d1.getTime() - d2.getTime()
  return Math.ceil(difference / (1000 * 3600 * 24))
}