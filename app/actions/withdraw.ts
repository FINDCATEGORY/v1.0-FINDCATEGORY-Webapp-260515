"use server";

import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";

export async function withdrawAction(username: string) {
  if (!username) {
    return { success: false, error: "사용자 정보가 없습니다." };
  }

  try {
    const { error } = await supabase
      .from("b2b_signups")
      .delete()
      .eq("username", username);

    if (error) {
      console.error("Failed to delete user:", error);
      return { success: false, error: "회원탈퇴 처리 중 오류가 발생했습니다." };
    }

    const cookieStore = await cookies();
    cookieStore.delete("membership_session");

    return { success: true };
  } catch (err) {
    console.error("Withdraw Action Error:", err);
    return { success: false, error: "서버 오류가 발생했습니다." };
  }
}
