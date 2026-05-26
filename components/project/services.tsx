import { ArrowUpRight, Brain, Sparkles, ImageIcon, Video, Settings } from "lucide-react"
import Link from "next/link"

const services = [
  {
    icon: Brain,
    title: "LLM & Chatbot Development",
    description:
      "Build intelligent conversational AI powered by large language models for customer support, automation, and engagement.",
    href: "/services/llm-chatbots",
  },
  {
    icon: Sparkles,
    title: "Custom AI Model Training",
    description: "Train and fine-tune AI models tailored to your specific business needs and industry requirements.",
    href: "/services/ai-training",
  },
  {
    icon: ImageIcon,
    title: "Generative AI for Images",
    description: "Create stunning visuals with AI-powered image generation, editing, and enhancement technologies.",
    href: "/services/ai-images",
  },
  {
    icon: Video,
    title: "AI Video Generation",
    description: "Transform ideas into engaging videos using cutting-edge generative AI and video synthesis.",
    href: "/services/ai-video",
  },
]

export default function Services() {
  return (
    <section id="services" className="py-20 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Content */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-medium text-foreground/70">FINDCATEGORYⓇTableware</span>
            </div>

            <h2 className="text-3xl text-foreground mb-6 md:text-5xl">테이블웨어 with 뢰슈티</h2>

            <p className="text-foreground/70 max-w-lg">
              스위스 가정식🇨🇭. 스위스식 감자 팬케이크 Rösti (뢰슈티)
              <br></br>
              강판에 간 감자를 프라이팬에 노릇하게 구운 감자 팬케이크. 전통적으로 스위스의 아침 식사로 알려져 있으며,
              한국의 감자채전과 같은 인상을 준다.
            </p>

        
          </div>

          
          </div>
        </div>
      </div>
    </section>
  )
}
