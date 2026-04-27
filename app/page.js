"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// --- CONFIGURAZIONE DIRETTA (Sostituisci i valori tra virgolette) ---
const SUPABASE_URL = "INCOLLA_QUI_IL_TUO_URL_SUPABASE";
const SUPABASE_ANON_KEY = "INCOLLA_QUI_LA_TUA_ANON_KEY";
// ------------------------------------------------------------------

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login");
  const [message, setMessage] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("Tentativo di connessione...");

    try {
      let result;
      if (mode === "signup") {
        result = await supabase.auth.signUp({ 
          email, 
          password,
          options: { emailRedirectTo: window.location.origin + '/onboarding' }
        });
      } else {
        result = await supabase.auth.signInWithPassword({ email, password });
      }

      if (result.error) throw result.error;

      if (mode === "signup") {
        setMessage("Registrazione inviata! Controlla la mail (anche SPAM) per confermare.");
      } else if (result.data?.user) {
        setMessage("Accesso eseguito! Reindirizzamento...");
        router.push("/onboarding");
      }
    } catch (err) {
      console.error("Errore rilevato:", err);
      setMessage("ERRORE: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#050814] text-white px-6">
      <div className="w-full max-w-md bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur shadow-2xl">
        <h1 className="text-3xl mb-6 text-center font-light tracking-tight">
          {mode === "login" ? "Accedi a Circlo" : "Crea Account"}
        </h1>

        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="La tua email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-black/40 border border-white/10 text-white focus:border-blue-500 outline-none transition"
          />

          <input
            type="password"
            placeholder="Password (min. 6 caratteri)"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-black/40 border border-white/10 text-white focus:border-blue-500 outline-none transition"
          />

          {message && (
            <div className={`p-3 rounded text-center text-sm border ${
              message.includes("ERRORE") 
                ? "bg-red-500/10 border-red-500/50 text-red-200" 
                : "bg-blue-500/10 border-blue-500/50 text-blue-200"
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 font-semibold shadow-lg shadow-blue-600/20"
          >
            {loading ? "Sincronizzazione..." : mode === "login" ? "Entra" : "Registrati ora"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p
            className="text-sm text-gray-400 cursor-pointer hover:text-white transition inline-block"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setMessage("");
            }}
          >
            {mode === "login" 
              ? "Non hai un account? Clicca qui per registrarti" 
              : "Hai già un profilo? Torna al login"}
          </p>
        </div>
      </div>
    </main>
  );
}
