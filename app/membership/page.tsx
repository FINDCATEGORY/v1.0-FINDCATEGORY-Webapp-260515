import { cookies } from "next/headers"
import LoginForm from "./login-form"
import MembershipDashboard from "./dashboard-client"
import { supabase } from "@/lib/supabase"

export default async function MembershipPage() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("membership_session")

  // 세션 쿠키가 없으면 로그인 페이지 렌더링
  if (!sessionCookie || !sessionCookie.value) {
    return <LoginForm />
  }

  // 세션 쿠키가 있으면 (유효하다고 가정) 멤버십 대시보드 렌더링
  let username = "";
  let email = "";
  let points = 0;
  try {
    const session = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString());
    username = session.username || "회원";
    
    if (username !== "회원") {
      const { data } = await supabase.from("b2b_signups").select("email, points").eq("username", username).single();
      if (data) {
        if (data.email) email = data.email;
        if (data.points !== undefined) points = data.points;
      }
    }
  } catch (e) {
    username = "회원";
  }

  return <MembershipDashboard username={username} email={email} points={points} />
}
