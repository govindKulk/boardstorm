import Link from 'next/link'
import React from 'react'

export default function NotFound() {
  return (
    <div
    className="h-full min-h-[calc(100vh-237px-88px)] flex flex-col items-center justify-center py-4 text-center"
    >

      <h2
      className='text-xl sm:text-2xl md:text-3xl font-bold py-2'
      >Available Soon</h2>
      <p className='text-lg '>Sorry for inconvenience , I am working on it!</p>

      <Link href="/" className='p-2 my-4 border  bg-muted     border-slate-500 rounded-lg  font-semibold transition-all shadow-lg hover:shadow-xl' >
        Back to Home
      </Link>

    </div>
  )
}