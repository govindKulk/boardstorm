import { auth } from '@/auth'
import React from 'react'

export default async function HomePage() {
  const session = await auth();
  console.log("session >> ", session);
  return (
    <div>home page</div>
  )
}
