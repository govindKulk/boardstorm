"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

type SparkleType = {
  id: number,
  createdAt: number,
  color: string,
  size: number,
  style: {
    top: string,
    left: string,
    zIndex: number
  }
}

const Sparkles = ({ children }: { children: React.ReactNode }) => {
  const [sparkles, setSparkles] = useState<SparkleType[]>([])

  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles = []
      const colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#7B68EE", "#FF69B4"]

      for (let i = 0; i < 30; i++) {
        newSparkles.push({
          id: i,
          createdAt: Date.now(),
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 10 + 4,
          style: {
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            zIndex: 2,
          },
        })
      }
      setSparkles(newSparkles)
    }

    generateSparkles()
    const interval = setInterval(generateSparkles, 1500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative inline-block">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute pointer-events-none"
          style={sparkle.style}
          initial={{ scale: 0, rotate: Math.random() * 360 }}
          animate={{
            scale: [0, 1, 0],
            rotate: [0, Math.random() * 360],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
          }}
        >
          <svg width={sparkle.size} height={sparkle.size} viewBox="0 0 160 160" fill="none">
            <path
              d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
              fill={sparkle.color}
            />
          </svg>
        </motion.div>
      ))}
      {children}
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              <Sparkles>Unleash Your Team's Creative Potential</Sparkles>
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              The all-in-one collaborative workspace for teams to brainstorm, plan, and create together in real-time.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 min-[400px]:gap-6">
            <Button size="lg" asChild>
              <Link href="/signup">Get Started for Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/boards/demo">Try Now &rarr;</Link>
            </Button>
          </div>
          <div className="my-16 w-full max-w-5xl relative overflow-hidden rounded-lg border bg-background shadow-xl">
            <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-gradient-to-br from-primary/20 via-muted to-background">
              <iframe width="702" height="395" src="https://www.youtube.com/embed/4xPtlVOqG-8"
                title="BoardStorm: Real-Time Collaborative Whiteboard &amp; Docs App | Built with WebSockets, MongoDB &amp; Konva."
                className="absolute top-0 left-0 h-full w-full rounded-t-lg border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
