import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  const data = {
    username: "testuser_" + Date.now(),
    password: "testpassword",
    name: "Test Name",
    email: "test@example.com",
    phone: "010-1234-5678",
    company_name: "Test Co",
    department: "Test Dept",
  };
  const { error } = await supabase.from('b2b_signups').insert([data]);
  console.log("Error:", error);
}
test();
