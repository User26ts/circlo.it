"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../src/lib/supabaseClient";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login");
  const [message, setMessage] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault(); // Impedisce alla pagina di ricaricarsi
    setLoading(true);
    setMessage("");

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Registrazione riuscita! Controlla la tua email per confermare.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/onboarding"); // Ti manda avanti se il login è ok
      }
    } catch (err) {
      setMessage(err.message);
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
            <p className="text-red-400 text-sm bg-red-400/10 p-2 rounded text-center">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Caricamento..." : mode === "login" ? "Accedi" : "Registrati"}
          </button>
        </form>

        <p
          className="mt-6 text-sm text-center text-gray-400 cursor-pointer hover:text-white transition"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
        >
          {mode === "login" ? "Non hai un account? Registrati" : "Hai già un account? Accedi"}
        </p>
      </div>
    </main>
  );
}
