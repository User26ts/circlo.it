"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

export default function DiscoveryLiminal() {
  const [matches, setMatches] = useState([]);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Calcolo età preciso
  const calcAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push("/");

      const { data: user } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      if (!user?.city || !user?.birth_date) return router.push("/onboarding");
      setMe(user);

      const myTags = user.affinity_data?.interests || [];
      const { data: others } = await supabase.from('profiles').select('*').eq('city', user.city).neq('id', session.user.id);

      const scored = others.map(u => {
        const common = myTags.filter(t => (u.affinity_data?.interests || []).includes(t));
        return { ...u, age: calcAge(u.birth_date), common };
      }).filter(x => x.common.length > 0).sort((a, b) => b.common.length - a.common.length);

      setMatches(scored);
      setLoading(false);
    }
    init();
  }, [router]);

  // LA SOLUZIONE DEFINITIVA PER LE CHAT (Niente errori RLS)
  const openChat = async (targetId) => {
    try {
      const ids = [me.id, targetId].sort();
      
      // 1. Cerco la chat. Se esiste, la apro.
      const { data: existing } = await supabase.from('chats').select('id').eq('user_1', ids[0]).eq('user_2', ids[1]).maybeSingle();
      if (existing) {
        return router.push(`/chat/${existing.id}`);
      }

      // 2. Se non esiste, la creo e poi la apro.
      const { data: newChat, error } = await supabase.from('chats').insert({ user_1: ids[0], user_2: ids[1] }).select('id').single();
      if (error) throw error;
      
      router.push(`/chat/${newChat.id}`);
    } catch (e) {
      alert("Errore nell'aprire la connessione: " + e.message);
    }
  };

  if (loading) return <div style={styles.loader}>Ricerca presenze...</div>;

  return (
    <main style={styles.liminalSpace}>
      <header style={styles.header}>
        <h1 style={styles.title}>Settore {me?.city}</h1>
        <p style={styles.sub}>Entità rilevate con il tuo stesso DNA.</p>
      </header>

      <div style={styles.grid}>
        {matches.map(m => (
          <div key={m.id} style={styles.glassCard}>
            <div style={styles.cardTop}>
              <h2 style={styles.name}>{m.first_name}, {m.age}</h2>
              <span style={styles.score}>{m.common.length} Match</span>
            </div>
            
            <div style={styles.tagList}>
              {m.common.map(t => <span key={t} style={styles.tag}>[{t}]</span>)}
            </div>

            <button onClick={() => openChat(m.id)} style={styles.actionBtn}>Inizia Connessione</button>
          </div>
        ))}
        {matches.length === 0 && <div style={styles.empty}>Nessuna anomalia rilevata nel settore.</div>}
      </div>

      <div style={styles.inviteWidget}>
        <div style={styles.inviteGlass}>
          <div>
            <p style={styles.invTitle}>Popola il livello</p>
            <p style={styles.invSub}>Invia segnale ad altri.</p>
          </div>
          <button style={styles.invBtn} onClick={() => window.open(`https://wa.me/?text=Entra in Circlo.`)}>Invita</button>
        </div>
      </div>
    </main>
  );
}

const styles = {
  liminalSpace: { minHeight: '100vh', background: 'linear-gradient(180deg, #f0ebd8 0%, #e3dcb8 100%)', padding: '30px 20px 120px 20px', fontFamily: 'monospace', color: '#2d2c25' },
  header: { marginBottom: '30px', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '10px' },
  title: { margin: 0, fontSize: '24px', textTransform: 'uppercase' },
  sub: { margin: '5px 0 0 0', fontSize: '13px', color: '#5c5a4f' },
  loader: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0ebd8', fontFamily: 'monospace', color: '#5c5a4f' },
  grid: { display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '500px', margin: '0 auto' },
  glassCard: { background: 'rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.5)', padding: '20px', borderRadius: '4px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' },
  name: { margin: 0, fontSize: '18px', fontWeight: 'bold' },
  score: { fontSize: '12px', background: '#2d2c25', color: '#f0ebd8', padding: '2px 6px', borderRadius: '2px' },
  tagList: { display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '20px' },
  tag: { fontSize: '12px', color: '#5c5a4f' },
  actionBtn: { width: '100%', padding: '12px', background: 'transparent', border: '1px solid #2d2c25', color: '#2d2c25', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 'bold', textTransform: 'uppercase' },
  empty: { textAlign: 'center', padding: '40px', color: '#8c8872', border: '1px dashed #8c8872' },
  inviteWidget: { position: 'fixed', bottom: '20px', left: '20px', right: '20px', display: 'flex', justifyContent: 'center' },
  inviteGlass: { width: '100%', maxWidth: '460px', background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(15px)', border: '1px solid rgba(255, 255, 255, 0.6)', padding: '15px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 -5px 20px rgba(0,0,0,0.05)' },
  invTitle: { margin: 0, fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase' },
  invSub: { margin: 0, fontSize: '11px', color: '#5c5a4f' },
  invBtn: { background: '#2d2c25', color: '#e3dcb8', border: 'none', padding: '8px 15px', fontFamily: 'inherit', fontWeight: 'bold', cursor: 'pointer', borderRadius: '2px' }
};
