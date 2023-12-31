import type { ActionFunction, LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import Input from "~/components/Input";
import Container from "~/components/UI/Layout/Container";
import H1 from "~/components/UI/Typography/H1";
import authenticator from "~/services/auth.server";

export const loader: LoaderFunction = async (args: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(args.request, {
    successRedirect: '/goals'
  })

  return {user}
}

export const action: ActionFunction = async ({request}) => {
  await authenticator.authenticate('form', request, {
    successRedirect: '/goals',
  })
}

const SignIn = () => {
  return (
    <Form method="post">
      <Container className="pt-5 flex flex-col h-screen">
        <H1 className="mb-3 text-left">Sign in</H1>

        <p 
          className="text-xs mb-4 text-slate-400">
            Don't have an account?&nbsp;
            <Link className="text-blue-400 underline" to='/sign-up'>
              Sign up
            </Link>
        </p>

        <Input 
          className="mb-4" 
          type="text" 
          name="name" 
          id="name" 
          placeholder="Name" />

        <Input 
          className="mb-6" 
          type="password" 
          name="password" 
          id="password" 
          placeholder="Password" />

        <button 
          className="rounded-lg bg-blue-400 text-white px-5 py-2" 
          type="submit">
          Sign in
        </button>
      </Container>
    </Form>
  )
}

export default SignIn