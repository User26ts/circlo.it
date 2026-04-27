"use client";

import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // funzione affinità
  const calculateAffinity = (userA, userB) => {
    let score = 0;
    let total = 4;

    userA.forEach((a) => {
      const match = userB.find(
        (b) => b.category === a.category && b.value === a.value
      );

      if (match) score++;
    });

    return Math.round((score / total) * 100);
  };

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);

      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) return;

      // prendi tutte le risposte
      const { data } = await supabase.from("answers").select("*");

      // raggruppa per utenti
      const grouped = {};

      data.forEach((row) => {
        if (!grouped[row.user_id]) grouped[row.user_id] = [];
        grouped[row.user_id].push(row);
      });

      const myAnswers = grouped[user.id] || [];

      // confronta con altri utenti
      const results = [];

      Object.keys(grouped).forEach((uid) => {
        if (uid === user.id) return;

        const otherAnswers = grouped[uid];

        const affinity = calculateAffinity(myAnswers, otherAnswers);

        results.push({
          user_id: uid,
          affinity,
        });
      });

      // ordina per affinità
      results.sort((a, b) => b.affinity - a.affinity);

      setMatches(results);
      setLoading(false);
    };

    fetchMatches();
  }, []);

  return (
    <main className="min-h-screen bg-[#050814] text-white px-6 py-10">

      <h1 className="text-2xl mb-6 text-center font-light">
        Persone compatibili
      </h1>

      {loading && (
        <p className="text-center text-gray-400">
          Calcolo affinità...
        </p>
      )}

      {!loading && matches.length === 0 && (
        <p className="text-center text-gray-400">
          Nessun match ancora.
        </p>
      )}

      <div className="space-y-3">
        {matches.map((m, i) => (
          <div
            key={i}
            className="p-4 bg-white/5 rounded-xl border border-white/10"
          >
            <p>Utente anonimo</p>
            <p className="text-blue-400">
              Affinità: {m.affinity}%
            </p>
          </div>
        ))}
      </div>

    </main>
  );
}
