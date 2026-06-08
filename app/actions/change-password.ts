"use server";

import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function changePasswordAction(username: string, currentPassword: string, newPassword: string) {
  if (!username || !currentPassword || !newPassword) {
    return { success: false, error: "모든 필드를 입력해주세요." };
  }

  try {
    const { data: user, error: fetchError } = await supabase
      .from("b2b_signups")
      .select("password")
      .eq("username", username)
      .single();

    if (fetchError || !user) {
      return { success: false, error: "사용자를 찾을 수 없습니다." };
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return { success: false, error: "현재 비밀번호가 일치하지 않습니다." };
    }

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
