"use client";
import { useRouter } from "next/navigation";

export default function Onboarding() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-[#050814] text-white">

      <div className="bg-white/5 p-8 rounded-2xl w-full max-w-md">

        <h2 className="text-xl mb-6">Dati base</h2>

        <input className="w-full p-3 mb-3 bg-black/40 rounded" placeholder="Nome" />
        <input className="w-full p-3 mb-3 bg-black/40 rounded" placeholder="Cognome" />

        <select className="w-full p-3 mb-3 bg-black/40 rounded">
          <option>Sesso</option>
          <option>Maschio</option>
          <option>Femmina</option>
          <option>Altro</option>
        </select>

        <input className="w-full p-3 mb-3 bg-black/40 rounded" placeholder="Età" />
        <input className="w-full p-3 mb-3 bg-black/40 rounded" placeholder="Città" />

        <button
          onClick={() => router.push("/questions")}
          className="w-full py-3 bg-blue-600 rounded"
        >
          Continua
        </button>

      </div>

    </main>
  );
}
