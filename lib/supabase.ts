import { createClient } from '@supabase/supabase-js'

let rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
// Vercel 환경변수 입력 시 실수로 들어간 따옴표, 공백 제거 및 https:// 보정
rawUrl = rawUrl.replace(/^["']|["']$/g, '').trim()
if (rawUrl && !rawUrl.startsWith('http') && rawUrl !== 'undefined') {
  rawUrl = 'https://' + rawUrl
}
const supabaseUrl = rawUrl.startsWith('http') ? rawUrl : 'https://placeholder.supabase.co'

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)