"use server";

import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";

export async function getUserPointsAndName() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("membership_session");
  
  if (!sessionCookie || !sessionCookie.value) {
    return { username: null, points: 0, error: "로그인이 필요합니다." };
  }

  try {
    const session = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString());
    const username = session.username;

    if (!username || username === "회원") {
      return { username: null, points: 0, error: "비회원입니다." };
    }

    const { data: user, error } = await supabase
      .from("b2b_signups")
      .select("points")
      .eq("username", username)
      .maybeSingle();

    if (error || !user) {
      return { username, points: 0, error: "사용자 정보를 찾을 수 없습니다." };
    }

    return { username, points: user.points || 0 };
  } catch (err) {
    console.error("getUserPointsAndName error:", err);
    return { username: null, points: 0, error: "세션 파싱 오류" };
  }
}


export async function addPoints(username: string, amount: number) {
  if (!username) return { error: "사용자 이름이 없습니다." };
  if (amount <= 0) return { error: "유효하지 않은 충전 금액입니다." };

  try {
    // 1. 현재 포인트 조회
    const { data: user, error: fetchError } = await supabase
      .from("b2b_signups")
      .select("points")
      .eq("username", username)
      .maybeSingle();

    if (fetchError || !user) {
      return { error: "사용자를 찾을 수 없거나 포인트 조회에 실패했습니다." };
    }

    const currentPoints = user.points || 0;
    const newPoints = currentPoints + amount;

    // 2. 포인트 업데이트
    const { error: updateError } = await supabase
      .from("b2b_signups")
      .update({ points: newPoints })
      .eq("username", username);

    if (updateError) {
      return { error: "포인트 충전 중 오류가 발생했습니다." };
    }

    return { success: true, points: newPoints };
  } catch (error) {
    console.error("addPoints error:", error);
    return { error: "서버 오류가 발생했습니다." };
  }
}

export async function deductPoints(username: string, amount: number) {
  if (!username) return { error: "사용자 이름이 없습니다." };
  if (amount <= 0) return { error: "유효하지 않은 차감 금액입니다." };

  try {
    // 1. 현재 포인트 조회
    const { data: user, error: fetchError } = await supabase
      .from("b2b_signups")
      .select("points")
      .eq("username", username)
      .maybeSingle();

    if (fetchError || !user) {
      return { error: "사용자를 찾을 수 없거나 포인트 조회에 실패했습니다." };
    }

    const currentPoints = user.points || 0;

    if (currentPoints < amount) {
      return { error: "보유 포인트가 부족합니다." };
    }

    const newPoints = currentPoints - amount;

    // 2. 포인트 업데이트
    const { error: updateError } = await supabase
      .from("b2b_signups")
      .update({ points: newPoints })
      .eq("username", username);

    if (updateError) {
      return { error: "포인트 차감 중 오류가 발생했습니다." };
    }

    return { success: true, points: newPoints };
  } catch (error) {
    console.error("deductPoints error:", error);
    return { error: "서버 오류가 발생했습니다." };
  }
}

export async function getTotalPointsAllUsers() {
  try {
    const { data, error } = await supabase
      .from("b2b_signups")
      .select("points");

    if (error) {
      console.error("Error fetching total points:", error);
      return { totalPoints: 0 };
    }

    const totalPoints = data.reduce((sum, user) => sum + (user.points || 0), 0);
    return { totalPoints };
  } catch (error) {
    console.error("getTotalPointsAllUsers error:", error);
    return { totalPoints: 0 };
  }
}
