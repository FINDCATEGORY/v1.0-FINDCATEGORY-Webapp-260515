"use server";

import { supabase } from "@/lib/supabase";

export async function getPartners() {
  try {
    const { data, error } = await supabase
      .from("b2b_signups")
      .select("id, name, email, phone, company_name, department, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching partners:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("getPartners error:", error);
    return [];
  }
}
