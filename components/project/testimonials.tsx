import Image from "next/image"
import { Quote } from "lucide-react"

const testimonials = [
  {
    title: "Revolutionary AI Integration!",
    quote:
      "Their LLM-powered chatbot transformed our customer support. We've seen a 70% reduction in response times and our customers love the intelligent, context-aware conversations.",
    author: "Savannah Nguyen",
    location: "San Francisco, USA",
    image: "/images/imgi_108_user88.webp",
  },
  {
    title: "Incredible Generative AI Results!",
    quote:
      "The AI video generation platform they built for us is phenomenal. We're now producing marketing content 10x faster with professional quality that rivals traditional production.",
    author: "Darlene Robertson",
    location: "Austin, Texas",
    image: "/images/imgi_113_user93.webp",
  },
  {
    title: "Game-Changing Image Generation!",
    quote:
      "The custom AI image models they trained for our brand have revolutionized our creative process. We can now generate on-brand visuals in minutes that used to take our team days.",
    author: "Michael Chen",
    location: "New York, USA",
    image: "/images/imgi_109_user89.webp",
  },
  {
    title: "Outstanding AI Implementation!",
    quote:
      "Working with Genai has been transformative. Their expertise in fine-tuning LLMs for our industry-specific needs has given us a competitive edge we never thought possible.",
    author: "Emily Rodriguez",
    location: "Seattle, Washington",
    image: "/images/imgi_107_user87.webp",
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 px-6 bg-card">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-4">
          <Quote className="w-5 h-5 text-accent" strokeWidth={2} />
          <span className="text-sm font-medium text-foreground/70">Testimonials</span>
        </div>

        <h2 className="text-3xl font-serif text-foreground mb-12 md:text-5xl">Customers Review</h2>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-background rounded-3xl p-8 border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-4">{testimonial.title}</h3>
              <p className="text-foreground/70 mb-8 leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="flex items-center gap-4">
                <Image
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.author}
                  width={56}
                  height={56}
                  className="rounded-full"
                />
                <div>
                  <p className="font-medium text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-foreground/60">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
