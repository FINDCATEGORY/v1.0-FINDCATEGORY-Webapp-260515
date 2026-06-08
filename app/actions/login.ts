"use server"

import { cookies } from "next/headers"
import { supabase } from "@/lib/supabase"
import bcrypt from "bcryptjs"

export async function loginAction(formData: FormData) {
  const username = (formData.get("username") as string)?.trim()
  const password = formData.get("password") as string

  if (!username || !password) {
    return { success: false, error: "아이디와 비밀번호를 모두 입력해주세요." }
  }

  // 관리자 하드코딩 로그인 통과 (Supabase 조회 생략)
  if (username === "findcategoryadmin") {
    const cookieStore = await cookies()
    const sessionToken = Buffer.from(JSON.stringify({ id: "admin", username: "findcategoryadmin" })).toString('base64')
    
    cookieStore.set("membership_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })
    return { success: true }
  }

  try {
    const { data: user, error } = await supabase
      .from("b2b_signups")
      .select("*")
      .eq("username", username)
      .single()

    if (error || !user) {
      return { success: false, error: "일치하는 회원 정보가 없습니다." }
    }

    // 2. 비밀번호 검증
    if (!user.password) {
      return { success: false, error: "비밀번호가 설정되지 않은 계정입니다." }
    }

    let isValid = false
    // Supabase 대시보드에서 수동으로 설정한 평문 비밀번호 지원
    if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$") || user.password.startsWith("$2y$")) {
      isValid = await bcrypt.compare(password, user.password)
    } else {
      isValid = password === user.password
    }

    if (!isValid) {
      return { success: false, error: "비밀번호가 올바르지 않습니다." }
    }

    // 3. 쿠키에 세션 토큰 저장 (단순화된 방식: 실제 상용 환경에서는 JWT 권장)
    const cookieStore = await cookies()
    // 임의의 세션 토큰 형태로 저장 (유저 아이디 포함)
    const sessionToken = Buffer.from(JSON.stringify({ id: user.id, username: user.username })).toString('base64')
    
    cookieStore.set("membership_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7일 유지
      path: "/",
    })

    return { success: true }
  } catch (err) {
    console.error("Login Error:", err)
    return { success: false, error: "로그인 처리 중 서버 오류가 발생했습니다. 상세: " + (err instanceof Error ? err.message : String(err)) }
  }
}

// 생체 인증 모의(Mock) 로그인 액션 (비밀번호 없이 아이디만으로 강제 로그인 처리)
export async function biometricLoginMockAction(username: string) {
  try {
    const { data: user, error } = await supabase
      .from("b2b_signups")
      .select("*")
      .eq("username", username)
      .single()

    if (error || !user) {
      return { success: false, error: "등록된 생체 정보와 일치하는 계정을 찾을 수 없습니다." }
    }

    const cookieStore = await cookies()
    const sessionToken = Buffer.from(JSON.stringify({ id: user.id, username: user.username })).toString('base64')
    
    cookieStore.set("membership_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return { success: true }
  } catch (err) {
    return { success: false, error: "생체 인증 처리 중 오류가 발생했습니다." }
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete("membership_session")
}
