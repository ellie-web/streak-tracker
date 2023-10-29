import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import authenticator from "~/services/auth.server";

export const loader = async({request}: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  })

  return json({user})
}

const DashboardPage = () => {
  const {user} = useLoaderData<typeof loader>()

  return (
    <div>
      <h1>Welcome {user.name}!</h1>
    </div>
  )
}

export default DashboardPage