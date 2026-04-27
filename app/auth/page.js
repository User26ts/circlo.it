
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../lib/supabaseClient";

export default function AuthPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");

  const handleAuth = async () => {
    console.log("CLICK FUNZIONA");

    setLoading(true);
    setError("");

    try {
      let res;

      if (mode === "signup") {
        res = await supabase.auth.signUp({
          email,
          password,
        });
      } else {
        res = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      }

      console.log("AUTH RESPONSE:", res);

      if (res.error) {
        setError(res.error.message);
        return;
      }

      router.push("/onboarding");
    } catch (err) {
      console.error(err);
      setError(err.message || "Errore sconosciuto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#050814] text-white px-6">

      <div className="w-full max-w-md bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur">

        <h1 className="text-3xl mb-6 text-center font-light">
          {mode === "login" ? "Accedi a Circlo" : "Crea il tuo profilo"}
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-3 rounded bg-black/40 border border-white/10"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-3 rounded bg-black/40 border border-white/10"
        />

        {error && (
          <p className="text-red-400 text-sm mb-3">{error}</p>
        )}

        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full bg-blue-600 py-3 rounded-xl hover:scale-[1.02] transition mb-4"
        >
          {loading
            ? "Caricamento..."
            : mode === "login"
              ? "Accedi"
              : "Registrati"}
        </button>

        <p
          className="text-sm text-center text-gray-400 cursor-pointer"
          onClick={() =>
            setMode(mode === "login" ? "signup" : "login")
          }
        >
          {mode === "login"
            ? "Non hai un account? Registrati"
            : "Hai già un account? Accedi"}
        </p>

      </div>
    </main>
  );
}
