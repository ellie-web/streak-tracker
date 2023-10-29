// app/services/auth.server.ts
import { Authenticator, AuthorizationError } from "remix-auth"
import { sessionStorage } from "~/services/session.server"
import { FormStrategy } from "remix-auth-form"
import bcrypt from "bcryptjs"
import { prisma } from "~/db.server"

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
type UserPublic = {
  id: number
  name: string
}
const authenticator = new Authenticator<UserPublic>(sessionStorage)

const formStrategy = new FormStrategy(async ({form}) => {
  const name = form.get('name') as string
  const password = form.get('password') as string

  const user = await prisma.user.findUnique({ where: { name } })

  if (!user) {
    console.log('Authorization error')
    throw new AuthorizationError()
  }

  const pwdMatch = await bcrypt.compare(password, user.password)

  if (!pwdMatch) {
    console.log('Wrong password')
    throw new AuthorizationError()
  }

  return {id: user.id, name: user.name}
})

authenticator.use(formStrategy, 'form')

export default authenticator