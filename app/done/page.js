"use client";
import { useRouter } from "next/navigation";

export default function Done() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-[#050814] text-white">

      <h1 className="text-3xl mb-4">Profilo creato</h1>

      <p className="text-gray-400 max-w-md">
        Le connessioni verranno generate in base alle affinità.
      </p>

      <button
        onClick={() => router.push("/")}
        className="mt-6 px-6 py-3 bg-blue-600 rounded"
      >
        Torna alla home
      </button>

    </main>
  );
}
