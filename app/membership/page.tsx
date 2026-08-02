import { Suspense } from "react"
import { cookies } from "next/headers"
import LoginForm from "./login-form"
import MembershipDashboard from "./dashboard-client"
import { supabase } from "@/lib/supabase"
import { redirect } from "next/navigation"

async function MembershipContent() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("membership_session")

  if (!sessionCookie || !sessionCookie.value) {
    return <LoginForm />
  }

  let username = "";
  let email = "";
  let tier = "user";
  try {
    const session = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString());
    username = session.username || "회원";
    tier = session.tier || "user";

    if (username !== "회원" && username !== "findcategoryadmin" && username !== "admin") {
      const { data, error } = await supabase.from("b2b_signups").select("email, tier").eq("username", username).single();
      if (data) {
        if (data.email) email = data.email;
        if (data.tier) tier = data.tier;
      }
    }
  } catch (e) {
    console.error("Failed to parse session or fetch supabase data:", e);
    username = "회원";
  }

  if (tier === "admin" || username === "findcategoryadmin" || username === "admin") {
    redirect("/membership/admin");
  }
  
  return <MembershipDashboard username={username} email={email} grade={tier.toUpperCase() as any} />
}

export default function MembershipPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <MembershipContent />
    </Suspense>
  )
}
