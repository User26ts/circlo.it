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

  // Calcolo dell'età sicuro
  const calculateAge = (dateString) => {
    if (!dateString) return "";
    const birthDate = new Date(dateString);
    if (isNaN(birthDate.getTime())) return "";
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
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

        // 1. Recupero il mio profilo
        const { data: me, error: meError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (meError || !me?.city) {
          router.push("/onboarding");
          return;
        }

        setMyCity(me.city);
        const myInterests = me.affinity_data?.interests || [];

        // 2. Recupero altri utenti nella stessa città
        const { data: others, error: othersError } = await supabase
          .from('profiles')
          .select('id, first_name, birth_date, affinity_data')
          .eq('city', me.city)
          .neq('id', session.user.id);

        if (othersError) throw othersError;

        // 3. Algoritmo di affinità
        const ranked = others.map(person => {
          const theirInterests = person.affinity_data?.interests || [];
          const common = myInterests.filter(tag => theirInterests.includes(tag));
          
          return { 
            id: person.id,
            name: person.first_name || "Utente Circlo",
            age: calculateAge(person.birth_date),
            score: common.length, 
            commonTags: common 
          };
        })
        .filter(match => match.score > 0) 
        .sort((a, b) => b.score - a.score);

        setMatches(ranked);
      } catch (err) {
        console.error("Errore Discovery:", err);
        setErrorMsg("Si è verificato un problema nel caricamento.");
      } finally {
        setLoading(false);
      }
    }
    getMatches();
  }, [router]);

  // Funzione per gestire l'apertura della chat (Risolve l'errore Unique Constraint)
  const openChat = async (targetUserId) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const myId = session.user.id;

      // Ordiniamo gli ID per il vincolo del database
      const ids = [myId, targetUserId].sort();
      
      const { data: chat, error } = await supabase
        .from('chats')
        .upsert({ user_1: ids[0], user_2: ids[1] }, { onConflict: 'user_1, user_2' })
        .select()
        .single();

      if (error) throw error;
      router.push(`/chat/${chat.id}`);
    } catch (err) {
      alert("Errore nell'apertura della chat: " + err.message);
    }
  };

  if (loading) return <div style={styles.center}>Cercando connessioni nel tuo cerchio...</div>;

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Scoperte a {myCity}</h1>
        <p style={styles.subtitle}>Persone che vibrano sulla tua stessa frequenza.</p>
      </header>

      {errorMsg && <div style={styles.errorBanner}>{errorMsg}</div>}

      <div style={styles.list}>
        {matches.length > 0 ? (
          matches.map(person => (
            <div key={person.id} style={styles.card}>
              <div style={styles.cardRow}>
                <div style={styles.avatar}>👤</div>
                <div>
                  <h3 style={styles.name}>{person.name}{person.age ? `, ${person.age}` : ""}</h3>
                  <p style={styles.affinity}>🔥 {person.score} passioni in comune</p>
                </div>
              </div>
              
              <div style={styles.tagRow}>
                {person.commonTags.map(tag => (
                  <span key={tag} style={styles.tag}>#{tag}</span>
                ))}
              </div>
              
              <button onClick={() => openChat(person.id)} style={styles.chatBtn}>
                Inizia a parlare
              </button>
            </div>
          ))
        ) : (
          /* --- VERSIONE LUNGA: EMPTY STATE PER PIONIERI --- */
          <div style={styles.emptyStateCard}>
            <div style={styles.emojiIcon}>🚀</div>
            <h2 style={styles.emptyTitle}>Sei tra i primi pionieri!</h2>
            
            <p style={styles.emptyText}>
              Ciao! Se vedi questa pagina ancora vuota, non preoccuparti. 
              <b> Circlo</b> è una realtà giovanissima, creata da <b>studenti per studenti</b>, 
              totalmente gratuita e senza scopi di lucro.
            </p>

            <div style={styles.manifestoBox}>
              <p style={styles.manifestoText}>
                Siamo in una fase di lancio. Per trovare affinità profonde abbiamo bisogno 
                di far crescere la rete. Ogni nuovo iscritto è un pezzo del puzzle che si aggiunge 
                per combattere la solitudine sociale.
              </p>
            </div>

            <p style={styles.callToAction}>
              Vuoi aiutarci? <b>Invita un amico</b> della tua zona o aggiungi ancora più 
              dettagli al tuo DNA. Più siamo, più la magia accade.
            </p>

            <div style={styles.actionButtons}>
              <button 
                onClick={() => {
                  const text = "Ehi, iscriviti a Circlo! È un'app fatta da studenti per trovare persone con gli stessi interessi a " + myCity + ". Iscriviti così facciamo match!";
                  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                }} 
                style={styles.primaryBtn}
              >
                Invita su WhatsApp
              </button>
              <button onClick={() => router.push('/onboarding')} style={styles.secondaryBtn}>
                Arricchisci il tuo DNA
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

const styles = {
  container: { padding: '30px 20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' },
  header: { marginBottom: '35px', textAlign: 'center' },
  title: { fontSize: '28px', fontWeight: '900', color: '#0f172a', margin: '0 0 8px 0' },
  subtitle: { fontSize: '16px', color: '#64748b', lineHeight: '1.4' },
  errorBanner: { padding: '15px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '12px', marginBottom: '20px', textAlign: 'center', fontSize: '14px' },
  list: { display: 'flex', flexDirection: 'column', gap: '20px' },
  card: { backgroundColor: '#fff', borderRadius: '24px', padding: '25px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' },
  cardRow: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' },
  avatar: { width: '55px', height: '55px', borderRadius: '28px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' },
  name: { fontSize: '19px', fontWeight: '800', color: '#1e293b', margin: 0 },
  affinity: { fontSize: '14px', fontWeight: '700', color: '#10b981', margin: '2px 0 0 0' },
  tagRow: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' },
  tag: { fontSize: '12px', fontWeight: '600', color: '#3b82f6', background: '#eff6ff', padding: '6px 12px', borderRadius: '10px' },
  chatBtn: { width: '100%', padding: '15px', border: 'none', borderRadius: '14px', backgroundColor: '#1e293b', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', transition: '0.2s' },
  
  // Stili per l'Empty State (Il Manifesto)
  emptyStateCard: { backgroundColor: '#ffffff', padding: '45px 25px', borderRadius: '32px', textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: '0 15px 35px rgba(0,0,0,0.06)' },
  emojiIcon: { fontSize: '60px', marginBottom: '20px' },
  emptyTitle: { fontSize: '24px', fontWeight: '900', color: '#0f172a', marginBottom: '18px' },
  emptyText: { fontSize: '15px', color: '#475569', lineHeight: '1.7', marginBottom: '25px' },
  manifestoBox: { backgroundColor: '#f8fafc', padding: '20px', borderRadius: '20px', borderLeft: '5px solid #3b82f6', marginBottom: '25px', textAlign: 'left' },
  manifestoText: { fontSize: '14px', color: '#334155', margin: 0, fontStyle: 'italic', lineHeight: '1.6' },
  callToAction: { fontSize: '14px', color: '#64748b', marginBottom: '30px', fontWeight: '500' },
  actionButtons: { display: 'flex', flexDirection: 'column', gap: '12px' },
  primaryBtn: { padding: '18px', backgroundColor: '#25D366', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' },
  secondaryBtn: { padding: '16px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' },
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#64748b', fontFamily: 'sans-serif', fontSize: '18px' }
};
