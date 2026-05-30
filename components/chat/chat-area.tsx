"use client"

import { LogOut, Mic, ArrowUp, ArrowLeft, CheckCircle2, Paperclip } from "lucide-react" // ✨ ArrowLeft(뒤로가기) 아이콘 사용
import { Button } from "@/components/ui/button"
import { useState, useRef, useEffect } from "react"
import { ParticleOrb } from "@/components/chat/particle-orb"
import Link from "next/link"

export function ChatArea() {
  const [isRecording, setIsRecording] = useState(false)
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([])
  const [input, setInput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const isSending = useRef(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // 회원가입 폼 상태 관리
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 메시지 추가될 때마다 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isStreaming])

  const executeSend = async (textToSend: string) => {
    if (!textToSend || isSending.current || isStreaming) return

    isSending.current = true
    setInput("")

    setMessages((prev) => [...prev, { role: 'user', content: textToSend }])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || `서버 응답 오류: ${res.status}`)
      }

      const data = await res.json()
      let fullText = data.reply || ""
      
      if (textToSend === "회원가입 절차") {
        fullText = "파인드카테고리는 B2B 스토어 입니다.\n회원 가입을 위해 다음 내용을 입력해 주세요.\n[SHOW_SIGNUP_FORM]";
      }

      setMessages((prev) => [...prev, { role: 'ai', content: '' }])
      setIsStreaming(true)

      let currentIndex = 0
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
          if (streamIntervalRef.current) {
            clearInterval(streamIntervalRef.current)
          }
          setIsStreaming(false)
        }
      }, 20)

    } catch (error) {
      console.error("API 통신 중 오류 발생:", error)
      setMessages((prev) => [...prev, {
        role: 'ai',
        content: `응답을 가져오는 데 실패했습니다. (원인: ${error instanceof Error ? error.message : "알 수 없는 오류"})`
      }])
      setIsStreaming(false)
    } finally {
      isSending.current = false
    }
  }

  const handleSend = () => {
    executeSend(input.trim())
  }

  // ✨ 뒤로가기 버튼 클릭 시 채팅방을 처음 상태로 완전 리셋하는 함수
  const handleResetToHome = () => {
    if (isStreaming || isSending.current) return; // 전송 중이거나 스트리밍 중일 때 작동 방지
    
    setMessages([]); // 대화 내역 초기화로 첫 화면 컴포넌트 유도
    setInput("");
    setFormData({ name: "", phone: "", email: "" });
    setSelectedFile(null);
    setFormSubmitted(false);
    
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || !selectedFile) {
      alert("모든 항목을 입력하고 사업자등록증 파일을 첨부해 주세요.");
      return;
    }
    setFormSubmitted(true);
  };

  const suggestionButtons = [
    "회원가입 절차",
    "파인드카테고리 소개",
    "제품구매방법"
  ]

  return (
    <main className="flex-1 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />

      {/* 회원가입 폼 내부 파일 첨부용 히든 인풋 */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*, .pdf"
        onChange={(e) => setSelectedFile(e.files?.[0] || null)}
      />

      {/* 상단 헤더 영역 */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur-md bg-black/20">
        <span className="text-white font-bold tracking-wider select-none">
          FINDCATEGORYⓇ
        </span>
        <Link href="/">
          <Button className="h-10 px-5 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/20 hover:text-red-400 text-white transition-colors duration-200">
            <LogOut className="w-4 h-4 mr-2" /> 나가기
          </Button>
        </Link>
      </header>

      {/* 메시지 출력 및 가입 폼 렌더링 영역 */}
      <div className="relative z-10 flex-1 overflow-y-auto px-6 pt-6">
        <div className="w-full max-w-4xl mx-auto space-y-4 pb-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center pt-12">
              <div className="relative mb-6"><ParticleOrb /></div>
              <h1 className="text-4xl font-semibold text-foreground mb-8 text-center tracking-tight">무엇을 도와드릴까요?</h1>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-3xl px-4">
                {suggestionButtons.map((text, idx) => (
                  <Button
                    key={idx}
                    onClick={() => executeSend(text)}
                    disabled={isStreaming || isSending.current}
                    className="h-auto py-4 px-5 whitespace-normal break-keep rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-medium transition-all duration-200 shadow-sm flex items-center justify-center text-center"
                  >
                    {text}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {messages.map((m, i) => {
            const isFormTriggered = m.content.includes("[SHOW_SIGNUP_FORM]");
            const displayContent = m.content.replace("[SHOW_SIGNUP_FORM]", "");

            return (
              <div key={i} className="flex flex-col space-y-3">
                {m.content && (
                  <div className={`p-4 rounded-2xl max-w-[80%] whitespace-pre-wrap ${m.role === 'user' ? 'bg-blue-600/20 text-white ml-auto' : 'bg-white/10 text-white'}`}>
                    {displayContent}
                    {m.role === 'ai' && isStreaming && i === messages.length - 1 && (
                      <span className="inline-block w-2 h-5 ml-1 bg-white animate-pulse"></span>
                    )}
                  </div>
                )}

                {m.role === 'ai' && isFormTriggered && (
                  <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl animate-in fade-in-40 duration-300">
                    {!formSubmitted ? (
                      <form onSubmit={handleFormSubmit} className="space-y-3">
                        <div>
                          <label className="block text-xs text-white/60 font-medium mb-1">담당자 성함</label>
                          <input 
                            type="text" required placeholder="이름" 
                            value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white outline-none text-sm focus:border-white/30"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-white/60 font-medium mb-1">연락처</label>
                          <input 
                            type="tel" required placeholder="폰번호" 
                            value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white outline-none text-sm focus:border-white/30"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-white/60 font-medium mb-1">이메일</label>
                          <input 
                            type="email" required placeholder="이메일" 
                            value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white outline-none text-sm focus:border-white/30"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-white/60 font-medium mb-1">사업자등록증</label>
                          <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full border border-dashed border-white/20 hover:border-white/40 bg-black/20 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors text-center"
                          >
                            <Paperclip className="w-4 h-4 text-white/50" />
                            <span className="text-xs text-white/80">
                              {selectedFile ? `📄 ${selectedFile.name}` : "파일 선택 (이미지 또는 PDF)"}
                            </span>
                          </div>
                        </div>
                        <Button type="submit" className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl h-10">
                          가입 정보 제출하기
                        </Button>
                      </form>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-4 text-center gap-2">
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                        <span className="text-sm text-white/90 font-medium">제출이 정상 완료되었습니다!</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 하단 입력창 고정 영역 */}
      <div className="relative z-10 px-6 pb-6">
        <div className="w-full max-w-4xl mx-auto bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-4 shadow-2xl">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Ask Anything..."
            className="w-full bg-transparent border-none outline-none resize-none text-white text-lg min-h-[80px] placeholder:text-gray-500"
          />
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div className="flex gap-2">
              {/* ✨ Attach 버튼을 [뒤로가기] 버튼으로 전면 수정 완료 */}
              <Button 
                variant="ghost" 
                onClick={handleResetToHome}
                disabled={messages.length === 0} // 대화가 전혀 없는 첫 화면일 때는 비활성화
                className="h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-all"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> 뒤로가기
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-white/5 border border-white/10 text-white/70" onClick={() => setIsRecording(!isRecording)}><Mic className="w-4 h-4" /></Button>
              <Button size="icon" onClick={handleSend} disabled={isStreaming} className="h-9 w-9 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 text-white disabled:opacity-50"><ArrowUp className="w-5 h-5" /></Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}