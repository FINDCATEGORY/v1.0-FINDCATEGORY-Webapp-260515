const handleFormSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!formData.name || !formData.phone || !formData.email || !selectedFile) {
    alert("모든 항목을 입력하고 사업자등록증 파일을 첨부해 주세요.")
    return
  }

  try {
    const formDataObj = new FormData()
    formDataObj.append('name', formData.name)
    formDataObj.append('phone', formData.phone)
    formDataObj.append('email', formData.email)
    formDataObj.append('file', selectedFile)

    const res = await fetch('/api/signup', {
      method: 'POST',
      body: formDataObj,
    })

    if (!res.ok) throw new Error("제출 실패")
    
    setFormSubmitted(true)
  } catch (error) {
    alert("제출 중 오류가 발생했습니다.")
  }
}