import { Navbar } from '@/components/homepage/navbar'
import SignupFormDemo from '@/components/signup-form-demo'
import React from 'react'

export default function SingUpPage() {
  return (
       <div
       className='h-screen max-w-[90vw] mx-auto sm:max-w-none '
       >
         <div
         className='h-full flex items-center justify-center flex-col'
         >
           <SignupFormDemo/>
   
         </div>
   
       </div>
  )
}
