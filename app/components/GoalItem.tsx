import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid"
import type { Goal, Streak } from "@prisma/client"
import { Link } from "@remix-run/react"
import { useMemo } from "react"
import type { Jsonify } from "type-fest"
import { getDays } from "~/utils/geyDays"
import { isDateYesterday } from "~/utils/isDateYesterday"
import { isSameDay } from "~/utils/isSameDay"

const GoalItem = ({goal}: {goal: Jsonify<Goal & {streaks: Streak[]}>}) => {
  const currentStreak = useMemo(() => {
    const lastStreak = goal.streaks.sort((a, b) => new Date(b.lastCheckIn).getTime() - new Date(a.lastCheckIn).getTime())[0]

    if (!lastStreak) return 0

    const days = getDays(new Date(lastStreak.lastCheckIn), new Date(lastStreak.start)) + 1

    // check if the streak is current
    const isCurrent = 
      isDateYesterday(new Date(lastStreak.lastCheckIn)) || 
      isSameDay(new Date(lastStreak.lastCheckIn), new Date())
    
    return isCurrent ? days : 0
  }, [goal.streaks])
  return (
    <div 
      key={goal.id} 
      className="
        bg-slate-200 
        border 
        border-slate-200
        dark:bg-transparent         
        dark:border-slate-600 
        rounded-lg 
        flex justify-between
        mb-2
        transition-all">
      <Link 
        to={`/goal/${goal.id}`} 
        className="
          w-full h-full 
          flex flex-col justify-between items-start 
          py-2 pl-2">
        <span className="mb-3">{goal.name}</span>

        <span className="text-sm">
          Current streak: {currentStreak}
          {currentStreak > 0 ? '🔥' : ''}
        </span>
      </Link>

      <div className="py-2 pr-2 flex items-start">
        <Link 
          className="flex text-slate-600" 
          type="button" 
          to='/goals'>
          <PencilIcon className="w-4"/>
        </Link>
        <Link 
          className="ml-2 flex text-slate-600" 
          type="button" 
          to={`delete/${goal.id}`}>
          <TrashIcon className="w-4"/>
        </Link>
      </div>
    </div>
  )
}

export default GoalItem