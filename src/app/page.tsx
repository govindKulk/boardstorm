import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FiSearch, FiPlus } from "react-icons/fi"
import { FaRegUserCircle } from "react-icons/fa"
import Link from "next/link"
import Image from "next/image"
import { HeroSection } from "@/components/homepage/hero-section"
import { FeaturesSection } from "@/components/homepage/features-section"
import { Footer } from "@/components/homepage/footer"
import { Navbar } from "@/components/homepage/navbar"



export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  )
}


