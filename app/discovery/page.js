"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

export default function Discovery() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function findPeople() {
      const { data: { user } } = await supabase.auth.getUser();
      
      // 1. Prendo il mio profilo per sapere la mia provincia
      const { data: me } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      const myInterests = me.affinity_data?.interests || [];

      // 2. Cerco altri nella STESSA PROVINCIA
      const { data: others } = await supabase.from('profiles')
        .select('*')
        .eq('city', me.city)
        .neq('id', user.id);

      // 3. Algoritmo di affinità (Ranking)
      const scored = others.map(person => {
        const tags = person.affinity_data?.interests || [];
        const common = myInterests.filter(t => tags.includes(t));
        return { ...person, score: common.length, common };
      })
      .filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score);

      setMatches(scored);
      setLoading(false);
    }
    findPeople();
  }, []);

  const startChat = async (otherId) => {
    const { data: { user } } = await supabase.auth.getUser();
    // Crea o trova stanza
    const { data: room } = await supabase.from('chat_rooms')
      .insert([{ user_1: user.id, user_2: otherId }])
      .select().single();
    router.push(`/chat/${room.id}`);
  };

  return (
    <div style={{padding: '20px'}}>
      <h1>Anime Affini a {matches[0]?.city || "tua città"}</h1>
      {matches.map(p => (
        <div key={p.id} style={styles.matchCard}>
          <h3>Utente Anonimo</h3>
          <p>Avete {p.score} interessi in comune: {p.common.join(", ")}</p>
          <button onClick={() => startChat(p.id)}>Chatta</button>
        </div>
      ))}
    </div>
  );
}
const styles = { matchCard: { border: '1px solid #ccc', padding: '15px', marginBottom: '10px', borderRadius: '10px' } };
