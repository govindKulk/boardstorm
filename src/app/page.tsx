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


export const metadata = {
  title: "Home | BoardStorm",
  description: "BoardStorm is a collaborative whiteboard tool for brainstorming and organizing ideas.",
  // openGraph: {
  //   title: "Home | BoardStorm",
  //   description: "BoardStorm is a collaborative whiteboard tool for brainstorming and organizing ideas.",
  //   url: "https://boardstorm.com",
  //   images: [
  //     {
  //       url: "https://boardstorm.com/og-image.png",
  //       width: 1200,
  //       height: 630,
  //       alt: "BoardStorm - Collaborative Whiteboard Tool",
  //       type: "image/png",  
  //     }
  //   ]
  // }
}


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


