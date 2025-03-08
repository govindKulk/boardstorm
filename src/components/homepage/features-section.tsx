import { FaBrain, FaUsers, FaBolt, FaLock, FaChartLine, FaRegLightbulb } from "react-icons/fa"

export function FeaturesSection() {
  const features = [
    {
      icon: <FaBrain className="h-10 w-10 text-primary" />,
      title: "Intelligent Boards",
      description:
        "Create dynamic boards with AI-powered suggestions that help you organize your thoughts and ideas more effectively.",
    },
    {
      icon: <FaUsers className="h-10 w-10 text-primary" />,
      title: "Real-time Collaboration",
      description:
        "Work together with your team in real-time, seeing changes instantly and avoiding conflicts or duplicated work.",
    },
    {
      icon: <FaBolt className="h-10 w-10 text-primary" />,
      title: "Lightning Fast",
      description:
        "Experience unparalleled performance with our optimized platform, designed for speed even with complex boards.",
    },
    {
      icon: <FaLock className="h-10 w-10 text-primary" />,
      title: "Enterprise Security",
      description:
        "Keep your data safe with enterprise-grade security features, including encryption and access controls.",
    },
    {
      icon: <FaChartLine className="h-10 w-10 text-primary" />,
      title: "Advanced Analytics",
      description: "Gain insights into your team's productivity and workflow with detailed analytics and reporting.",
    },
    {
      icon: <FaRegLightbulb className="h-10 w-10 text-primary" />,
      title: "Unlimited Templates",
      description:
        "Get started quickly with hundreds of pre-built templates for any use case, from project planning to brainstorming.",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">Features</div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Everything you need to collaborate effectively
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Board Storm combines powerful features with an intuitive interface to help your team work better together.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-12 mt-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="rounded-full border p-4 bg-background">{feature.icon}</div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-center text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

