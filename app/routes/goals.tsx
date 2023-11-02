import { ArrowRightOnRectangleIcon, HomeIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid"
import { Button } from "@mui/base"
import { json, redirect} from "@remix-run/node";
import { type LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react"
import Container from "~/components/UI/Container"
import { getAllGoals } from "~/models/goal.server"
import authenticator from "~/services/auth.server"
import { isDateYesterday } from "~/utils/isDateYesterday";
import { isSameDay } from "~/utils/isSameDay";

export const loader = async ({request}: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/sign-in'
  })

  const goals = await getAllGoals(user.id)
  if (goals.length === 0) {
    // workaraund to not get stuck in infinite redirect loop
    const url = new URL(request.url)
    if (url.pathname === '/goals') {
      return redirect('/goals/add')
    }
  }
  return json({user, goals})
}

const Goals = () => {
  const {user, goals} = useLoaderData<typeof loader>()

  // TODO: move to utils
  const getCurrentStreak = (streaks: any[]) => {
    const lastStreak = streaks.sort((a, b) => b.lastCheckIn.getTime() - a.lastCheckIn.getTime())[0]

    if (!lastStreak) return 0
    // if (lastStreak.start === lastStreak.lastCheckIn) return 1
    const difference = new Date(lastStreak.lastCheckIn).getTime() - new Date(lastStreak.start).getTime()


    let days = 0
    // if start = lastCheckIn -> freshly created streak by the first check in
    if (lastStreak.start === lastStreak.lastCheckIn) {
      days = 1
    }
    else days = Math.ceil(difference / (1000 * 3600 * 24))

    // check if the streak is current
    const isCurrent = isDateYesterday(new Date(lastStreak.lastCheckIn)) || isSameDay(new Date(lastStreak.lastCheckIn), new Date())
    
    return isCurrent ? days : 0
  }
  return (
    <Container className="pt-5 flex flex-col h-screen">
      {/* <h1 className="text-4xl text-center mb-2">Hi {user.name}!</h1> */}
      
      {goals && <>
        <h2 className="text-3xl text-center mb-4">Your goals</h2>
        {goals.length === 0 && <div className="text-center">No goals yet!</div>}
        {goals.map((goal) => {
          return (
            <div 
              key={goal.id} 
              className="bg-slate-200 rounded-lg flex justify-between items-center mb-2">
              
              <Link to={`/goal/${goal.id}`} className="w-full h-full flex justify-between items-center py-2 pl-2">
                <span>{goal.name}</span>

                <span>Current streak: {getCurrentStreak(goal.streaks)}</span>
              </Link>

              <div className="py-2 pr-2">
                <Link 
                  className="flex text-red-600" 
                  type="button" 
                  to={`delete/${goal.id}`}>
                  <TrashIcon className="w-8"/>
                </Link>
              </div>
            </div>)
        })}
      </>}

      <Outlet/>

      <div className="mt-auto w-full flex justify-between items-center py-4">
        <Link to='/dashboard'>
          <HomeIcon className="w-8"/>
        </Link>

        <Link className="
          rounded-full 
          bg-green-400 
          text-white 
          w-24 
          h-24 
          flex 
          flex-col 
          items-center 
          justify-center"
          to="add">
          <PlusIcon className="w-10 "/>
          <span className="text-xs">Add a goal</span>
        </Link>

        <Form method="post" action="/dashboard">
          <Button className="flex" type="submit" value="logout" name="action">
            <ArrowRightOnRectangleIcon className="w-8"/>
          </Button>
        </Form>
      </div>
    </Container>
  )
}

export default Goals