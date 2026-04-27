import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Se vedi questo errore nella console (F12), significa che Vercel non sta leggendo le chiavi
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("ERRORE: Chiavi Supabase non trovate! Controlla le Environment Variables su Vercel.");
}

export const supabase = createClient(
  supabaseUrl || "", 
  supabaseAnonKey || ""
);

export default supabase;
