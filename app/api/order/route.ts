import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { formData, items, totalQuantity } = await req.json();

    if (!formData || !items) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
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

    const itemsText = items.map((item: any) => `- ${item.name} x ${item.quantity || 1}개`).join('\n');

    const mailBody = `
주문이 성공적으로 접수되었습니다.

[주문자 정보]
이름: ${formData.fullName}
연락처: ${formData.phone}
이메일: ${formData.email}
주소: ${formData.address}

[주문 상품 내역]
${itemsText}
-----------------------------
총 상품 개수: ${totalQuantity}개

빠른 시일 내에 배송을 준비하도록 하겠습니다.
감사합니다.
`;

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: formData.email, // 구매자에게 전송
      bcc: 'cho@findcategory.co.kr', // 관리자에게도 숨은 참조로 전송
      subject: `[FINDCATEGORY] ${formData.fullName}님의 주문이 접수되었습니다.`,
      text: mailBody,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Order email send error:', error);
    return NextResponse.json({ error: 'Failed to send order email' }, { status: 500 });
  }
}
