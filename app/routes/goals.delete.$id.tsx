import { Button } from "@mui/base"
import type { ActionFunctionArgs, LoaderFunctionArgs} from "@remix-run/node";
import { json, redirect } from "@remix-run/node"
import { Form, useLoaderData, useNavigate } from "@remix-run/react"
import Modal from "~/components/Modal"
import { deleteGoal, getGoal } from "~/models/goal.server"

export const loader = async ({params}: LoaderFunctionArgs) => {
  if (params.id === undefined) return redirect('/goals')
  const goal = await getGoal(+params.id)
  if (!goal) return redirect('/goals')
  return json(goal)
}

export const action = async ({request}: ActionFunctionArgs) => {
  const form = await request.formData()
  const action = form.get('action')

  switch(action) {
    case 'delete': {
      const goalId = form.get('id')
      if (!goalId) return json(new Error())
      await deleteGoal(+goalId)
      return json({ok: true})
    }
  }
}

const DeleteGoal = () => {
  const navigate = useNavigate()
  const goal = useLoaderData<typeof loader>()
  console.log(goal)
  return (goal !== null) ? (
    <Modal 
      open={true} 
      onClose={() => navigate('/goals')}
      title="Delete goal">
      <Form method="delete" className="ml-auto">
        <input aria-hidden style={{display: 'none'}} type="number" name="id" value={goal.id} readOnly/>
        <p>Are you sure you want to delete this goal?</p>
        <p className="mb-3">"{goal.name}"</p>
        <Button 
          className="
            mt-4 
            mr-auto 
            bg-red-400 
            text-white 
            rounded-lg 
            px-4 
            py-2" 
            type="submit" 
            value="delete" 
            name="action">
          Delete
        </Button>
      </Form>
    </Modal>
  ) : (<div>oops</div>)
}

export default DeleteGoal