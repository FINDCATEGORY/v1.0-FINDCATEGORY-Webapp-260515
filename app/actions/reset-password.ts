"use server";

import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export async function submitResetPassword(formData: FormData) {
  const username = (formData.get("username") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();

  if (!username || !email) {
    return { error: "아이디와 이메일을 모두 입력해주세요." };
  }
  
  console.log("Reset Password Action triggered:", { username, email, supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL });

  try {
    // 1. Verify user exists and matches email
    const { data: user, error: fetchError } = await supabase
      .from("b2b_signups")
      .select("id, name, email")
      .eq("username", username)
      .eq("email", email)
      .maybeSingle();

    if (fetchError) {
      console.error("Fetch Error in reset-password:", fetchError);
      return { error: "DB 에러: " + fetchError.message };
    }
    
    if (!user) {
      return { error: `계정 정보 불일치. (입력된 아이디: '${username}', 이메일: '${email}')` };
    }

    // 2. Generate a temporary password (e.g., 8 random alphanumeric characters)
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedTempPassword = await bcrypt.hash(tempPassword, 10);

    // 3. Update the password in database
    const { error: updateError } = await supabase
      .from("b2b_signups")
      .update({ password: hashedTempPassword })
      .eq("id", user.id);

    if (updateError) {
      console.error("Failed to update password:", updateError);
      return { error: "비밀번호 재설정 중 오류가 발생했습니다." };
    }

    // 4. Send email with temporary password using nodemailer
    const transporter = nodemailer.createTransport({
      host: "smtp.daum.net",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"FINDCATEGORY" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "[FINDCATEGORY] 임시 비밀번호 발급 안내",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #4C050C; margin-bottom: 20px;">FINDCATEGORY 임시 비밀번호 안내</h2>
          <p>안녕하세요, <strong>${user.name}</strong>님.</p>
          <p>요청하신 계정(<strong>${username}</strong>)의 임시 비밀번호가 발급되었습니다.</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #666;">임시 비밀번호</p>
            <p style="margin: 10px 0 0 0; font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #4C050C;">
              ${tempPassword}
            </p>
          </div>
          <p>보안을 위해 로그인 후 반드시 비밀번호를 변경해 주시기 바랍니다.</p>
          <br/>
          <p style="font-size: 12px; color: #999;">본 메일은 발신 전용입니다.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return { success: true };
  } catch (err: any) {
    console.error("Reset Password Action Error:", err);
    return { error: "이메일 발송 중 오류가 발생했습니다. 이메일 서버 설정을 확인해주세요." };
  }
}
