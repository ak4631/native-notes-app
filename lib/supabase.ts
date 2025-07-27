// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'your-url'
const SUPABASE_ANON_KEY = 'your-anon_key'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
