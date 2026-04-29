"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

export default function Discovery() {
  const [matches, setMatches] = useState([]);
  const [myCity, setMyCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  // Funzione antiproiettile per calcolare l'età (gestisce valori vuoti o date non valide)
  const calculateAge = (dateString) => {
    if (!dateString) return "Età N.D.";
    
    const birthDate = new Date(dateString);
    if (isNaN(birthDate.getTime())) return "Età N.D."; // Se la data salvata è corrotta

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    async function getMatches() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push("/");
          return;
        }

        // 1. Prendo i miei dati
        const { data: me, error: meError } = await supabase
          .from('profiles')
          .select('city, affinity_data')
          .eq('id', session.user.id)
          .single();

        if (meError) throw new Error("Profilo non trovato. Completa l'onboarding.");
        if (!me.city) {
          router.push("/onboarding");
          return;
        }

        setMyCity(me.city);
        const myInterests = Array.isArray(me.affinity_data?.interests) ? me.affinity_data.interests : [];

        // 2. Prendo le altre persone nella mia città
        const { data: others, error: othersError } = await supabase
          .from('profiles')
          .select('id, birth_date, affinity_data')
          .eq('city', me.city)
          .neq('id', session.user.id);

        if (othersError) throw othersError;

        // 3. Calcolo l'affinità (Score) e formatto i dati
        const ranked = others.map(person => {
          const theirInterests = Array.isArray(person.affinity_data?.interests) ? person.affinity_data.interests : [];
          
          // Trovo gli interessi in comune
          const common = myInterests.filter(tag => theirInterests.includes(tag));
          
          return { 
            id: person.id,
            age: calculateAge(person.birth_date),
            score: common.length, 
            commonTags: common 
          };
        })
        .filter(match => match.score > 0) // Mostro solo chi ha almeno 1 interesse in comune
        .sort((a, b) => b.score - a.score); // Ordino dal più affine al meno affine

        setMatches(ranked);
      } catch (err) {
        console.error("Errore Discovery:", err);
        setErrorMsg(err.message || "Impossibile caricare le affinità.");
      } finally {
        setLoading(false);
      }
    }
    getMatches();
  }, [router]);

  const startChat = async (targetUserId) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Crea o trova la stanza (Upsert)
      const { data: room, error } = await supabase
        .from('chat_rooms')
        .upsert([
          { user_1: session.user.id, user_2: targetUserId }
        ], { onConflict: 'user_1, user_2' }) // Assicurati di avere un vincolo UNIQUE nel DB per questo se vuoi usare onConflict
        .select()
        .single();

      if (error) throw error;
      
      // Vai alla chat
      router.push(`/chat/${room.id}`);
    } catch (err) {
      alert("Errore nell'apertura della chat: " + err.message);
    }
  };

  if (loading) return <div style={styles.center}>Analisi del DNA compatibile a {myCity}...</div>;

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Scoperte a {myCity}</h1>
        <p style={styles.subtitle}>Persone con cui condividi passioni</p>
      </header>

      {errorMsg && <div style={{...styles.card, backgroundColor: '#fee2e2', color: '#b91c1c', textAlign: 'center'}}>{errorMsg}</div>}

      <div style={styles.list}>
        {matches.length > 0 ? (
          matches.map(person => (
            <div key={person.id} style={styles.card}>
              <div style={styles.row}>
                <div style={styles.avatar}>👤</div>
                <div>
                  <h3 style={styles.name}>Utente Compatibile, {person.age}</h3>
                  <p style={styles.affinity}>🔥 {person.score} passioni in comune</p>
                </div>
              </div>
              
              <div style={styles.tagRow}>
                {person.commonTags.map(tag => (
                  <span key={tag} style={styles.tag}>#{tag}</span>
                ))}
              </div>
              
              <button onClick={() => startChat(person.id)} style={styles.chatBtn}>
                Avvia Conversazione
              </button>
            </div>
          ))
        ) : (
          <div style={styles.emptyState}>
            <p style={{fontSize: '40px', margin: '0 0 10px 0'}}>🏜️</p>
            <p>Nessuna affinità trovata a {myCity} al momento.</p>
            <button onClick={() => router.push('/onboarding')} style={{...styles.chatBtn, width: 'auto', marginTop: '15px'}}>Aggiungi più interessi</button>
          </div>
        )}
      </div>
    </main>
  );
}

const styles = {
  container: { padding:'20px', maxWidth:'500px', margin:'0 auto', fontFamily: 'sans-serif' },
  header: { marginBottom: '24px' },
  title: { fontSize:'28px', fontWeight:'800', margin:'0 0 4px 0', color: '#0f172a' },
  subtitle: { fontSize: '15px', color: '#64748b', margin: 0 },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: { backgroundColor:'#fff', borderRadius:'20px', padding:'20px', border:'1px solid #e2e8f0', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.05)' },
  row: { display:'flex', alignItems:'center', gap:'16px', marginBottom:'16px' },
  avatar: { width:'56px', height:'56px', borderRadius:'28px', backgroundColor:'#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px' },
  name: { fontSize:'18px', fontWeight:'700', margin:'0 0 4px 0', color: '#1e293b' },
  affinity: { fontSize:'14px', fontWeight: '600', color:'#10b981', margin:0 },
  tagRow: { display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'20px' },
  tag: { fontSize:'12px', fontWeight: '600', color:'#3b82f6', background:'#eff6ff', padding:'6px 12px', borderRadius:'8px' },
  chatBtn: { width:'100%', padding:'14px', border:'none', borderRadius:'12px', backgroundColor:'#1e293b', color:'#fff', fontWeight:'bold', fontSize: '15px', cursor:'pointer', transition: 'background 0.2s' },
  emptyState: { textAlign: 'center', padding: '40px 20px', backgroundColor: '#f8fafc', borderRadius: '20px', color: '#64748b' },
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#64748b', fontFamily: 'sans-serif', fontWeight: '500' }
};
