import { ActionFunctionArgs, json, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import authenticator from "~/services/auth.server";

export const loader = async({request}: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  })

  return json({user})
}

export const action = async ({request}: ActionFunctionArgs) => {
  const form = await request.formData()
  const action = form.get('action')

  switch(action) {
    case 'logout': {
      return await authenticator.logout(request, {
        redirectTo: '/login'
      })
    }
  }
}

const DashboardPage = () => {
  const {user} = useLoaderData<typeof loader>()

  return (
    <div>
      <h1>Welcome {user.name}!</h1>
      <Form method="post">
        <button type="submit" value="logout" name="action">Logout</button>
      </Form>
    </div>
  )
}

export default DashboardPage