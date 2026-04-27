"use client";

import { useState } from "react";
import supabase from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Questions() {
  const router = useRouter();

  // Liste di domande
  const music = ["Rock", "Pop", "Hip Hop", "Jazz", "Techno", "Indie", "Classica", "Reggaeton", "Metal", "Lo-fi"];
  const hobby = ["Cinema", "Sport", "Gaming", "Fotografia", "Viaggi", "Lettura", "Disegno", "Cucina", "Fitness", "Musica"];
  const food = ["Pizza", "Sushi", "Pasta", "Burger", "Tacos", "Dolci", "Vegano", "Piccante", "Street food", "Italiano"];
  const aesthetic = ["Dreamcore", "Brutalismo", "Minimal", "Dark academia", "Y2K", "Cyberpunk", "Vintage", "Cartoon", "Softcore", "Grunge"];

  // Stato delle selezioni
  const [selected, setSelected] = useState({
    music: null,
    hobby: null,
    food: null,
    aesthetic: null,
  });

  const [loading, setLoading] = useState(false);

  // Funzione per selezionare un'opzione
  const toggle = (category, value) => {
    setSelected(prev => ({ ...prev, [category]: value }));
  };

  // Salva risposte nel database
  const saveAnswers = async () => {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return alert("Utente non trovato!");

    for (const [category, value] of Object.entries(selected)) {
      if (value) {
        await supabase.from("answers").insert([{ user_id: user.id, category, value }]);
      }
    }

    setLoading(false);
    router.push("/"); // Qui poi metti matchmaking
  };

  // Genera il gruppo di bottoni per una categoria
  const renderGroup = (title, items, category) => (
    <div className="mb-6">
      <h2 className="mb-2 text-lg font-semibold">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <button
            key={item}
            onClick={() => toggle(category, item)}
            className={`px-3 py-1 rounded-full border text-sm transition 
              ${selected[category] === item ? "bg-blue-600 border-blue-600" : "border-white/30"}`}
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

      <button
        onClick={saveAnswers}
        disabled={loading}
        className="w-full max-w-md mt-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition"
      >
        {loading ? "Salvataggio..." : "Continua"}
      </button>
    </main>
  );
}
