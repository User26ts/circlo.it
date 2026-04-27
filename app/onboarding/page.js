"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../lib/supabaseClient";

export default function Onboarding() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const saveProfile = async () => {
    setLoading(true);
    setError("");

    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) throw new Error("Utente non autenticato");

      if (!name || !surname || !gender || !age || !location) {
        throw new Error("Compila tutti i campi");
      }

      const { error } = await supabase.from("profiles").insert([
        {
          id: user.id,
          name,
          surname,
          gender,
          age: Number(age),
          location,
        },
      ]);

      if (error) throw error;

      router.push("/questions"); // vai alla pagina delle domande

    } catch (err) {
      setError(err.message || "Errore sconosciuto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-[#050814] text-white">
      <div className="w-full max-w-md bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur">
        <h2 className="text-xl mb-6 text-center font-light">Dati base</h2>

        <input
          className="w-full mb-3 p-3 rounded bg-black/40 border border-white/10"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full mb-3 p-3 rounded bg-black/40 border border-white/10"
          placeholder="Cognome"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
        />

        <select
          className="w-full mb-3 p-3 rounded bg-black/40 border border-white/10"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Sesso</option>
          <option value="male">Maschio</option>
          <option value="female">Femmina</option>
          <option value="other">Altro</option>
        </select>

        <input
          className="w-full mb-3 p-3 rounded bg-black/40 border border-white/10"
          type="number"
          placeholder="Età"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <input
          className="w-full mb-3 p-3 rounded bg-black/40 border border-white/10"
          placeholder="Città"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <button
          onClick={saveProfile}
          disabled={loading}
          className="w-full py-3 bg-blue-600 rounded-xl hover:scale-[1.02] transition"
        >
          {loading ? "Salvataggio..." : "Continua"}
        </button>
      </div>
    </main>
  );
}
