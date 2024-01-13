import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid"
import type { Goal, Streak } from "@prisma/client"
import { Link } from "@remix-run/react"
import type { Jsonify } from "type-fest"
import useCurrentStreak from "~/utils/useCurrentStreak"

const GoalItem = ({goal}: {goal: Jsonify<Goal & {streaks: Streak[]}>}) => {
  const currentStreak = useCurrentStreak(goal.streaks)
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