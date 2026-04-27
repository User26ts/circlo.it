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

      const { error } = await supabase.from("profiles").insert([
        {
          id: user.id,
          name,
          surname,
          gender,
          age: parseInt(age),
          location,
        },
      ]);

      if (error) throw error;

      router.push("/questions");

    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-[#050814] text-white">

      <div className="bg-white/5 p-8 rounded-2xl w-full max-w-md">

        <h2 className="text-xl mb-6">Dati base</h2>

        <input
          className="w-full p-3 mb-3 bg-black/40 rounded"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full p-3 mb-3 bg-black/40 rounded"
          placeholder="Cognome"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
        />

        <select
          className="w-full p-3 mb-3 bg-black/40 rounded"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Sesso</option>
          <option value="male">Maschio</option>
          <option value="female">Femmina</option>
          <option value="other">Altro</option>
        </select>

        <input
          className="w-full p-3 mb-3 bg-black/40 rounded"
          placeholder="Età"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <input
          className="w-full p-3 mb-3 bg-black/40 rounded"
          placeholder="Città"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        {error && (
          <p className="text-red-400 text-sm mb-3">{error}</p>
        )}

        <button
          onClick={saveProfile}
          disabled={loading}
          className="w-full py-3 bg-blue-600 rounded"
        >
          {loading ? "Salvataggio..." : "Continua"}
        </button>

      </div>

    </main>
  );
}
