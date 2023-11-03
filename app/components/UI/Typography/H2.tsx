import { twMerge } from "tailwind-merge"
import type { TypographyProps } from "~/types"

const H2 = ({children, className}: TypographyProps) => {
  return <h2 className={twMerge('text-2xl text-center mb-2 dark:text-white transition-all', className)}>
    {children}
  </h2>
}

export default H2