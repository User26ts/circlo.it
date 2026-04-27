import supabase from '../lib/supabaseClient'

"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-[#050814] to-[#0b1f3a] text-white">

      <h1 className="text-5xl font-light mb-4 tracking-wide">
        Circlo
      </h1>

      <p className="text-gray-300 max-w-xl italic mb-10">
        Le persone si avvicinano prima dei nomi.<br />
        Qui vieni riconosciuto da ciò che scegli, non da ciò che mostri.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => router.push("/auth")}
          className="px-6 py-3 bg-blue-600 rounded-xl hover:scale-105 transition"
        >
          Accedi
        </button>

        <button
          onClick={() => router.push("/auth")}
          className="px-6 py-3 border border-white/30 rounded-xl hover:bg-white/10 transition"
        >
          Registrati (18+)
        </button>
      </div>

      <p className="mt-10 text-xs text-gray-500">
        progetto Circlo — early prototype
      </p>

    </main>
  );
}
