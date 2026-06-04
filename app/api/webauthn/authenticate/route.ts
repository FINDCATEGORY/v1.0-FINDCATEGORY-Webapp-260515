import { NextRequest, NextResponse } from "next/server";
import { generateAuthenticationOptions, verifyAuthenticationResponse } from "@simplewebauthn/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import { rpID, origin } from "../config";

export async function GET(req: NextRequest) {
  try {
    const options = await generateAuthenticationOptions({
      rpID,
      userVerification: "preferred",
    });

    const cookieStore = await cookies();
    cookieStore.set("webauthn_challenge", options.challenge, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 5, // 5분
      path: "/",
    });

    return NextResponse.json(options);
  } catch (error: any) {
    console.error("Authentication Options Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cookieStore = await cookies();
    const expectedChallenge = cookieStore.get("webauthn_challenge")?.value;

    if (!expectedChallenge) {
      return NextResponse.json({ error: "Missing challenge" }, { status: 400 });
    }

    // DB에서 이 credential ID를 가진 패스키 찾기
    const { data: passkey, error: dbError } = await supabase
      .from("passkeys")
      .select("*, b2b_signups(id, username)")
      .eq("credential_id", body.id)
      .single();

    if (dbError || !passkey) {
      return NextResponse.json({ error: "Authenticator is not registered with this site" }, { status: 400 });
    }

    let verification;
    try {
      verification = await verifyAuthenticationResponse({
        response: body,
        expectedChallenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
        authenticator: {
          credentialID: Buffer.from(passkey.credential_id, 'base64'),
          credentialPublicKey: Buffer.from(passkey.public_key, 'base64'),
          counter: Number(passkey.counter),
          transports: passkey.transports ? passkey.transports.split(',') : undefined,
        },
      });
    } catch (error: any) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const { verified, authenticationInfo } = verification;

    if (verified) {
      // 카운터 업데이트
      await supabase
        .from("passkeys")
        .update({ counter: authenticationInfo.newCounter })
        .eq("credential_id", passkey.credential_id);

      // 세션 쿠키 발급 (로그인 성공)
      const user = passkey.b2b_signups;
      const sessionToken = Buffer.from(JSON.stringify({ id: user.id, username: user.username })).toString('base64');
      
      cookieStore.set("membership_session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      cookieStore.delete("webauthn_challenge");

      return NextResponse.json({ verified: true });
    }

    return NextResponse.json({ verified: false, error: "Verification failed" }, { status: 400 });
  } catch (error: any) {
    console.error("Authentication Verification Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
