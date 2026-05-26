import { createClient } from '@supabase/supabase-js'

// Supabase 대시보드 -> Settings -> API에서 확인 가능
const supabaseUrl = 'https://findcategory.co.kr'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJseml2ZWRzaXVnZGtlbmtvbWxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyODA4MDUsImV4cCI6MjA5NDg1NjgwNX0.iPWsTIB3eIr_TzmwdQkpaqFMjQKK9OvcWQTEIiphob0'

export const supabase = createClient(supabaseUrl, supabaseKey)
