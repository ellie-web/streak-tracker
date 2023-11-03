import { twMerge } from "tailwind-merge"
import type { TypographyProps } from "~/types"

const H1 = ({children, className}: TypographyProps) => {
  return <h1 className={twMerge('text-3xl text-center mb-4 dark:text-white transition-all', className)}>
    {children}
  </h1>
}

export default H1