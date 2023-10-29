// app/services/auth.server.ts
import { Authenticator, AuthorizationError } from "remix-auth"
import { sessionStorage } from "~/services/session.server"
import { FormStrategy } from "remix-auth-form"
import bcrypt from "bcryptjs"
import { prisma } from "~/db.server"
import type { User } from "@prisma/client"

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
const authenticator = new Authenticator<User>(sessionStorage)

const formStrategy = new FormStrategy(async ({form}) => {
  const name = form.get('name') as string
  const password = form.get('password') as string

  const user = await prisma.user.findUnique({ where: { name } })

  if (!user) {
    console.log('wrong game master')
    throw new AuthorizationError()
  }

  const pwdMatch = await bcrypt.compare(password, user.password)

  if (!pwdMatch) {
    console.log('wrong password')
    throw new AuthorizationError()
  }

  return user
})

authenticator.use(formStrategy, 'form')

export default authenticator