import { ArrowRightOnRectangleIcon, CheckIcon, ListBulletIcon } from "@heroicons/react/24/solid";
import { Button } from "@mui/base";
import { json, redirect} from "@remix-run/node";
import { type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";

import { Form, Link, useActionData, useFetcher, useLoaderData } from "@remix-run/react";
import Container from "~/components/UI/Container";
import { checkInWithGoal, getGoal } from "~/models/goal.server";
import { getLastStreak } from "~/models/streak.server";
import authenticator from "~/services/auth.server";

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

const GoalPage = () => {
  const {user, goal, lastStreak} = useLoaderData<typeof loader>()
  const streak = useActionData<typeof action>()
  const fetcher = useFetcher()

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

  // TODO: move to utils
  const getStreak = (): number => {
    if (!lastStreak) return 0
    if (lastStreak.start === lastStreak.lastCheckIn) return 1
    const difference = new Date(lastStreak.lastCheckIn).getTime() - new Date(lastStreak.start).getTime()
    const days = Math.ceil(difference / (1000 * 3600 * 24))

    return days
  }

  return (
    <Container className="pt-5 flex flex-col h-screen">
      <h1 className="text-2xl text-center mb-2">{user.name}, you are</h1>
      <p className="text-center mb-4">
        <span className="text-3xl">{goal.name}</span>
      </p>
      <div className="flex justify-center items-center text-2xl">
        for
        <div className="mx-3 font-extrabold text-green-400 text-4xl">
          {getStreak()}
        </div>
        days!
      </div>

      <div className="mt-12 text-center text-lg">Goal started on {goal.start}</div>

      <div className="mt-5 grid grid-cols-3">
        <div className="text-center">
          <div className="text-2xl font-semibold">12</div>
          <div className="text-sm">Best streak</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-semibold">50%</div>
          <div className="text-sm">All time</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-semibold">300</div>
          <div className="text-sm">Days completed</div>
        </div>
      </div>

      {streak && <div>update {streak?.lastCheckIn}</div>}

      <div className="mt-auto w-full flex justify-between items-center py-4">
        <Link to='/goals'>
          <ListBulletIcon className="w-8"/>
        </Link>

        <Button 
          onClick={handleCheckIn}
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
          <CheckIcon className="w-10 "/>
          <span className="text-xs">Check in</span>
        </Button>

        <Form method="post">
          <Button className="flex" type="submit" value="logout" name="action">
            <ArrowRightOnRectangleIcon className="w-8"/>
          </Button>
        </Form>
      </div>
    </Container>
  )
}

export default GoalPage