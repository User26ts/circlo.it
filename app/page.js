"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login");
  const [message, setMessage] = useState("");

  // Creazione client ultra-sicura
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );

  const handleAuth = async (e) => {
    e.preventDefault(); // Questo è fondamentale per non far ricaricare la pagina
    setLoading(true);
    setMessage("Comunicazione con Circlo in corso...");

    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error("Le chiavi del database non sono state caricate su Vercel!");
      }

      let result;
      if (mode === "signup") {
        result = await supabase.auth.signUp({ email, password });
      } else {
        result = await supabase.auth.signInWithPassword({ email, password });
      }

      if (result.error) throw result.error;

      if (mode === "signup") {
        setMessage("Registrazione quasi completata! CONTROLLA LA MAIL (anche in SPAM) per confermare.");
      } else {
        router.push("/onboarding");
      }
    } catch (err) {
      console.error(err);
      setMessage("ERRORE: " + err.message); // Qui DEVE apparire l'errore a schermo
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#050814] text-white px-6">
      <div className="w-full max-w-md bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur">
        <h1 className="text-3xl mb-6 text-center font-light">
          {mode === "login" ? "Entra in Circlo" : "Unisciti a Circlo"}
        </h1>

        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-black/40 border border-white/10 text-white"
          />
          <input
            type="password"
            placeholder="Password (min. 6 caratteri)"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-black/40 border border-white/10 text-white"
          />

          {message && (
            <div className="p-3 rounded text-center text-sm border bg-blue-500/10 border-blue-500 text-blue-200">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 font-medium"
          >
            {loading ? "Elaborazione..." : mode === "login" ? "Accedi" : "Crea Account"}
          </button>
        </form>

        <p
          className="mt-6 text-center text-gray-400 cursor-pointer hover:text-white transition text-sm"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
        >
          {mode === "login" ? "Non hai un account? Registrati qui" : "Hai già un profilo? Accedi"}
        </p>
      </div>
    </main>
  );
}
