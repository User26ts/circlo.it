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
      } catch (err) { console.error(err); } finally { setLoading(false); }
    }
    loadData();
  }, [router]);

  // FUNZIONE APERTURA CHAT PREMIUM (CORRETTA)
  const openChat = async (targetId) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const myId = session.user.id;
      const ids = [myId, targetId].sort(); // Ordine alfabetico degli UUID

      // 1. Cerchiamo se la chat esiste già
      let { data: existingChat } = await supabase
        .from('chats')
        .select('id')
        .eq('user_1', ids[0])
        .eq('user_2', ids[1])
        .maybeSingle();

      if (existingChat) {
        router.push(`/chat/${existingChat.id}`);
        return;
      }

      // 2. Se non esiste, la creiamo
      const { data: newChat, error: createError } = await supabase
        .from('chats')
        .insert({ user_1: ids[0], user_2: ids[1] })
        .select()
        .single();

      if (createError) throw createError;
      router.push(`/chat/${newChat.id}`);

    } catch (err) {
      console.error("Errore apertura chat:", err);
      alert("Non è stato possibile aprire la chat. Verifica di aver applicato lo script SQL.");
    }
  };

  const shareAction = () => {
    const msg = `Vieni su Circlo! Cerchiamo persone simili a noi a ${myCity}. 🚀`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`);
  };

  if (loading) return <div style={styles.center}>🧬 Caricamento...</div>;

  return (
    <main style={styles.main}>
      <div style={styles.header}>
        <h1 style={styles.title}>Scoperte a {myCity}</h1>
        <p style={styles.subtitle}>Connessioni basate sul DNA comune</p>
      </div>

      <div style={styles.list}>
        {matches.map(m => (
          <div key={m.id} style={styles.card}>
            <div style={styles.cardTop}>
              <h3 style={styles.cardName}>{m.first_name}</h3>
              <span style={styles.scoreBadge}>🔥 {m.score} affinità</span>
            </div>
            <div style={styles.tagWrap}>
              {m.commonTags.map(t => <span key={t} style={styles.tag}>#{t}</span>)}
            </div>
            <button onClick={() => openChat(m.id)} style={styles.btnChat}>Inizia a parlare</button>
          </div>
        ))}
        {matches.length === 0 && (
          <div style={styles.empty}>
            <p>Sei il primo pioniere qui! 🚀</p>
          </div>
        )}
      </div>

      {/* INVITO FISSO PREMIUM */}
      <div style={styles.inviteFixed}>
        <div style={styles.inviteInner}>
          <div style={{flex:1}}>
            <p style={styles.invTitle}>Fai crescere il cerchio</p>
            <p style={styles.invSub}>Più siamo, più match avrai.</p>
          </div>
          <button onClick={shareAction} style={styles.invBtn}>Invita</button>
        </div>
      </div>
    </main>
  );
}

const styles = {
  main: { backgroundColor: '#f0f4f8', minHeight: '100vh', padding: '40px 20px 140px 20px', fontFamily: 'sans-serif' },
  header: { textAlign: 'center', marginBottom: '30px' },
  title: { fontSize: '28px', fontWeight: '900', margin: 0, color: '#1a202c' },
  subtitle: { color: '#718096', fontSize: '15px' },
  list: { display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '500px', margin: '0 auto' },
  card: { backgroundColor: '#fff', borderRadius: '24px', padding: '24px', boxShadow: '0 8px 20px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  cardName: { fontSize: '20px', fontWeight: '800', margin: 0 },
  scoreBadge: { color: '#38a169', fontWeight: 'bold', fontSize: '13px' },
  tagWrap: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' },
  tag: { padding: '5px 12px', backgroundColor: '#ebf8ff', color: '#3182ce', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold' },
  btnChat: { width: '100%', padding: '15px', borderRadius: '15px', border: 'none', backgroundColor: '#1a202c', color: '#fff', fontWeight: 'bold', cursor: 'pointer' },
  inviteFixed: { position: 'fixed', bottom: '25px', left: 0, right: 0, display: 'flex', justifyContent: 'center', padding: '0 20px' },
  inviteInner: { width: '100%', maxWidth: '460px', backgroundColor: '#fff', padding: '15px 20px', borderRadius: '22px', boxShadow: '0 15px 40px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0' },
  invTitle: { margin: 0, fontWeight: '800', fontSize: '15px' },
  invSub: { margin: 0, fontSize: '12px', color: '#718096' },
  invBtn: { backgroundColor: '#25D366', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 'bold', marginLeft: '10px' },
  center: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }
};
