// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://pxrnuuzrtpikwltfprtc.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4cm51dXpydHBpa3dsdGZwcnRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NDA0NjAsImV4cCI6MjA2NTExNjQ2MH0.0Onvh5pi-Lu9v2Ktorf9GFOTqy1PFAe5Ul6ZH8GyPxA'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
