"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// --- INSERISCI QUI I TUOI DATI REALI ---
const URL_DIRETTO = "INCOLLA_QUI_IL_TUO_URL_SUPABASE";
const KEY_DIRETTA = "INCOLLA_QUI_LA_TUA_ANON_KEY";
// --------------------------------------

const supabase = createClient(URL_DIRETTO, KEY_DIRETTA);

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login");
  const [message, setMessage] = useState("");

  // Verifica se il file è caricato correttamente
  useEffect(() => {
    console.log("Pagina Auth Caricata. Client Supabase inizializzato.");
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("Comunicazione in corso...");
    console.log("Tentativo di:", mode, "per email:", email);

    try {
      let result;
      if (mode === "signup") {
        result = await supabase.auth.signUp({ 
          email, 
          password,
          options: { emailRedirectTo: window.location.origin }
        });
      } else {
        result = await supabase.auth.signInWithPassword({ email, password });
      }

      const { data, error } = result;

      if (error) {
        console.error("Errore Supabase:", error.message);
        throw error;
      }

      console.log("Operazione riuscita:", data);

      if (mode === "signup") {
        setMessage("Registrazione OK! Controlla la mail (anche SPAM).");
      } else {
        setMessage("Accesso eseguito! Reindirizzamento...");
        router.push("/onboarding");
      }
    } catch (err) {
      setMessage("ERRORE: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#050814] text-white px-6">
      <div className="w-full max-w-md bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur shadow-2xl">
        
        {/* TITOLO DI TEST PER VERIFICA DEPLOY */}
        <h1 className="text-2xl mb-2 text-center font-bold text-blue-500">
          CIRCLO - TEST CONNESSIONE
        </h1>
        <p className="text-xs text-center text-gray-500 mb-6 uppercase tracking-widest">
          Versione con chiavi integrate
        </p>

        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-black/40 border border-white/10 text-white outline-none focus:border-blue-500"
          />

          <input
            type="password"
            placeholder="Password (min. 6 caratteri)"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-black/40 border border-white/10 text-white outline-none focus:border-blue-500"
          />

          {message && (
            <div className={`p-3 rounded text-sm text-center border ${
              message.includes("ERRORE") 
                ? "bg-red-500/10 border-red-500/50 text-red-400" 
                : "bg-blue-500/10 border-blue-500/50 text-blue-400"
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 font-bold"
          >
            {loading ? "Sincronizzazione..." : mode === "login" ? "Accedi" : "Registrati ora"}
          </button>
        </form>

        <p
          className="mt-6 text-sm text-center text-gray-400 cursor-pointer hover:text-white transition"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setMessage("");
          }}
        >
          {mode === "login" ? "Non hai un account? Clicca qui" : "Hai già un account? Torna al login"}
        </p>
      </div>
    </main>
  );
}
