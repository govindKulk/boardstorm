import Link from 'next/link'
import React from 'react'
import { FaRegLightbulb } from 'react-icons/fa'

function BrandLogo() {
  return (
    <Link href="/" className="flex items-center gap-2">
            <FaRegLightbulb className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">BoardStorm</span>
          </Link>
  )
}

export default BrandLogo