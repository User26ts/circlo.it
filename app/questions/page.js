"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const music = ["Pop","Rock","Hip Hop","Techno","Jazz","Indie","Metal","Classical"];
const hobbies = ["Sport","Gaming","Cucina","Fotografia","Viaggi","Arte","Lettura","Fitness"];

export default function Questions() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-[#050814] text-white">

      <div className="bg-white/5 p-8 rounded-2xl w-full max-w-xl">

        {step === 0 && (
          <>
            <h2 className="mb-4">Musica</h2>

            <div className="grid grid-cols-2 gap-2">
              {music.map((m) => (
                <button key={m} className="p-2 bg-black/40 rounded hover:bg-white/10">
                  {m}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(1)}
              className="mt-6 w-full bg-blue-600 py-3 rounded"
            >
              Continua
            </button>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="mb-4">Hobby</h2>

            <div className="grid grid-cols-2 gap-2">
              {hobbies.map((h) => (
                <button key={h} className="p-2 bg-black/40 rounded hover:bg-white/10">
                  {h}
                </button>
              ))}
            </div>

            <button
              onClick={() => router.push("/done")}
              className="mt-6 w-full bg-blue-600 py-3 rounded"
            >
              Completa profilo
            </button>
          </>
        )}

      </div>

    </main>
  );
}
