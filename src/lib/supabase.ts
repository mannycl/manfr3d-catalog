import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.PUBLIC_SUPABASE_URL;
const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = url && key ? createClient(url, key) : null;

export function getSupabase() {
  if (!supabase) {
    throw new Error('Faltan PUBLIC_SUPABASE_URL o PUBLIC_SUPABASE_ANON_KEY en .env');
  }
  return supabase;
}
