import React from 'react'
import { twMerge } from 'tailwind-merge'

type ContainerProps = {
  children: React.ReactNode
  ref?: React.RefObject<any>
} & React.HTMLAttributes<HTMLDivElement>

const Container = React.forwardRef((
    {children, className, id}: ContainerProps, 
    ref: React.ForwardedRef<HTMLDivElement>) => {
    return (
        <div id={id} ref={ref} className={twMerge('px-6 w-full max-w-[768px] mx-auto', className)}>
            {children}
        </div>
    )
})
Container.displayName = 'Container'

export default Container