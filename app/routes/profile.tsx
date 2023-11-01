import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node"
import { Form, Link, useLoaderData } from "@remix-run/react"
import Container from "~/components/UI/Container"
import authenticator from "~/services/auth.server"
import Input from "~/components/Input"
import { useState } from "react"
import { Button } from "@mui/base"
import { ClipboardDocumentListIcon, HomeIcon } from "@heroicons/react/24/solid"
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline"
import { updateUserName } from "~/models/user.server"

export const loader = async ({request}: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/sign-in',
  })

  return json({user})
}

export const action = async ({request}: ActionFunctionArgs) => {
  const form = await request.formData()
  const action = form.get('action')

  // const user = await authenticator.isAuthenticated(request, {
  //   failureRedirect: '/sign-in',
  // })

  switch(action) {
    // case 'update:password': {
    //   const name = form.get('name')
    //   console.log(name)
    //   if (!name) return
    //   const updatedUser = await updateUserName(user.id, name.toString())
    //   const authFormData = new FormData()
    //   authFormData.append('name', updatedUser.name)
    //   authFormData.append('password', user.password)

    //   const refreshedUser = await authenticator.authenticate('form', new Request(request!.url + '/login', {body: authFormData, method: 'post'}))
    // }
    case 'logout': {
      return await authenticator.logout(request, {
        redirectTo: '/login'
      })
    }
  }
}

const Profile = () => {
  const {user} = useLoaderData<typeof loader>()

  const [currentPwdVal, setCurrentPwdVal] = useState('')
  const [newPwdVal, setNewPwdVal] = useState('')

  const handleCurrentPwdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPwdVal(event.target.value);
  }

  const handleNewPwdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPwdVal(event.target.value);
  }

  return (
    <Container className="pt-5 flex flex-col h-screen">
      <h1 className="text-4xl mb-4">Your profile</h1>

      <div className="mb-1">Change password</div>
      <Form method="put">
        <Input 
          className="mb-2"
          name="currentPassword" 
          placeholder="Current password" 
          value={currentPwdVal} 
          onChange={handleCurrentPwdChange}/>
        <Input 
          name="newPassword" 
          placeholder="New password" 
          value={newPwdVal} 
          onChange={handleNewPwdChange}/>
        <Button 
          className="
            mt-4 
            mr-auto 
            bg-blue-400 
            text-white 
            rounded-lg 
            px-4 
            py-2" 
            type="submit" 
            value="update:name" 
            name="action">
          Change
        </Button>
      </Form>

      <div className="mt-auto w-full flex justify-between items-center py-4">
        <Link to='/tasks'>
          <ClipboardDocumentListIcon className="w-8"/>
        </Link>

        <Link to='/dashboard' 
          className="
            rounded-full 
            bg-green-400 
            text-white 
            w-24 
            h-24 
            flex 
            flex-col 
            items-center 
            justify-center">
          <HomeIcon className="w-10 "/>
        </Link>

        <Form method="post">
          <Button className="flex" type="submit" value="logout" name="action">
            <ArrowRightOnRectangleIcon className="w-8"/>
          </Button>
        </Form>
      </div>

    </Container>
  )
}

export default Profile