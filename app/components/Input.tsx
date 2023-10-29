import type { InputProps } from '@mui/base'
import { Input as BaseInput } from '@mui/base'
import React from 'react'

const Input = React.forwardRef((props: InputProps, ref: React.ForwardedRef<HTMLInputElement>) => {
  return (
    <BaseInput 
      slotProps={{
        input: {
          className: `
            w-full
            px-3 
            py-2 
            rounded-lg 
            focus:shadow-outline-blue 
            dark:focus:shadow-outline-blue
            dark:outline-blue-600 
            border 
            border-solid 
            border-slate-300 
            hover:border-blue-500 
            dark:hover:border-blue-500 
            focus:border-blue-500 
            dark:focus:border-blue-600 
            dark:border-slate-600
            bg-white 
            dark:bg-slate-900 
            text-slate-900 
            dark:text-slate-300 
            focus-visible:outline-0`
        }
      }}
      {...props}
      ref={ref} />
  )
})

Input.displayName = 'Input'

export default Input