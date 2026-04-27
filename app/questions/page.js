"use client";

import { useState } from "react";
import supabase from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Questions() {
  const router = useRouter();

  const music = ["Rock", "Pop", "Hip Hop", "Jazz", "Techno", "Indie", "Classica", "Reggaeton", "Metal", "Lo-fi"];
  const hobby = ["Cinema", "Sport", "Gaming", "Fotografia", "Viaggi", "Lettura", "Disegno", "Cucina", "Fitness", "Musica"];
  const food = ["Pizza", "Sushi", "Pasta", "Burger", "Tacos", "Dolci", "Vegano", "Piccante", "Street food", "Italiano"];
  const aesthetic = ["Dreamcore", "Brutalismo", "Minimal", "Dark academia", "Y2K", "Cyberpunk", "Vintage", "Cartoon", "Softcore", "Grunge"];

  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggle = (category, value) => {
    setSelected((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const saveAnswers = async () => {
    setLoading(true);
    setError("");

    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) {
        throw new Error("Utente non autenticato");
      }

      const entries = Object.entries(selected);

      if (entries.length === 0) {
        throw new Error("Seleziona almeno un'opzione");
      }

      // salva tutte le risposte
      for (let [category, value] of entries) {
        await supabase.from("answers").insert([
          {
            user_id: user.id,
            category,
            value,
          },
        ]);
      }

      // reset stato (pulito)
      setSelected({});

      // vai avanti
      router.push("/matches");

    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  const renderGroup = (title, items, category) => (
    <div className="mb-6">
      <h2 className="mb-2 text-lg font-light">{title}</h2>

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
    <main className="min-h-screen bg-[#050814] text-white px-6 py-10">

      <h1 className="text-2xl mb-8 text-center font-light">
        Le tue affinità
      </h1>

      {renderGroup("Musica", music, "music")}
      {renderGroup("Hobby", hobby, "hobby")}
      {renderGroup("Cibo", food, "food")}
      {renderGroup("Estetica", aesthetic, "aesthetic")}

      {error && (
        <p className="text-red-400 text-sm text-center mb-3">
          {error}
        </p>
      )}

      <button
        onClick={saveAnswers}
        disabled={loading}
        className="w-full mt-6 py-3 bg-blue-600 rounded-xl"
      >
        {loading ? "Salvataggio..." : "Continua"}
      </button>

    </main>
  );
}
