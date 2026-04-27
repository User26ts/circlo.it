"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login");
  const [message, setMessage] = useState("");

  // Creazione interna per evitare errori di importazione
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("Sincronizzazione con il database...");

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage("Registrazione inviata! Controlla la tua email.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/onboarding");
      }
    } catch (err) {
      setMessage("Errore: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#050814] text-white px-6">
      <div className="w-full max-w-md bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur">
        <h1 className="text-3xl mb-6 text-center font-light">
          {mode === "login" ? "Accedi" : "Registrati"}
        </h1>

        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-black/40 border border-white/10"
          />
          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-black/40 border border-white/10"
          />
          
          {message && (
            <p className="text-sm bg-blue-500/20 p-3 rounded text-center border border-blue-500/50">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Attendi..." : mode === "login" ? "Entra" : "Crea Account"}
          </button>
        </form>

        <p
          className="mt-6 text-center text-gray-400 cursor-pointer underline"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
        >
          {mode === "login" ? "Passa a Registrazione" : "Passa a Login"}
        </p>
      </div>
    </main>
  );
}
