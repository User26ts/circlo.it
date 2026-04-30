"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

export default function DiscoveryDreamcore() {
  const [matches, setMatches] = useState([]);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const calculateAge = (dob) => {
    if (!dob) return "";
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push("/");

      const { data: user } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      if (!user?.city) return router.push("/onboarding");
      setMe(user);

      const myInterests = user.affinity_data?.interests || [];
      const { data: others } = await supabase.from('profiles').select('*').eq('city', user.city).neq('id', session.user.id);

      const scored = others.map(u => {
        const theirInterests = u.affinity_data?.interests || [];
        const common = myInterests.filter(t => theirInterests.includes(t));
        return { ...u, common, age: calculateAge(u.birth_date) };
      })
      .filter(u => u.common.length > 0)
      .sort((a,b) => b.common.length - a.common.length);

      setMatches(scored);
      setLoading(false);
    }
    load();
  }, [router]);

  const openChat = async (targetId) => {
    const ids = [me.id, targetId].sort();
    let { data: chat } = await supabase.from('chats').select('id').eq('user_1', ids[0]).eq('user_2', ids[1]).maybeSingle();
    
    if (!chat) {
      const { data: newChat } = await supabase.from('chats').insert({ user_1: ids[0], user_2: ids[1] }).select().single();
      chat = newChat;
    }
    router.push(`/chat/${chat.id}`);
  };

  if (loading) return <div style={styles.center}>🌌 Sintonizzando le tue frequenze...</div>;

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Vibrazioni a {me?.city}</h1>
        <p style={styles.subtitle}>Anime affini scoperte nel raggio del tuo cerchio.</p>
      </header>

      <section style={styles.list}>
        {matches.map(m => (
          <div key={m.id} style={styles.matchCard}>
            <div style={styles.cardHeader}>
              <div style={styles.avatarGlow}>👤</div>
              <div>
                <h2 style={styles.name}>{m.first_name}, {m.age}</h2>
                <p style={styles.affinityText}>✨ {m.common.length} punti di contatto</p>
              </div>
            </div>
            
            <div style={styles.dnaGrid}>
              {m.common.map(tag => (
                <span key={tag} style={styles.dnaTag}>🧬 {tag}</span>
              ))}
            </div>

            <button onClick={() => openChat(m.id)} style={styles.chatBtn}>Connettiti</button>
          </div>
        ))}
        
        {matches.length === 0 && (
          <div style={styles.emptyCard}>
            <p style={{fontSize: '40px'}}>🛸</p>
            <p>Sei un pioniere solitario... per ora.</p>
          </div>
        )}
      </section>

      <footer style={styles.glassFooter}>
        <div style={styles.footerFlex}>
          <div>
            <p style={styles.footerTitle}>Invita altri sognatori</p>
            <p style={styles.footerSub}>Più siamo, più la rete vibra.</p>
          </div>
          <button style={styles.shareBtn} onClick={() => window.open('https://wa.me/?text=Entra nel cerchio!')}>Invita</button>
        </div>
      </footer>
    </main>
  );
}

const styles = {
  container: { minHeight: '100vh', background: 'linear-gradient(to bottom, #fdf2f8, #eef2ff)', padding: '40px 20px 140px 20px', fontFamily: 'sans-serif' },
  header: { textAlign: 'center', marginBottom: '40px' },
  title: { fontSize: '32px', fontWeight: '900', color: '#1e1b4b', letterSpacing: '-1px' },
  subtitle: { color: '#6366f1', fontSize: '15px', fontWeight: '600', opacity: 0.8 },
  list: { maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' },
  matchCard: { 
    background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', 
    borderRadius: '28px', padding: '25px', border: '1px solid rgba(255,255,255,0.7)',
    boxShadow: '0 10px 30px rgba(99, 102, 241, 0.05)'
  },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' },
  avatarGlow: { 
    width: '55px', height: '55px', borderRadius: '50%', background: '#fff', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px',
    boxShadow: '0 0 15px rgba(99, 102, 241, 0.2)' 
  },
  name: { fontSize: '22px', fontWeight: '800', color: '#1e1b4b', margin: 0 },
  affinityText: { fontSize: '13px', color: '#8b5cf6', fontWeight: 'bold', margin: 0 },
  dnaGrid: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '25px' },
  dnaTag: { padding: '6px 12px', background: '#fff', borderRadius: '10px', fontSize: '12px', fontWeight: '700', color: '#6366f1' },
  chatBtn: { 
    width: '100%', padding: '16px', borderRadius: '16px', border: 'none', 
    background: 'linear-gradient(90deg, #6366f1, #a855f7)', color: '#fff', 
    fontWeight: '900', cursor: 'pointer', boxShadow: '0 5px 15px rgba(99, 102, 241, 0.3)' 
  },
  glassFooter: { position: 'fixed', bottom: '25px', left: 0, right: 0, display: 'flex', justifyContent: 'center', padding: '0 20px' },
  footerFlex: { 
    width: '100%', maxWidth: '460px', background: 'rgba(255,255,255,0.7)', 
    backdropFilter: 'blur(20px)', padding: '15px 25px', borderRadius: '24px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 15px 40px rgba(0,0,0,0.1)'
  },
  footerTitle: { margin: 0, fontWeight: '800', fontSize: '15px', color: '#1e1b4b' },
  footerSub: { margin: 0, fontSize: '12px', color: '#6366f1' },
  shareBtn: { padding: '12px 20px', borderRadius: '14px', border: 'none', background: '#22c55e', color: '#fff', fontWeight: 'bold' },
  center: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }
};
