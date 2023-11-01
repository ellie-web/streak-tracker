import { Button } from "@mui/base"
import { json, type ActionFunctionArgs, redirect } from "@remix-run/node"
import { Form, useNavigate } from "@remix-run/react"
import Input from "~/components/Input"
import Modal from "~/components/Modal"
import { createGoal } from "~/models/goal.server"
import authenticator from "~/services/auth.server"

export const action = async ({request}: ActionFunctionArgs) => {
  const form = await request.formData()
  const action = form.get('action')

  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/sign-in'
  })

  switch(action) {
    case 'add': {
      const name = form.get('name')
      if (name === null) return json(new Error('Error'))
      await createGoal({
        userId: user.id, 
        name: name.toString(), 
        start: new Date(), 
        mainGoal: false
      })
      return redirect('/goals')
    }
  }
}

const AddGoal = () => {
  const navigate = useNavigate()
  return (
    <Modal 
      open={true} 
      onClose={() => navigate('/goals')}
      title="New goal">
        <Form method="post">
          <Input name="name" type="text" placeholder="Eg. Not smoking"/>
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
              value="add" 
              name="action">
            Submit
          </Button>
        </Form>
      </Modal>
  )
}

export default AddGoal