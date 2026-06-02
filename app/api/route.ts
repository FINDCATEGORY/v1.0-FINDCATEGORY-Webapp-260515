// 💡 API 호출 없이 클라이언트 내에서 모든 처리를 완료합니다.
const executeSend = async (textToSend: string) => {
  if (!textToSend || isSending.current || isStreaming) return

  isSending.current = true
  setInput("")
  setMessages((prev) => [...prev, { role: 'user', content: textToSend }])

  try {
    // 💡 API 호출을 삭제하고 직접 응답 내용을 설정합니다.
    let fullText = "파인드카테고리 서비스에 문의해 주셔서 감사합니다. 현재 서비스 준비 중입니다.";

    if (textToSend === "회원가입 절차") {
      fullText = "파인드카테고리는 B2B 스토어 입니다.\n회원 가입을 위해 다음 내용을 입력해 주세요.\n[SHOW_SIGNUP_FORM]";
    } else if (textToSend === "파인드카테고리 소개") {
      fullText = "파인드카테고리는 최적의 비즈니스 자재 공급을 지향하는 B2B 플랫폼입니다.";
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
        if (streamIntervalRef.current) clearInterval(streamIntervalRef.current)
        setIsStreaming(false)
      }
    }, 20)

  } catch (error) {
    console.error("처리 중 오류:", error)
  } finally {
    isSending.current = false
  }
}