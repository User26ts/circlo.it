import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Se le chiavi mancano, il client non viene creato e i bottoni muoiono
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("ATTENZIONE: Chiavi Supabase mancanti in Vercel!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
