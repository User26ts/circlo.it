"use client";

import { useState } from "react";
import supabase from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Questions() {
  const router = useRouter();
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const music = ["Rock", "Pop", "Hip Hop", "Jazz", "Techno", "Indie", "Classica", "Reggaeton", "Metal", "Lo-fi"];
  const hobby = ["Cinema", "Sport", "Gaming", "Fotografia", "Viaggi", "Lettura", "Disegno", "Cucina", "Fitness", "Musica"];
  const food = ["Pizza", "Sushi", "Pasta", "Burger", "Tacos", "Dolci", "Vegano", "Piccante", "Street food", "Italiano"];
  const aesthetic = ["Dreamcore", "Brutalismo", "Minimal", "Dark academia", "Y2K", "Cyberpunk", "Vintage", "Cartoon", "Softcore", "Grunge"];

  const toggle = (category, value) => {
    setSelected((prev) => ({
      ...prev,
      [category]: prev[category] === value ? "" : value,
    }));
  };

  const saveAnswers = async () => {
    setLoading(true);
    setError("");

    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      setError("Errore: utente non autenticato");
      setLoading(false);
      return;
    }

    try {
      const entries = Object.entries(selected);
      for (let [category, value] of entries) {
        if (!value) continue; // Salta se niente selezionato
        const { error: insertError } = await supabase.from("answers").insert([
          { user_id: user.id, category, value },
        ]);
        if (insertError) throw insertError;
      }

      router.push("/"); // Poi cambierai con la pagina di matchmaking
    } catch (err) {
      setError("Errore durante il salvataggio: " + err.message);
    }

    setLoading(false);
  };

  const renderGroup = (title, items, category) => (
    <div className="mb-6">
      <h2 className="mb-2 text-lg">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item}
            onClick={() => toggle(category, item)}
            className={`px-3 py-1 rounded-full border text-sm transition ${
              selected[category] === item
                ? "bg-blue-600 border-blue-600"
                : "border-white/20"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#050814] text-white px-6 py-10 flex flex-col items-center">
      <h1 className="text-2xl mb-8 text-center font-light">Le tue affinità</h1>

      {renderGroup("Musica", music, "music")}
      {renderGroup("Hobby", hobby, "hobby")}
      {renderGroup("Cibo", food, "food")}
      {renderGroup("Estetica", aesthetic, "aesthetic")}

      {error && <p className="text-red-500 mt-3">{error}</p>}

      <button
        onClick={saveAnswers}
        disabled={loading}
        className="w-full mt-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition"
      >
        {loading ? "Salvataggio..." : "Continua"}
      </button>
    </main>
  );
}
