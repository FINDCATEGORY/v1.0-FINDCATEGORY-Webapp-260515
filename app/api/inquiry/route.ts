import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { username, text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Missing text' }, { status: 400 });
    }

    let toEmail = 'cho@findcategory.co.kr'; // fallback
    let userInfo: any = null;

    if (username) {
      const { data: user } = await supabase
        .from("b2b_signups")
        .select("email, name, phone")
        .eq("username", username)
        .single();
        
      if (user) {
        toEmail = user.email || toEmail;
        userInfo = user;
      }
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.daum.net',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailBody = userInfo 
      ? `고객 ID: ${username}\n성함: ${userInfo.name}\n연락처: ${userInfo.phone}\n이메일: ${userInfo.email}\n\n문의사항:\n${text}`
      : `고객 ID: ${username || '회원'}\n\n문의사항:\n${text}`;

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: toEmail,
      subject: `[1:1 문의] ${userInfo ? userInfo.name : (username || '회원')}님의 문의 내역 접수 완료`,
      text: mailBody,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
