"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

export default function DiscoveryPremium() {
  const [matches, setMatches] = useState([]);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const calculateAge = (birthDate) => {
    if (!birthDate) return "";
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

        const { data: user } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (!user?.city || !user?.birth_date) return router.push("/onboarding");
        
        setMe(user);

        const myInterests = user.affinity_data?.interests || [];
        const { data: others } = await supabase.from('profiles').select('*').eq('city', user.city).neq('id', session.user.id);

        const processed = others.map(u => {
          const common = myInterests.filter(tag => (u.affinity_data?.interests || []).includes(tag));
          return { ...u, score: common.length, commonTags: common, age: calculateAge(u.birth_date) };
        }).filter(match => match.score > 0).sort((a, b) => b.score - a.score);

        setMatches(processed);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    }
    loadData();
  }, [router]);

  // LOGICA CHAT INFALLIBILE
  const openChat = async (targetId) => {
    try {
      const ids = [me.id, targetId].sort();
      
      const { data: existingChat } = await supabase.from('chats').select('id').eq('user_1', ids[0]).eq('user_2', ids[1]).maybeSingle();
      if (existingChat) {
        return router.push(`/chat/${existingChat.id}`);
      }

      const { data: newChat, error } = await supabase.from('chats').insert({ user_1: ids[0], user_2: ids[1] }).select().single();
      if (error) throw error;
      
      router.push(`/chat/${newChat.id}`);
    } catch (err) {
      alert("Errore di connessione. Riprova.");
    }
  };

  if (loading) return <div style={styles.center}>Caricamento profili...</div>;

  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <h1 style={styles.title}>Scoperte a {me?.city}</h1>
        <p style={styles.subtitle}>Persone nel tuo cerchio con cui hai affinità</p>
      </header>

      <section style={styles.list}>
        {matches.map(m => (
          <div key={m.id} style={styles.card}>
            <div style={styles.cardTop}>
              <div style={styles.userInfo}>
                <h2 style={styles.userName}>{m.first_name}, {m.age}</h2>
                <div style={styles.badge}>🔥 {m.score} affinità</div>
              </div>
              <div style={styles.avatar}>👤</div>
            </div>
            
            <div style={styles.tagWrap}>
              {m.commonTags.map(tag => <span key={tag} style={styles.tag}>#{tag}</span>)}
            </div>

            <button style={styles.primaryAction} onClick={() => openChat(m.id)}>
              Inizia a parlare
            </button>
          </div>
        ))}

        {matches.length === 0 && (
          <div style={styles.emptyState}>
            <span style={{fontSize: '40px'}}>🚀</span>
            <h3>Nessun match ancora</h3>
            <p>Invita i tuoi amici a iscriversi a Circlo a {me?.city}!</p>
          </div>
        )}
      </section>

      <footer style={styles.inviteBar}>
        <div style={styles.inviteCard}>
          <div style={{flex: 1}}>
            <p style={styles.inviteTitle}>Fai crescere il cerchio</p>
            <p style={styles.inviteSub}>Più siamo, più affinità troverai.</p>
          </div>
          <button style={styles.inviteButton} onClick={() => window.open(`https://wa.me/?text=Entra su Circlo!`)}>
            Invita ora
          </button>
        </div>
      </footer>
    </main>
  );
}

const styles = {
  main: { backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: '-apple-system, system-ui, sans-serif', color: '#0f172a', paddingBottom: '120px' },
  header: { padding: '40px 20px 20px 20px', textAlign: 'center' },
  title: { fontSize: '32px', fontWeight: '900', letterSpacing: '-0.5px', margin: 0 },
  subtitle: { color: '#64748b', fontSize: '15px', marginTop: '5px' },
  list: { padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '550px', margin: '0 auto' },
  card: { backgroundColor: '#ffffff', borderRadius: '24px', padding: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' },
  userInfo: { display: 'flex', flexDirection: 'column', gap: '4px' },
  userName: { fontSize: '22px', fontWeight: '800', margin: 0 },
  badge: { color: '#10b981', fontWeight: '700', fontSize: '13px', display: 'inline-block' },
  avatar: { width: '55px', height: '55px', borderRadius: '28px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' },
  tagWrap: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '25px' },
  tag: { padding: '6px 14px', backgroundColor: '#eff6ff', color: '#3b82f6', borderRadius: '12px', fontSize: '13px', fontWeight: '600' },
  primaryAction: { width: '100%', padding: '16px', borderRadius: '16px', border: 'none', backgroundColor: '#0f172a', color: '#fff', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' },
  emptyState: { textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', borderRadius: '24px', border: '1px dashed #cbd5e1', color: '#64748b' },
  inviteBar: { position: 'fixed', bottom: '20px', left: 0, right: 0, display: 'flex', justifyContent: 'center', padding: '0 20px' },
  inviteCard: { width: '100%', maxWidth: '450px', backgroundColor: '#ffffff', padding: '15px 20px', borderRadius: '20px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px' },
  inviteTitle: { fontSize: '15px', fontWeight: '800', margin: 0 },
  inviteSub: { fontSize: '12px', color: '#64748b', margin: 0 },
  inviteButton: { backgroundColor: '#25D366', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' },
  center: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', color: '#64748b' }
};
