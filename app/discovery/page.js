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

  // Funzione per calcolare l'età dalla data di nascita
  const calculateAge = (dateString) => {
    if (!dateString) return "";
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push("/");

      // 1. Recupero il mio profilo completo
      const { data: me } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      if (!me?.city) return router.push("/onboarding");
      
      setMyCity(me.city);
      const myTags = me.affinity_data?.interests || [];

      // 2. Recupero altri utenti della stessa città
      const { data: others } = await supabase.from('profiles')
        .select('id, first_name, birth_date, affinity_data')
        .eq('city', me.city)
        .neq('id', session.user.id);

      // 3. Calcolo affinità profonda
      const ranked = others.map(p => {
        const theirTags = p.affinity_data?.interests || [];
        const common = myTags.filter(t => theirTags.includes(t));
        
        return { 
          id: p.id, 
          first_name: p.first_name, 
          age: calculateAge(p.birth_date),
          score: common.length, 
          commonTags: common 
        };
      })
      .filter(x => x.score > 0) // Mostriamo solo chi ha almeno 1 punto in comune
      .sort((a, b) => b.score - a.score);

      setMatches(ranked);
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) return <div style={styles.center}>Analizzando le affinità nel tuo cerchio...</div>;

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Scoperte a {myCity}</h1>
        <p style={styles.subtitle}>Persone con il tuo stesso DNA</p>
      </header>

      <div style={styles.list}>
        {matches.length > 0 ? (
          matches.map(m => (
            <div key={m.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h3 style={styles.name}>{m.first_name}{m.age ? `, ${m.age}` : ""}</h3>
                  <p style={styles.score}>🔥 {m.score} affinità trovate</p>
                </div>
                <div style={styles.avatarPlaceholder}>👤</div>
              </div>
              
              <div style={styles.tagGrid}>
                {m.commonTags.map(t => (
                  <span key={t} style={styles.tag}>#{t}</span>
                ))}
              </div>
              
              <button style={styles.btn}>Inizia una conversazione</button>
            </div>
          ))
        ) : (
          /* --- EMPTY STATE PER PIONIERI --- */
          <div style={styles.pioneerCard}>
            <div style={{fontSize:'60px', marginBottom: '20px'}}>🚀</div>
            <h2 style={styles.pTitle}>Sei tra i primi pionieri!</h2>
            <p style={styles.pText}>
              Circlo è un progetto giovanissimo creato da <b>studenti per studenti</b>. 
              Al momento non ci sono altri utenti con i tuoi interessi a {myCity}.
            </p>
            <div style={styles.manifesto}>
              Il valore di Circlo cresce con ogni nuovo iscritto. Aiutaci a popolare il tuo cerchio!
            </div>
            <button 
              style={styles.shareBtn} 
              onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent("Ehi, iscriviti a Circlo! È un'app per studenti per trovare persone con interessi simili. Ti aspetto nel mio cerchio!")}`)}
            >
              Invita i tuoi amici su WhatsApp
            </button>
            <button onClick={() => router.push('/onboarding')} style={styles.backBtn}>
              Modifica i tuoi interessi
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

const styles = {
  container: { padding:'30px 20px', maxWidth:'600px', margin:'0 auto', fontFamily:'-apple-system, system-ui, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' },
  header: { marginBottom: '30px', textAlign: 'center' },
  title: { fontSize:'28px', fontWeight:'900', color:'#0f172a', margin: '0' },
  subtitle: { fontSize:'16px', color:'#64748b', marginTop: '5px' },
  list: { display:'flex', flexDirection:'column', gap:'20px' },
  card: { backgroundColor:'#fff', padding:'25px', borderRadius:'24px', border:'1px solid #e2e8f0', boxShadow:'0 10px 25px rgba(0,0,0,0.03)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' },
  name: { fontSize:'20px', fontWeight:'800', margin:0, color: '#1e293b' },
  score: { fontSize:'14px', color:'#10b981', fontWeight:'bold', marginTop: '4px' },
  avatarPlaceholder: { width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
  tagGrid: { display:'flex', flexWrap:'wrap', gap:'8px', margin:'15px 0' },
  tag: { fontSize:'12px', color:'#3b82f6', background:'#eff6ff', padding:'6px 12px', borderRadius:'10px', fontWeight: '600' },
  btn: { width:'100%', padding:'15px', border:'none', borderRadius:'14px', background:'#1e293b', color:'#fff', fontWeight:'bold', cursor: 'pointer', transition: '0.2s' },
  
  // Stili Pioneer
  pioneerCard: { textAlign:'center', padding:'50px 30px', backgroundColor:'#fff', borderRadius:'32px', border:'1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' },
  pTitle: { fontSize:'24px', fontWeight:'800', margin:'0 0 15px 0', color: '#0f172a' },
  pText: { color:'#64748b', fontSize:'15px', lineHeight:'1.6' },
  manifesto: { backgroundColor:'#f8fafc', padding:'20px', borderRadius:'16px', fontSize:'14px', margin:'25px 0', borderLeft:'5px solid #3b82f6', color: '#475569', textAlign: 'left', fontStyle: 'italic' },
  shareBtn: { width:'100%', padding:'18px', borderRadius:'16px', border:'none', background:'#25D366', color:'#fff', fontWeight:'bold', cursor:'pointer', fontSize: '16px', marginBottom: '10px' },
  backBtn: { width:'100%', padding:'12px', borderRadius:'16px', border:'1px solid #e2e8f0', background:'transparent', color:'#64748b', fontWeight:'600', cursor:'pointer' },
  center: { display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', color:'#64748b', fontSize: '18px', fontWeight: '500' }
};
