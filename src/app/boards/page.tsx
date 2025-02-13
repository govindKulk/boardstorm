import { auth } from "@/auth"
import { SignIn } from "@/components/auth/signin-button";

export default async function SingleBoardPage() {
  

  const session = await auth();
  if(!session){
    
    return (
    <div>
      You are not LoggedIn.Sign in or create new account.
      <SignIn/>
    </div>
  )
}

if(session){
  return (
    <div>
      All Board Page
    </div>
  )


}
}
