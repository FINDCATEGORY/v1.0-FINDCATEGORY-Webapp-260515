"use server";

import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function checkUsername(username: string) {
  if (!username) return { isDuplicate: false };
  try {
    const { createClient } = require('@supabase/supabase-js');
    const localSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    const { data: existingUser } = await localSupabase
      .from("b2b_signups")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    return { isDuplicate: !!existingUser };
  } catch (err) {
    console.error("Username check error:", err);
    return { error: "오류가 발생했습니다." };
  }
}

export async function submitSignup(formData: FormData) {
  const username = (formData.get("username") as string)?.trim();
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const company_name = formData.get("company_name") as string;
  const department = formData.get("department") as string;

  if (!username || !password || !name || !email || !phone || !company_name || !department) {
    return { error: "필수 입력란을 모두 채워주세요." };
  }

  try {
    const { createClient } = require('@supabase/supabase-js');
    const localSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Check for duplicate username
    const { data: existingUser } = await localSupabase
      .from("b2b_signups")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (existingUser) {
      return { error: "이미 사용 중인 아이디입니다. 다른 아이디를 입력해주세요." };
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    const data = {
      username,
      password: hashedPassword,
      name,
      email,
      phone,
      company_name,
      department,
    };

    const { error } = await localSupabase.from("b2b_signups").insert([data]);

    if (error) {
      console.error("Supabase insert error:", error);
      return { error: "회원가입 처리 중 오류가 발생했습니다." };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Signup Action Error:", err);
    return { error: "서버 오류가 발생했습니다." };
  }
}
