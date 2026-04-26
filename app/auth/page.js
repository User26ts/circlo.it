"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Auth() {
  const router = useRouter();
  const [mode, setMode] = useState("login");

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-[#050814] text-white">

      <div className="bg-white/5 p-8 rounded-2xl w-full max-w-md backdrop-blur">

        <h2 className="text-2xl mb-6 text-center">
          {mode === "login" ? "Accedi" : "Registrati"}
        </h2>

        <input className="w-full p-3 mb-3 rounded bg-black/40" placeholder="Email" />
        <input className="w-full p-3 mb-3 rounded bg-black/40" placeholder="Password" type="password" />

        <button
          onClick={() => router.push("/onboarding")}
          className="w-full py-3 bg-blue-600 rounded mt-2"
        >
          Continua
        </button>

        <p
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="text-xs text-center mt-4 text-gray-400 cursor-pointer"
        >
          {mode === "login"
            ? "Non hai un account? Registrati"
            : "Hai già un account? Accedi"}
        </p>

      </div>

    </main>
  );
}
