import { Navbar } from '@/components/homepage/navbar'
import SignupFormDemo from '@/components/signup-form-demo'
import React from 'react'

export default function SingUpPage() {
  return (
       <div
       className='h-screen '
       >
         <div
         className='h-full flex items-center justify-center flex-col'
         >
           <SignupFormDemo/>
   
         </div>
   
       </div>
  )
}
