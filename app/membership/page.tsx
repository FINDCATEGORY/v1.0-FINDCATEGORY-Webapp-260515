import { cookies } from "next/headers"
import LoginForm from "./login-form"
import MembershipDashboard from "./dashboard-client"
import { supabase } from "@/lib/supabase"

import { redirect } from "next/navigation"

export default async function MembershipPage() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("membership_session")

  // 세션 쿠키가 없으면 로그인 페이지 렌더링
  if (!sessionCookie || !sessionCookie.value) {
    return <LoginForm />
  }

  let username = "";
  let email = "";
  let points = 0;
  let tier = "user";
  try {
    const session = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString());
    username = session.username || "회원";
    tier = session.tier || "user";
    
    if (username !== "회원" && username !== "findcategoryadmin" && username !== "admin") {
      const { data } = await supabase.from("b2b_signups").select("email, points").eq("username", username).single();
      if (data) {
        if (data.email) email = data.email;
        if (data.points !== undefined) points = data.points;
      }
    }
  } catch (e) {
    username = "회원";
  }

  // 관리자 등급 로그인 시 관리자 페이지로 리다이렉트
  if (tier === "admin" || username === "findcategoryadmin" || username === "admin") {
    redirect("/membership/admin");
  }
  return <MembershipDashboard username={username} email={email} points={points} grade={tier.toUpperCase() as any} />
}
