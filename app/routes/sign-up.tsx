import type { ActionFunction, LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import bcrypt from 'bcryptjs'
import Input from "~/components/Input";
import Container from "~/components/UI/Container";
import { prisma } from "~/db.server";
import authenticator from "~/services/auth.server";

export const loader: LoaderFunction = async (args: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(args.request, {
    successRedirect: '/dashboard'
  })

  return {user}
}

export const action: ActionFunction = async ({request}) => {
  const form = await request.clone().formData()
  const name = form.get('name') as string
  const password = form.get('password') as string

  const salt = await bcrypt.genSalt(10)
  const hashedPwd = await bcrypt.hash(password, salt)

  try {
    await prisma.user.create({
      data: {
        name,
        password: hashedPwd
      },
    });
  }
  catch (err) {
    console.log('Error creating a user')
  }

  // const allUsers = await prisma.user.findMany()
  // console.log(allUsers)

  return await authenticator.authenticate('form', request, {
    successRedirect: '/',
    failureRedirect: '/sign-in',
    context: {formData: form}
  })
}

const SignUp = () => {
  return (
    <Form method="post">
      <Container className="pt-5 flex flex-col h-screen">
        <h1 className="text-4xl mb-3">Sign up</h1>

        <p 
          className="text-xs mb-4 text-slate-400">
            Already have an account?&nbsp; 
            <Link className="text-blue-400 underline" to='/sign-in'>
              Sign in
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
          Sign up
        </button>
      </Container>
    </Form>
  )
}

export default SignUp