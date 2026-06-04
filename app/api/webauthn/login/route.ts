import { NextRequest, NextResponse } from "next/server";
import { generateAuthenticationOptions, verifyAuthenticationResponse } from "@simplewebauthn/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import { rpID, origin } from "../config";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const username = url.searchParams.get("username");

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const { data: user } = await supabase.from("b2b_signups").select("id").eq("username", username).single();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { data: passkeys } = await supabase.from("passkeys").select("*").eq("user_id", user.id);
    if (!passkeys || passkeys.length === 0) {
      return NextResponse.json({ error: "No passkeys registered" }, { status: 404 });
    }

    const options = await generateAuthenticationOptions({
      rpID,
      allowCredentials: passkeys.map((key) => ({
        id: key.credential_id,
        type: "public-key",
        transports: key.transports ? key.transports.split(',') : ["internal", "hybrid"],
      })),
      userVerification: "preferred",
    });

    const cookieStore = await cookies();
    cookieStore.set("webauthn_auth_challenge", options.challenge, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 5,
      path: "/",
    });
    
    // 유저의 ID를 임시로 쿠키에 저장하여 검증 시 사용
    cookieStore.set("webauthn_auth_user", JSON.stringify({ id: user.id, username }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 5,
      path: "/",
    });

    return NextResponse.json(options);
  } catch (error: any) {
    console.error("Auth Options Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cookieStore = await cookies();
    const expectedChallenge = cookieStore.get("webauthn_auth_challenge")?.value;
    const userStr = cookieStore.get("webauthn_auth_user")?.value;

    if (!expectedChallenge || !userStr) {
      return NextResponse.json({ error: "Unauthorized or missing challenge" }, { status: 400 });
    }

    const user = JSON.parse(userStr);

    const { data: passkey } = await supabase
      .from("passkeys")
      .select("*")
      .eq("credential_id", body.id)
      .single();

    if (!passkey) {
      return NextResponse.json({ error: "Authenticator is not registered with this site" }, { status: 400 });
    }

    const verification = await verifyAuthenticationResponse({
      response: body,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: false,
      credential: {
        id: passkey.credential_id,
        publicKey: Buffer.from(passkey.public_key, 'base64'),
        counter: passkey.counter,
        transports: passkey.transports ? passkey.transports.split(',') : undefined,
      },
    });

    if (verification.verified && verification.authenticationInfo) {
      await supabase.from("passkeys").update({ counter: verification.authenticationInfo.newCounter, last_used_at: new Date().toISOString() }).eq("credential_id", passkey.credential_id);
      
      cookieStore.delete("webauthn_auth_challenge");
      cookieStore.delete("webauthn_auth_user");
      
      const sessionToken = Buffer.from(JSON.stringify({ id: user.id, username: user.username })).toString('base64');
      cookieStore.set("membership_session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return NextResponse.json({ verified: true });
    }
    return NextResponse.json({ verified: false, error: "Verification failed" }, { status: 400 });
  } catch (error: any) {
    console.error("Auth Verification Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
