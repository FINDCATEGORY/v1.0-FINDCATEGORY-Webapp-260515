"use server";

import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";

export async function getUserProfile() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("membership_session");
  
  if (!sessionCookie || !sessionCookie.value) {
    return { user: null, error: "로그인이 필요합니다." };
  }

  try {
    const session = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString());
    const username = session.username;

    if (!username || username === "회원" || username === "admin") {
      return { user: null, error: "비회원입니다." };
    }

    const { data: user, error } = await supabase
      .from("b2b_signups")
      .select("name, email, phone")
      .eq("username", username)
      .maybeSingle();

    if (error || !user) {
      return { user: null, error: "사용자 정보를 찾을 수 없습니다." };
    }

    return { user };
  } catch (err) {
    console.error("getUserProfile error:", err);
    return { user: null, error: "세션 파싱 오류" };
  }
}
