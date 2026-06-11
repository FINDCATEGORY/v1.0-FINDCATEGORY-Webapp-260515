import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { type, companyName, managerName, contact, email, text } = await req.json();

    if (!text || !companyName || !managerName || !contact || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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

    const mailBody = `[FINDCATEGORY 비즈니스 문의]
문의 유형: ${type}

[신청자 정보]
회사명/상호명: ${companyName}
담당자 성함: ${managerName}
연락처: ${contact}
이메일: ${email}

[문의 내용]
${text}`;

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: 'cho@findcategory.co.kr',
      subject: `[FINDCATEGORY 비즈니스] ${type} 문의가 접수되었습니다.`,
      text: mailBody,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Business email send error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
