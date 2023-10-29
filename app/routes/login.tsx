import type { ActionFunction, LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import authenticator from "~/services/auth.server";

export const loader: LoaderFunction = async (args: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(args.request, {
    successRedirect: '/dashboard'
  })

  return {user}
}

export const action: ActionFunction = async ({request}) => {
  await authenticator.authenticate('form', request, {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
  })
}

const LoginPage = () => {
  return (
    <Form method="post">
      <h1>Sign in</h1>

      <p>Don't have an account? <Link to='/registration'>Sign up</Link></p>

      <label htmlFor="name">Name</label>
      <input type="text" name="name" id="name"/>

      <label htmlFor="password">Password</label>
      <input type="password" name="password" id="password"/>

      <button type="submit">
        Sign in
      </button>
    </Form>
  )
}

export default LoginPage