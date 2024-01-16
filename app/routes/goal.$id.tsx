import { ArrowRightOnRectangleIcon, CheckIcon, HandThumbUpIcon, ListBulletIcon } from "@heroicons/react/24/solid";
import { Button } from "@mui/base";
import { json, redirect} from "@remix-run/node";
import { type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import Container from "~/components/UI/Layout/Container";
import { checkInWithGoal, getGoal } from "~/models/goal.server";
import { getLastStreak } from "~/models/streak.server";
import authenticator from "~/services/auth.server";
import { getDays } from "~/utils/geyDays";
import { isSameDay } from "~/utils/isSameDay";
import dayjs from "dayjs";
import H1 from "~/components/UI/Typography/H1";
import H2 from "~/components/UI/Typography/H2";
import useCurrentStreak from "~/utils/useCurrentStreak";

export const loader = async ({request, params}: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/sign-in',
  })
  if (params.id === undefined) return redirect('/goals')
  const goal = await getGoal(+params.id)
  if (!goal) return redirect('/goals')
  const lastStreak = await getLastStreak(goal.id)
  return json({user, goal, lastStreak})
}

export const action = async ({request}: ActionFunctionArgs) => {
  const form = await request.formData()
  const action = form.get('action')

  switch(action) {
    case 'checkIn': {
      const goalId = form.get('id')
      const date = form.get('date')

      if (!goalId || !date) return json(new Error())
      const streak = await checkInWithGoal(+goalId, new Date(date.toString()))
      if (!streak) return json(new Error())
      return json(streak)
    }
  }
}

type Stats = {
  best: number
  percent: number
  daysCompleted: number
}

const GoalPage = () => {
  const {user, goal, lastStreak} = useLoaderData<typeof loader>()
  const fetcher = useFetcher()

  // get checked in state
  const [isChecked, setIsChecked] = useState<Boolean>(false)
  useEffect(() => {
    if (!lastStreak) return setIsChecked(false)
    setIsChecked(isSameDay(new Date(lastStreak.lastCheckIn), new Date()))
  }, [lastStreak])

  // get stats
  const [stats, setStats] = useState<Stats>({
    best: 0,
    percent: 0,
    daysCompleted: 0
  })
  useEffect(() => {
    if (goal.streaks.length === 0) return
    const daysCompleted = goal.streaks.reduce((accumulator, current) => {
      const days = getDays(new Date(current.lastCheckIn), new Date(current.start)) + 1
      return accumulator + days
    }, 0)

    const bestStreakObject = goal.streaks.sort((a, b) => {
      return (new Date(b.lastCheckIn).getTime() - new Date(b.start).getTime())  - (new Date(a.lastCheckIn).getTime() - new Date(a.start).getTime())
    })[0]

    const bestStreakDays = getDays(new Date(bestStreakObject.lastCheckIn), new Date(bestStreakObject.start)) + 1

    const daysSinceStart = getDays(new Date(), new Date(goal.start)) + 1
    const percent = ~~((daysCompleted / daysSinceStart) * 100)

    setStats({
      best: bestStreakDays === 0 ? 1 : bestStreakDays,
      percent,
      daysCompleted
    })
  }, [goal, lastStreak])

  const handleCheckIn = () => {
    const checkInDate = new Date()

    const formData = new FormData()

    formData.append('action', 'checkIn')
    formData.append('id', goal.id.toString())
    formData.append('date', checkInDate.toUTCString())

    fetcher.submit(
      formData,
      {
        method: 'post'
      }
    )
  }

  const currentStreak = useCurrentStreak(goal.streaks)

  return (
    <Container className="pt-5 flex flex-col h-screen dark:text-white">
      <H2>{user.name}, you are</H2>
      <H1>{goal.name}</H1>
      <div className="flex justify-center items-center text-2xl">
        for
        <div className="mx-3 font-extrabold text-green-400 text-4xl">
          {currentStreak}
        </div>
        days!
      </div>

      <div className="mt-12 text-center text-lg">Goal started on {dayjs(goal.start).format('DD MMM YYYY, HH:mm')}</div>

      <div className="mt-5 grid grid-cols-3">
        <div className="text-center">
          <div className="text-2xl font-semibold">{stats.best}</div>
          <div className="text-sm">Best streak</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-semibold">{stats.percent}%</div>
          <div className="text-sm">All time</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-semibold">{stats.daysCompleted}</div>
          <div className="text-sm">Days completed</div>
        </div>
      </div>

      <div className="mt-auto w-full flex justify-between items-center py-4">
        <Link to='/goals'>
          <ListBulletIcon className="w-8"/>
        </Link>

        <Button 
          onClick={handleCheckIn}
          disabled={!!isChecked}
          className="
            rounded-full 
            bg-green-400 
            text-white 
            w-24 
            h-24 
            flex 
            flex-col 
            items-center 
            justify-center">
          
          {!isChecked ? <>
            <CheckIcon className="w-10"/>
            <span className="text-xs">Check in</span>
          </> 
          : <>
            <HandThumbUpIcon className="w-10"/>
            <span>Good job!</span>
          </>}
        </Button>

        <Form method="post" action="/dashboard">
          <Button className="flex" type="submit" value="logout" name="action">
            <ArrowRightOnRectangleIcon className="w-8"/>
          </Button>
        </Form>
      </div>
    </Container>
  )
}

export default GoalPage