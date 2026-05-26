import { createClient } from '@supabase/supabase-js';

// Gunakan VITE_ jika menggunakan Vite, atau NEXT_PUBLIC_ jika menggunakan Next.js
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);