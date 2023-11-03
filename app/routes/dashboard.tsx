import { ArrowRightOnRectangleIcon, CheckIcon, ListBulletIcon } from "@heroicons/react/24/solid";
import { Button } from "@mui/base";
import { json} from "@remix-run/node";
import { type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";

import { Form, Link, useLoaderData } from "@remix-run/react";
import Container from "~/components/UI/Layout/Container";
import authenticator from "~/services/auth.server";

export const loader = async ({request}: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/sign-in',
  })
  return json({user})
}

export const action = async ({request}: ActionFunctionArgs) => {
  const form = await request.formData()
  const action = form.get('action')

  switch(action) {
    case 'logout': {
      return await authenticator.logout(request, {
        redirectTo: '/sign-in'
      })
    }
  }
}

const Dashboard = () => {
  const {user} = useLoaderData<typeof loader>()

  return (
    <Container className="pt-5 flex flex-col h-screen">
      <h1 className="text-4xl text-center mb-2">Hi {user.name}!</h1>
      <p className="text-center mb-4">
        <span className="text-xl">You are</span>
        <br/>
        <span className="text-3xl">Not smoking</span>
      </p>
      <div className="flex justify-center items-center text-2xl">
        for
        <div className="mx-3 font-extrabold text-green-400 text-4xl">7</div>
        days!
      </div>

      <div className="mt-12 text-center text-lg">Task started on {(new Date()).toDateString()}</div>

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

      <div className="mt-auto w-full flex justify-between items-center py-4">
        <Link to='/goals'>
          <ListBulletIcon className="w-8"/>
        </Link>

        <Button className="
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

export default Dashboard