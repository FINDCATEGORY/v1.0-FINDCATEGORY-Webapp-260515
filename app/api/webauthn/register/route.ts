import { NextRequest, NextResponse } from "next/server";
import { generateRegistrationOptions, verifyRegistrationResponse } from "@simplewebauthn/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import { rpID, rpName, origin } from "../config";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionStr = cookieStore.get("membership_session")?.value;
    
    if (!sessionStr) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = JSON.parse(Buffer.from(sessionStr, 'base64').toString());
    
    // 이 유저의 기존 패스키 목록을 가져와서 제외(excludeCredentials) 처리
    const { data: existingKeys } = await supabase
      .from("passkeys")
      .select("credential_id")
      .eq("user_id", session.id);

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: new TextEncoder().encode(session.username),
      userName: session.username,
      attestationType: "none",
      excludeCredentials: existingKeys?.map(key => ({
        id: key.credential_id,
        type: "public-key",
        transports: ["internal", "hybrid"],
      })),
      authenticatorSelection: {
        residentKey: "preferred",
        userVerification: "preferred",
      },
    });

    // 챌린지를 쿠키에 임시 저장 (서명 검증 시 사용)
    cookieStore.set("webauthn_challenge", options.challenge, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 5, // 5분
      path: "/",
    });

    return NextResponse.json(options);
  } catch (error: any) {
    console.error("Registration Options Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cookieStore = await cookies();
    const sessionStr = cookieStore.get("membership_session")?.value;
    const expectedChallenge = cookieStore.get("webauthn_challenge")?.value;

    if (!sessionStr || !expectedChallenge) {
      return NextResponse.json({ error: "Unauthorized or missing challenge" }, { status: 400 });
    }

    const session = JSON.parse(Buffer.from(sessionStr, 'base64').toString());

    let verification;
    try {
      verification = await verifyRegistrationResponse({
        response: body,
        expectedChallenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
        requireUserVerification: false,
      });
    } catch (error: any) {
      console.error(error);
      require('fs').writeFileSync('/Users/chohyeonwoo/Documents/2.웹앱/v1.0-FINDCATEGORY-Webapp-260515/v1.0-FINDCATEGORY-Webapp-260515-main/webauthn_error.log', JSON.stringify({ step: 'verify', msg: error.message, stack: error.stack }));
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const { verified, registrationInfo } = verification;

    if (verified && registrationInfo) {
      const { credentialDeviceType, credentialBackedUp } = registrationInfo;
      const { id, publicKey, counter } = registrationInfo.credential;

      const credentialIDStr = id;
      const publicKeyStr = Buffer.from(publicKey).toString('base64');

      // DB 저장
      const { error: dbError } = await supabase
        .from("passkeys")
        .insert({
          credential_id: credentialIDStr,
          user_id: session.id,
          webauthn_user_id: session.username,
          public_key: publicKeyStr,
          counter: counter,
          device_type: credentialDeviceType,
          backed_up: credentialBackedUp,
          transports: body.response.transports?.join(',') || ""
        });

      if (dbError) {
        console.error("DB Insert Error:", dbError);
        require('fs').writeFileSync('/Users/chohyeonwoo/Documents/2.웹앱/v1.0-FINDCATEGORY-Webapp-260515/v1.0-FINDCATEGORY-Webapp-260515-main/webauthn_error.log', JSON.stringify({ step: 'db', error: dbError }));
        return NextResponse.json({ error: "Failed to save passkey to database" }, { status: 500 });
      }

      // 챌린지 지우기
      cookieStore.delete("webauthn_challenge");

      return NextResponse.json({ verified: true });
    }

    return NextResponse.json({ verified: false, error: "Verification failed" }, { status: 400 });
  } catch (error: any) {
    console.error("Registration Verification Error:", error);
    require('fs').writeFileSync('/Users/chohyeonwoo/Documents/2.웹앱/v1.0-FINDCATEGORY-Webapp-260515/v1.0-FINDCATEGORY-Webapp-260515-main/webauthn_error.log', JSON.stringify({ step: 'catch_all', msg: error.message, stack: error.stack }));
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
