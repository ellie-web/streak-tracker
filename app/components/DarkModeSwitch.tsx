import useDarkMode from "@fisch0920/use-dark-mode"
import { Switch as BaseSwitch, NoSsr } from "@mui/base"
import clsx from "clsx"

const DarkModeSwitch = () => {
  const darkMode = useDarkMode(undefined, {classNameDark: 'dark', classNameLight: 'light'})
  return (
    <NoSsr>
      <BaseSwitch
        checked={darkMode.value}
        onChange={darkMode.toggle}
        slotProps={{
          root:{
            className: 'relative inline-block w-[38px] h-[24px] m-2.5 cursor-pointer'
            },
          input: {
              className: 'cursor-inherit absolute w-full h-full top-0 left-0 opacity-0 z-10 border-none',
            },
          track: (ownerState) => {

            return {
              className: clsx(
                `absolute block w-full h-full transition rounded-full border border-solid outline-none border-slate-300 dark:border-gray-700 shadow-[inset_0_1_1_rgb(0_0_0_/_0.05)] dark:shadow-[inset_0_1_1_rgb(0_0_0_/_0.5)] focus:shadow-purple-200 dark:focus:shadow-purple-600 
                ${
                  ownerState.checked
                    ? 'bg-green-500 border-none'
                    : 'bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`
              ),
            };
          },
          thumb: (ownerState) => {

            return {
              className: clsx(
                `block w-4 h-4 top-1 rounded-2xl border border-solid outline-none border-slate-300 dark:border-gray-700 transition shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:shadow-[0_1px_2px_rgb(0_0_0_/_0.25)] 
                ${
                  ownerState.checked
                    ? 'left-[18px] bg-white border-none shadow-[0_0_0_rgb(0_0_0_/_0.3)]'
                    : 'left-[4px] bg-white'
                } relative transition-all`,
              ),
            };
          },
        }}
      />
    </NoSsr>
  )
}

export default DarkModeSwitch