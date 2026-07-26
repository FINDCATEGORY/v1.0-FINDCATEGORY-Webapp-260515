"use server";

import { supabase } from "@/lib/supabase";

export async function getDashboardMetrics() {
  try {
    // 1. 멤버십 수 가져오기
    const { count: membershipCount, error: countError } = await supabase
      .from("b2b_signups")
      .select("*", { count: 'exact', head: true });

    if (countError) {
      console.error("Error fetching membership count:", countError);
    }

    // 2. 누적 계약 금액 (임시)
    let totalRevenue = 0;

    return {
      membershipCount: membershipCount || 0,
      totalRevenue,
      // 현재 주문과 문의 테이블은 존재하지 않으므로 0으로 반환 (향후 DB 연결 시 연동 필요)
      orderCount: 0,
      inquiryCount: 0,
    };
  } catch (error) {
    console.error("getDashboardMetrics error:", error);
    return {
      membershipCount: 0,
      totalRevenue: 0,
      orderCount: 0,
      inquiryCount: 0,
    };
  }
}
