import { ArrowUpRight, Cpu, Info } from "lucide-react"
import Link from "next/link"

export default function About() {
  return (
    <section id="about" className="py-16 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Info className="w-5 h-5 text-accent" strokeWidth={2} />
              <span className="text-sm font-medium text-foreground/70">About us</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-serif text-foreground leading-tight text-balance">
              We harness the power of AI, LLMs, and generative technology to transform businesses.
            </h2>

            <p className="mt-6 text-foreground/70">
              Whether you need intelligent chatbots, automated content generation, or custom AI models, we deliver
              state-of-the-art solutions powered by the latest in artificial intelligence.
            </p>

            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent transition-colors group"
            >
              About Us
              <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {/* Right Content - Technology Card */}
          <div className="bg-card rounded-3xl p-8 border border-border">
            <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center mb-6">
              <Cpu className="h-6 w-6 text-accent-foreground" />
            </div>

            <h3 className="text-xl font-semibold text-foreground mb-4">AI-Powered Solutions</h3>

            <p className="text-foreground/70">
              At Genai, we leverage advanced AI technologies including large language models, generative image and video
              AI to create intelligent, scalable solutions that revolutionize how businesses operate.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
