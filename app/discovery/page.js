"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

export default function Discovery() {
  const [matches, setMatches] = useState([]);
  const [myInterests, setMyInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function getMatches() {
      // 1. Prendi l'utente loggato
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 2. Prendi i miei interessi
      const { data: myProfile } = await supabase
        .from('profiles')
        .select('affinity_data')
        .eq('id', user.id)
        .single();
      
      const myTags = myProfile?.affinity_data?.interests || [];
      setMyInterests(myTags);

      // 3. Prendi TUTTI gli altri utenti (escluso te stesso)
      const { data: otherUsers } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id);

      // 4. ALGORITMO DI AFFINITÀ
      const rankedMatches = otherUsers.map(other => {
        const otherTags = other.affinity_data?.interests || [];
        // Trova l'intersezione (quelli che hanno entrambi)
        const commonTags = myTags.filter(tag => otherTags.includes(tag));
        
        return {
          ...other,
          score: commonTags.length, // Il punteggio è il numero di passioni comuni
          common: commonTags
        };
      })
      .filter(m => m.score > 0) // Mostra solo chi ha almeno 1 cosa in comune
      .sort((a, b) => b.score - a.score); // Ordina dal più simile al meno simile

      setMatches(rankedMatches);
      setLoading(false);
    }

    getMatches();
  }, []);

const startChat = async (targetUserId) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // 1. Controlla se esiste già una stanza tra i due
  const { data: existingRooms } = await supabase
    .from('chat_rooms')
    .select('id')
    .or(`and(user_1.eq.${user.id},user_2.eq.${targetUserId}),and(user_1.eq.${targetUserId},user_2.eq.${user.id})`)
    .maybeSingle();

  if (existingRooms) {
    router.push(`/chat/${existingRooms.id}`);
    return;
  }

  // 2. Se non esiste, creala
  const { data: newRoom, error } = await supabase
    .from('chat_rooms')
    .insert([
      { user_1: user.id, user_2: targetUserId }
    ])
    .select()
    .single();

  if (newRoom) {
    router.push(`/chat/${newRoom.id}`);
  } else {
    alert("Errore nella creazione della chat");
  }
};

  if (loading) return <div style={styles.loader}>Cercando anime affini...</div>;

  return (
    <main style={styles.main}>
      <h2 style={styles.title}>Persone compatibili con te</h2>
      <p style={styles.subtitle}>Basato su {myInterests.length} tue passioni</p>

      <div style={styles.list}>
        {matches.map(person => (
          <div key={person.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.name}>Utente Anonimo</span>
              <span style={styles.scoreBadge}>{person.score} passioni in comune</span>
            </div>
            
            <div style={styles.tagsContainer}>
              {person.common.map(t => (
                <span key={t} style={styles.tag}>#{t}</span>
              ))}
            </div>

            <button onClick={() => startChat(person.id)} style={styles.chatBtn}>
              Invia Messaggio Anonimo
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

const styles = {
  main: { padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' },
  title: { textAlign: 'center', color: '#1e293b' },
  subtitle: { textAlign: 'center', color: '#64748b', marginBottom: '30px' },
  card: { background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  name: { fontWeight: 'bold', fontSize: '18px' },
  scoreBadge: { background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  tagsContainer: { display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '15px' },
  tag: { fontSize: '12px', color: '#3b82f6', background: '#eff6ff', padding: '2px 8px', borderRadius: '4px' },
  chatBtn: { width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: '#3b82f6', color: 'white', fontWeight: 'bold', cursor: 'pointer' },
  loader: { textAlign: 'center', marginTop: '50px', color: '#64748b' }
};
