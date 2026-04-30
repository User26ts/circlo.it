"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

export default function DiscoveryPremium() {
  const [matches, setMatches] = useState([]);
  const [myCity, setMyCity] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // FUNZIONE PER CALCOLARE L'ETÀ
  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return router.push("/");

        const { data: me } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        
        // Se mancano dati obbligatori, rimanda all'onboarding
        if (!me?.city || !me?.first_name || !me?.birth_date) return router.push("/onboarding");
        
        setMyCity(me.city);

        const myInterests = me.affinity_data?.interests || [];
        const { data: others } = await supabase.from('profiles').select('*').eq('city', me.city).neq('id', session.user.id);

        const processed = others.map(user => {
          const common = myInterests.filter(tag => (user.affinity_data?.interests || []).includes(tag));
          return { ...user, score: common.length, commonTags: common, age: calculateAge(user.birth_date) };
        })
        .filter(match => match.score > 0)
        .sort((a, b) => b.score - a.score);

        setMatches(processed);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    }
    loadData();
  }, [router]);

  const openChat = async (targetId) => {
    const { data: { session } } = await supabase.auth.getSession();
    const ids = [session.user.id, targetId].sort();
    
    // Cerchiamo se esiste già
    const { data: existing } = await supabase.from('chats').select('id').eq('user_1', ids[0]).eq('user_2', ids[1]).maybeSingle();
    if (existing) return router.push(`/chat/${existing.id}`);

    // Altrimenti creiamo
    const { data: newChat, error } = await supabase.from('chats').insert({ user_1: ids[0], user_2: ids[1] }).select().single();
    if (!error) router.push(`/chat/${newChat.id}`);
  };

  if (loading) return <div style={styles.center}>🧬 Caricamento...</div>;

  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <h1 style={styles.title}>Scoperte a {myCity}</h1>
        <p style={styles.subtitle}>Connessioni nel raggio di km</p>
      </header>

      <div style={styles.list}>
        {matches.map(m => (
          <div key={m.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                {/* MOSTRA NOME ED ETÀ */}
                <h3 style={styles.userName}>{m.first_name}{m.age ? `, ${m.age}` : ""}</h3>
                <p style={styles.matchScore}>🔥 {m.score} affinità</p>
              </div>
              <div style={styles.avatar}>👤</div>
            </div>
            
            <div style={styles.tagGrid}>
              {m.commonTags.map(t => <span key={t} style={styles.tag}>#{t}</span>)}
            </div>
            
            <button onClick={() => openChat(m.id)} style={styles.chatBtn}>Inizia a parlare</button>
          </div>
        ))}
        {matches.length === 0 && (
          <div style={styles.empty}>Sei il primo pioniere! 🚀</div>
        )}
      </div>

      <footer style={styles.inviteFixed}>
        <div style={styles.inviteCard}>
          <div style={{flex:1}}>
            <p style={{fontWeight:'bold', margin:0, fontSize: '14px'}}>Fai crescere Circlo</p>
            <p style={{margin:0, fontSize:'11px', color:'#64748b'}}>Più siamo, più match avrai.</p>
          </div>
          <button style={styles.inviteBtn} onClick={() => window.open(`https://wa.me/?text=Vieni su Circlo!`)}>Invita</button>
        </div>
      </footer>
    </main>
  );
}

const styles = {
  main: { backgroundColor: '#f1f5f9', minHeight: '100vh', padding: '40px 20px 140px 20px', fontFamily: 'sans-serif' },
  header: { textAlign: 'center', marginBottom: '30px' },
  title: { fontSize: '28px', fontWeight: '900', margin: 0 },
  subtitle: { fontSize: '15px', color: '#64748b' },
  list: { display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '500px', margin: '0 auto' },
  card: { backgroundColor: '#fff', borderRadius: '24px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  userName: { fontSize: '20px', fontWeight: '800', margin: 0 },
  matchScore: { fontSize: '13px', color: '#10b981', fontWeight: '700', margin: 0 },
  avatar: { width: '45px', height: '45px', borderRadius: '25px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
  tagGrid: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' },
  tag: { padding: '5px 12px', backgroundColor: '#eff6ff', color: '#3b82f6', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold' },
  chatBtn: { width: '100%', padding: '15px', borderRadius: '14px', border: 'none', backgroundColor: '#0f172a', color: '#fff', fontWeight: 'bold', cursor: 'pointer' },
  inviteFixed: { position: 'fixed', bottom: '25px', left: 0, right: 0, display: 'flex', justifyContent: 'center', padding: '0 20px' },
  inviteCard: { width: '100%', maxWidth: '460px', backgroundColor: '#fff', padding: '15px 20px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0' },
  inviteBtn: { backgroundColor: '#25D366', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '10px', fontWeight: 'bold', marginLeft: '10px' },
  center: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  empty: { textAlign: 'center', padding: '40px', color: '#64748b' }
};
