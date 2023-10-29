import { 
  json, 
  type ActionFunctionArgs, 
  type LoaderFunctionArgs, 
  type MetaFunction } 
  from "@remix-run/node";
import authenticator from "~/services/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "StreakTracker" },
    { name: "description", content: "Streak tracker app" },
  ];
};

export const loader = async ({request}: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
    successRedirect: '/dashboard'
  })

  return json({user})
}

export const action = async ({request}: ActionFunctionArgs) => {
  const form = await request.formData()
  const action = form.get('action')

  switch(action) {
    case 'logout': {
      return await authenticator.logout(request, {
        redirectTo: '/login'
      })
    }
  }
}