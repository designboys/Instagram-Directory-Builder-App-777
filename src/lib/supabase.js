import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://dceydxdfhdljoyblmmug.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjZXlkeGRmaGRsam95YmxtbXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MzMyODUsImV4cCI6MjA2NzAwOTI4NX0.L3za09W2Osv3eWmTg6Djsxw9EP3f08WNm-cUmWaKa44'

if(SUPABASE_URL == 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY == '<ANON_KEY>') {
  throw new Error('Missing Supabase variables');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

export default supabase