import SingInButton from '@/components/auth/signin-button'
import { Navbar } from '@/components/homepage/navbar'
import SignInForm from '@/components/signin-form'
import React from 'react'

function SignInpage() {
  return (
    <div
    className='h-screen max-w-[90vw] mx-auto sm:max-w-none '
    >
      <div
      className='h-full flex items-center justify-center flex-col'
      >
        <SignInForm/>

      </div>

    </div>
  )
}

export default SignInpage