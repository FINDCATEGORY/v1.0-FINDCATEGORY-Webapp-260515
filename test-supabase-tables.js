require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, { auth: { persistSession: false } });

async function checkTables() {
  const { data: users, error: uError } = await supabase.from('b2b_signups').select('points');
  console.log('Users points:', users, 'Error:', uError);
}

checkTables();
