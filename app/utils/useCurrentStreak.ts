import type { Streak } from "@prisma/client";
import { isDateYesterday } from "./isDateYesterday";
import { isSameDay } from "./isSameDay";
import { getDays } from "./geyDays";
import type { Jsonify } from "type-fest";

const useCurrentStreak = (streaks: Jsonify<Streak[]>) => {
  const lastStreak = streaks.sort((a, b) => new Date(b.lastCheckIn).getTime() - new Date(a.lastCheckIn).getTime())[0]

    if (!lastStreak) return 0

    const days = getDays(new Date(lastStreak.lastCheckIn), new Date(lastStreak.start)) + 1

    // check if the streak is current
    const isCurrent = 
      isDateYesterday(new Date(lastStreak.lastCheckIn)) || 
      isSameDay(new Date(lastStreak.lastCheckIn), new Date())
    
    return isCurrent ? days : 0
}

export default useCurrentStreak