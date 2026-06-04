"use client"

import { LogOut, ArrowUp, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useRef, useEffect } from "react"
import { ParticleOrb } from "@/components/chat/particle-orb"
import Link from "next/link"
import { useCart } from "@/components/detail/ui/cart-context"
import Image from "next/image"
import { SignupForm } from "@/components/chat/signup-form"
import { ResetPasswordForm } from "@/components/chat/reset-password-form"

export function ChatArea() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([])
  const [input, setInput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const isSending = useRef(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const { setIsCheckoutOpen, setIsOpen, items, updateQuantity } = useCart()

  // Tally 스크립트 로드 효과
  useEffect(() => {
    if (messages.some(m => m.content.includes("[SHOW_SIGNUP_FORM]") || m.content.includes("[SHOW_BUSINESS_FORM]"))) {
      if (typeof window !== 'undefined') {
        if ((window as any).Tally) {
          (window as any).Tally.loadEmbeds();
        } else if (!document.querySelector('script[src="https://tally.so/widgets/embed.js"]')) {
          const script = document.createElement("script");
          script.src = "https://tally.so/widgets/embed.js";
          script.async = true;
          script.onload = () => {
            if ((window as any).Tally) {
              (window as any).Tally.loadEmbeds();
            }
          };
          document.body.appendChild(script);
        }
      }
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isStreaming])

  const executeSend = async (textToSend: string) => {
    const trimmedText = textToSend.trim();
    if (!trimmedText || isSending.current || isStreaming) return

    isSending.current = true
    setInput("")
    setMessages((prev) => [...prev, { role: 'user', content: trimmedText }])

    let fullText = "문의해 주셔서 감사합니다. 안내는 준비 중입니다."
    if (trimmedText === "회원가입") {
      fullText = " 라이프스타일 스토어, 파인드카테고리의 회원이 되기위한\n회원 가입을 안내해드릴게요!\n[SHOW_SIGNUP_FORM]";
    } else if (trimmedText === "멤버십") {
      fullText = "멤버십 가입을 위한 결제를 진행해 주세요.\n[SHOW_CART_SUMMARY]";
    } else if (trimmedText === "비즈니스") {
      fullText = "비즈니스 문의를 위한 양식을 안내해 드립니다.\n[SHOW_BUSINESS_FORM]";
    } else if (trimmedText === "비밀번호 찾기" || trimmedText.includes("비밀번호")) {
      fullText = "비밀번호를 잊으셨나요?\n가입하신 아이디와 이메일을 입력하시면 임시 비밀번호를 발송해 드립니다.\n[SHOW_RESET_PASSWORD_FORM]";
    } else if (trimmedText === "다른 문의 사항") {
      fullText = "다른 문의 사항이 있으신가요? 자세한 내용을 입력해 주시면 확인 후 답변해 드리겠습니다.";
    }

    setMessages((prev) => [...prev, { role: 'ai', content: '' }])
    setIsStreaming(true)

    let currentIndex = 0
    if (streamIntervalRef.current) clearInterval(streamIntervalRef.current)

    streamIntervalRef.current = setInterval(() => {
      if (currentIndex < fullText.length) {
        const nextText = fullText.slice(0, currentIndex + 1)
        setMessages((prev) => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1].content = nextText
          return newMessages
        })
        currentIndex++
      } else {
        if (streamIntervalRef.current) clearInterval(streamIntervalRef.current)
        setIsStreaming(false)
      }
    }, 20)
    isSending.current = false
  }

  const handleResetToHome = () => {
    if (isStreaming || isSending.current) return
    setMessages([])
  }

  return (
    <main className="flex-1 flex flex-col relative overflow-hidden bg-[#EBEBDF]">
      <header className="relative z-10 flex items-center justify-between px-5 py-4 border-b border-[#4C050C]/10 bg-transparent">
        <Link href="/">
          <span className="text-[#4C050C] font-medium tracking-tight">FINDCATEGORYⓇ</span>
        </Link>
        <Link href="/">
          <Button className="h-10 px-5 rounded-xl bg-[#4C050C]/5 border border-[#4C050C]/20 hover:bg-[#4C050C]/10 text-[#4C050C] transition-colors duration-200">
            <LogOut className="w-4 h-4 mr-2" /> 나가기
          </Button>
        </Link>
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto px-6 pt-6">
        <div className="w-full max-w-4xl mx-auto space-y-4 pb-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center pt-12">
              <div className="relative mb-6"><ParticleOrb /></div>
              <h1 className="text-4xl font-semibold text-[#4C050C] mb-8 text-center tracking-tight">무엇을 도와드릴까요?</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl px-4">
                {[
                  {
                    main: "회원가입",
                    sub: ["아이디 찾기", "비밀번호 찾기"]
                  },
                  {
                    main: "멤버십",
                    sub: ["멤버십 변경", "멤버십 안내"]
                  },
                  {
                    main: "비즈니스",
                    sub: ["대량구매", "공간 스타일링 신청"]
                  }
                ].map((menu, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-3">
                    <Button 
                      onClick={() => executeSend(menu.main)} 
                      className="w-full h-auto py-4 px-5 rounded-md bg-[#4C050C]/5 border border-[#4C050C]/20 hover:bg-[#4C050C]/10 text-[#4C050C] text-base font-medium"
                    >
                      {menu.main}
                    </Button>
                    <div className="flex flex-col items-center gap-2 mt-1">
                      {menu.sub.map((subText, subIdx) => (
                        <button 
                          key={subIdx} 
                          onClick={() => executeSend(subText)}
                          className="text-sm text-[#4C050C]/70 hover:text-[#4C050C] transition-colors"
                        >
                          {subText}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <div className={`p-4 rounded-2xl max-w-[80%] whitespace-pre-wrap ${m.role === 'user' ? 'bg-[#4C050C] text-white ml-auto' : 'bg-white text-[#4C050C] shadow-sm border border-[#4C050C]/10'}`}>
                {m.content.replace("[SHOW_SIGNUP_FORM]", "").replace("[SHOW_BUSINESS_FORM]", "").replace("[SHOW_CART_SUMMARY]", "").replace("[SHOW_RESET_PASSWORD_FORM]", "")}
              </div>
              {m.role === 'ai' && m.content.includes("[SHOW_SIGNUP_FORM]") && (
                <SignupForm />
              )}
              {m.role === 'ai' && m.content.includes("[SHOW_RESET_PASSWORD_FORM]") && (
                <ResetPasswordForm />
              )}
              {m.role === 'ai' && m.content.includes("[SHOW_BUSINESS_FORM]") && (
                <div className="w-full max-w-md bg-white border border-[#4C050C]/10 rounded-2xl p-2 shadow-xl overflow-hidden mt-2">
                  <iframe
                    data-tally-src="https://tally.so/embed/gDvXLN?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
                    loading="lazy"
                    width="100%"
                    height="568"
                    frameBorder="0"
                    marginHeight={0}
                    marginWidth={0}
                    title="BUSINESS CONTACT"
                  ></iframe>
                </div>
              )}
              {m.role === 'ai' && m.content.includes("[SHOW_CART_SUMMARY]") && (
                <div className="w-full max-w-md bg-white border border-[#4C050C]/10 rounded-2xl p-4 shadow-xl mt-2">
                  <h3 className="font-bold text-[#4C050C] mb-4">장바구니 내역</h3>
                  {items.length === 0 ? (
                    <p className="text-[#4C050C]/60 text-sm text-center py-8">장바구니가 비어있습니다.</p>
                  ) : (
                    <>
                      <div className="space-y-4 max-h-60 overflow-y-auto pr-2 no-scrollbar mb-4">
                        {items.map((item, idx) => (
                          <div key={idx} className="flex gap-3 border-b border-[#4C050C]/10 pb-3">
                            <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-[#EBEBDF]/50">
                              {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                              <p className="text-sm text-[#4C050C] font-medium line-clamp-2">{item.name}</p>
                              <div className="flex justify-between items-end">
                                <div className="flex items-center gap-2">
                                  <button onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)} className="w-6 h-6 flex items-center justify-center rounded bg-[#4C050C]/5 text-[#4C050C] hover:bg-[#4C050C]/10">-</button>
                                  <span className="text-xs text-[#4C050C] font-medium w-4 text-center">{item.quantity || 1}</span>
                                  <button onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)} className="w-6 h-6 flex items-center justify-center rounded bg-[#4C050C]/5 text-[#4C050C] hover:bg-[#4C050C]/10">+</button>
                                </div>
                                <p className="text-sm font-bold text-[#4C050C]">{item.price}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button onClick={() => setIsCheckoutOpen(true)} className="w-full bg-[#4C050C] hover:bg-[#4C050C]/90 text-white rounded-xl py-4 h-auto font-medium shadow-md">
                        결제 진행하기
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="relative z-10 px-6 pb-6">
        <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl border border-[#4C050C]/20 p-4 shadow-lg">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault()
                executeSend(input)
              }
            }}
            placeholder="궁금한 점을 물어보세요..."
            className="w-full bg-transparent border-none outline-none resize-none text-[#4C050C] text-lg min-h-[80px] placeholder:text-[#4C050C]/40"
          />
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#4C050C]/10">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mb-1 flex-1">
              <Button variant="ghost" onClick={handleResetToHome} className="h-9 shrink-0 px-3 rounded-lg bg-[#4C050C]/5 border border-[#4C050C]/10 text-[#4C050C]/80 hover:bg-[#4C050C]/10 text-sm font-medium">
                <ArrowLeft className="w-4 h-4 mr-2" /> 처음으로
              </Button>
            </div>
            <Button size="icon" onClick={() => executeSend(input)} className="h-9 w-9 shrink-0 rounded-full bg-[#4C050C] hover:bg-[#4C050C]/90 text-white">
              <ArrowUp className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}