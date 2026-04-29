"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

export default function Discovery() {
  const [matches, setMatches] = useState([]);
  const [myCity, setMyCity] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function getMatches() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Recupero il mio profilo (interessi e provincia)
      const { data: me } = await supabase
        .from('profiles')
        .select('city, affinity_data')
        .eq('id', user.id)
        .single();
      
      if (!me) return;
      setMyCity(me.city);
      const myInterests = me.affinity_data?.interests || [];

      // 2. Cerco ALTRE persone della STESSA provincia
      const { data: others } = await supabase
        .from('profiles')
        .select('*')
        .eq('city', me.city)
        .neq('id', user.id);

      // 3. Algoritmo di Affinità
      const rankedMatches = others.map(other => {
        const otherInterests = other.affinity_data?.interests || [];
        const common = myInterests.filter(tag => otherInterests.includes(tag));
        
        return {
          ...other,
          score: common.length,
          common: common
        };
      })
      .filter(m => m.score > 0) // Mostro solo chi ha almeno una passione in comune
      .sort((a, b) => b.score - a.score); // Dal più affine al meno affine

      setMatches(rankedMatches);
      setLoading(false);
    }

    getMatches();
  }, []);

  const startChat = async (targetUserId) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Controlla se esiste già una stanza
    const { data: existing } = await supabase
      .from('chat_rooms')
      .select('id')
      .or(`and(user_1.eq.${user.id},user_2.eq.${targetUserId}),and(user_1.eq.${targetUserId},user_2.eq.${user.id})`)
      .maybeSingle();

    if (existing) {
      router.push(`/chat/${existing.id}`);
      return;
    }

    // Altrimenti creala
    const { data: newRoom } = await supabase
      .from('chat_rooms')
      .insert([{ user_1: user.id, user_2: targetUserId }])
      .select().single();

    if (newRoom) router.push(`/chat/${newRoom.id}`);
  };

  if (loading) return (
    <div style={styles.center}>
      <div style={styles.spinner}></div>
      <p>Cercando anime affini a {myCity}...</p>
    </div>
  );

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Esplora {myCity}</h1>
        <p style={styles.subtitle}>Ecco le persone più compatibili con il tuo DNA</p>
      </header>

      <div style={styles.list}>
        {matches.length > 0 ? (
          matches.map(person => (
            <div key={person.id} style={styles.card}>
              <div style={styles.cardInfo}>
                <div style={styles.avatar}>?</div>
                <div style={styles.textData}>
                  <h3 style={styles.anonName}>Utente Compatibile</h3>
                  <span style={styles.badge}>{person.score} passioni in comune</span>
                </div>
              </div>
              
              <div style={styles.tags}>
                {person.common.slice(0, 5).map(t => (
                  <span key={t} style={styles.tag}>#{t}</span>
                ))}
                {person.common.length > 5 && <span style={styles.tag}>+{person.common.length - 5}</span>}
              </div>

              <button onClick={() => startChat(person.id)} style={styles.chatBtn}>
                Inizia conversazione anonima
              </button>
            </div>
          ))
        ) : (
          <div style={styles.noMatches}>
            <p>Non abbiamo ancora trovato match perfetti a {myCity}.</p>
            <button onClick={() => router.push('/onboarding')} style={styles.secondaryBtn}>
              Aggiungi altri interessi
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

const styles = {
  container: { maxWidth: '500px', margin: '0 auto', padding: '20px', fontFamily: '"Segoe UI", Roboto, sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh' },
  header: { marginBottom: '30px', textAlign: 'center' },
  title: { fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: '0' },
  subtitle: { fontSize: '14px', color: '#6b7280', marginTop: '5px' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: { backgroundColor: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #f3f4f6' },
  cardInfo: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' },
  avatar: { width: '50px', height: '50px', borderRadius: '25px', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '20px', color: '#9ca3af' },
  textData: { display: 'flex', flexDirection: 'column' },
  anonName: { margin: '0', fontSize: '18px', fontWeight: '600', color: '#111827' },
  badge: { fontSize: '12px', color: '#059669', fontWeight: 'bold', backgroundColor: '#ecfdf5', padding: '2px 8px', borderRadius: '10px', width: 'fit-content', marginTop: '4px' },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' },
  tag: { fontSize: '12px', backgroundColor: '#eff6ff', color: '#2563eb', padding: '4px 10px', borderRadius: '6px', fontWeight: '500' },
  chatBtn: { width: '100%', padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' },
  center: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', color: '#6b7280' },
  noMatches: { textAlign: 'center', padding: '40px', color: '#6b7280' },
  secondaryBtn: { marginTop: '10px', background: 'none', border: '1px solid #d1d5db', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' },
  spinner: { width: '40px', height: '40px', border: '4px solid #f3f4f6', borderTop: '4px solid #2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' }
};
