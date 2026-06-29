import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ctrfvafwfsqppxdvdjav.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0cmZ2YWZ3ZnNxcHB4ZHZkamF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2ODU4OTgsImV4cCI6MjA5ODI2MTg5OH0.stxYzuWvyMH7bOgkVP1L5380adtwEqaUnLVzDYQMKKQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
