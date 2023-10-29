import type { ActionFunction, LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import bcrypt from 'bcryptjs'
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
    failureRedirect: '/login',
    context: {formData: form}
  })
}

const RegistrationPage = () => {
  return (
    <Form method="post">
      <h1>Sign up</h1>

      <p>Already have an account? <Link to='/login'>Sign in</Link></p>
      
      <label htmlFor="name">Name</label>
      <input type="text" name="name" id="name"/>

      <label htmlFor="password">Password</label>
      <input type="password" name="password" id="password"/>

      <button type="submit">Sign up</button>
    </Form>
  )
}

export default RegistrationPage