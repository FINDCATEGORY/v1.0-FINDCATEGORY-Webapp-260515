"use server";

import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function changePasswordAction(username: string, newPassword: string) {
  if (!username || !newPassword) {
    return { success: false, error: "새 비밀번호를 입력해주세요." };
  }

  try {
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const { error } = await supabase
      .from("b2b_signups")
      .update({ password: hashedNewPassword })
      .eq("username", username);

    if (error) {
      console.error("Failed to update password:", error);
      return { success: false, error: "비밀번호 변경 중 오류가 발생했습니다." };
    }

    return { success: true };
  } catch (err) {
    console.error("Change Password Action Error:", err);
    return { success: false, error: "서버 오류가 발생했습니다." };
  }
}
