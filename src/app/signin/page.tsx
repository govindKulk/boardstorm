import SingInButton from '@/components/auth/signin-button'
import { Navbar } from '@/components/homepage/navbar'
import SignInForm from '@/components/signin-form'
import React from 'react'

function SignInpage() {
  return (
    <div
    className='h-screen '
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