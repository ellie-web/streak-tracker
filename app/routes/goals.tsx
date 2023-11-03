import { ArrowRightOnRectangleIcon, HomeIcon, PlusIcon } from "@heroicons/react/24/solid"
import { Button } from "@mui/base"
import { json, redirect} from "@remix-run/node";
import { type LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react"
import GoalItem from "~/components/GoalItem";
import Container from "~/components/UI/Layout/Container"
import H1 from "~/components/UI/Typography/H1";
import { getAllGoals } from "~/models/goal.server"
import authenticator from "~/services/auth.server"

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
  return json({goals})
}

const Goals = () => {
  const {goals} = useLoaderData<typeof loader>()
  return (
    <Container className="pt-5 flex flex-col h-screen dark:text-white"> 
      {goals && <>
        <H1 className="text-3xl">Your goals</H1>
        {goals.length === 0 && <div className="text-center">No goals yet!</div>}
        {goals.map((goal) => {
          return <GoalItem key={goal.id} goal={goal}/>
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