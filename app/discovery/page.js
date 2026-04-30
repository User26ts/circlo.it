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

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return router.push("/");

        const { data: me } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (!me?.city) return router.push("/onboarding");
        setMyCity(me.city);

        const myInterests = me.affinity_data?.interests || [];
        const { data: others } = await supabase.from('profiles').select('*').eq('city', me.city).neq('id', session.user.id);

        const processed = others.map(user => {
          const theirInterests = user.affinity_data?.interests || [];
          const common = myInterests.filter(tag => theirInterests.includes(tag));
          return { ...user, score: common.length, commonTags: common };
        })
        .filter(match => match.score > 0)
        .sort((a, b) => b.score - a.score);

        setMatches(processed);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  const startConversation = async (targetId) => {
    const { data: { session } } = await supabase.auth.getSession();
    const ids = [session.user.id, targetId].sort();
    
    const { data: chat, error } = await supabase
      .from('chats')
      .upsert({ user_1: ids[0], user_2: ids[1] }, { onConflict: 'user_1, user_2' })
      .select()
      .single();

    if (error) return alert("Errore connessione: " + error.message);
    router.push(`/chat/${chat.id}`);
  };

  if (loading) return (
    <div style={styles.loaderContainer}>
      <div style={styles.spinner}>🧬</div>
      <p style={{fontWeight: '600', color: '#64748b'}}>Analizzando le affinità...</p>
    </div>
  );

  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <h1 style={styles.mainTitle}>Scoperte a {myCity}</h1>
        <p style={styles.subtitle}>Persone con cui potresti vibrare oggi</p>
      </header>

      <section style={styles.scrollArea}>
        {matches.length > 0 ? matches.map(m => (
          <div key={m.id} style={styles.matchCard}>
            <div style={styles.cardInfo}>
              <div>
                <h2 style={styles.userName}>{m.first_name}</h2>
                <div style={styles.matchBadge}>🔥 {m.score} interessi comuni</div>
              </div>
              <div style={styles.avatarPlaceholder}>👤</div>
            </div>
            
            <div style={styles.tagCloud}>
              {m.commonTags.map(tag => (
                <span key={tag} style={styles.tag}>#{tag}</span>
              ))}
            </div>

            <button style={styles.primaryAction} onClick={() => startConversation(m.id)}>
              Inizia a parlare
            </button>
          </div>
        )) : (
          <div style={styles.emptyState}>
            <span style={{fontSize: '50px'}}>🚀</span>
            <h3 style={{margin: '15px 0 5px 0'}}>Nessun match ancora</h3>
            <p style={{color: '#94a3b8', fontSize: '14px'}}>Sei tra i primi pionieri di Circlo a {myCity}!</p>
          </div>
        )}
      </section>

      {/* FOOTER INVITO PREMIUM */}
      <footer style={styles.inviteBar}>
        <div style={styles.inviteCard}>
          <div style={{flex: 1}}>
            <p style={styles.inviteTitle}>Espandi il tuo cerchio</p>
            <p style={styles.inviteSub}>Più siamo, più affinità troverai.</p>
          </div>
          <button style={styles.inviteButton} onClick={() => {
            const text = encodeURIComponent(`Ehi! Sto usando Circlo per conoscere persone con i miei stessi interessi a ${myCity}. Unisciti anche tu! 🚀`);
            window.open(`https://wa.me/?text=${text}`);
          }}>
            Invita ora
          </button>
        </div>
      </footer>
    </main>
  );
}

const styles = {
  main: { backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: '-apple-system, system-ui, sans-serif', color: '#1e293b' },
  header: { padding: '40px 20px 20px 20px', textAlign: 'center' },
  mainTitle: { fontSize: '32px', fontWeight: '900', letterSpacing: '-0.5px', margin: 0 },
  subtitle: { color: '#64748b', fontSize: '16px', marginTop: '5px' },
  scrollArea: { padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '140px' },
  matchCard: { backgroundColor: '#ffffff', borderRadius: '28px', padding: '25px', boxShadow: '0 10px 25px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' },
  cardInfo: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' },
  userName: { fontSize: '22px', fontWeight: '800', margin: 0 },
  matchBadge: { color: '#10b981', fontWeight: '700', fontSize: '13px', marginTop: '4px' },
  avatarPlaceholder: { width: '50px', height: '50px', borderRadius: '25px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' },
  tagCloud: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '25px' },
  tag: { padding: '6px 12px', backgroundColor: '#eff6ff', color: '#3b82f6', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },
  primaryAction: { width: '100%', padding: '16px', borderRadius: '18px', border: 'none', backgroundColor: '#0f172a', color: '#fff', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' },
  emptyState: { textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', borderRadius: '30px', border: '2px dashed #e2e8f0' },
  inviteBar: { position: 'fixed', bottom: '25px', left: 0, right: 0, display: 'flex', justifyContent: 'center', padding: '0 20px', zIndex: 100 },
  inviteCard: { width: '100%', maxWidth: '450px', backgroundColor: '#ffffff', padding: '15px 20px', borderRadius: '24px', boxShadow: '0 15px 35px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px' },
  inviteTitle: { fontSize: '15px', fontWeight: '800', margin: 0 },
  inviteSub: { fontSize: '12px', color: '#64748b', margin: 0 },
  inviteButton: { backgroundColor: '#25D366', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' },
  loaderContainer: { height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
  spinner: { fontSize: '40px', marginBottom: '10px' }
};
