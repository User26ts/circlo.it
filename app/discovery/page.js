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

  // Calcolo dell'età sicuro (previene NaN se la data è assente)
  const calculateAge = (dateString) => {
    if (!dateString) return "Età N.D.";
    const birthDate = new Date(dateString);
    if (isNaN(birthDate.getTime())) return "Età N.D.";
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
          .select('city, affinity_data')
          .eq('id', session.user.id)
          .single();

        if (meError || !me?.city) {
          router.push("/onboarding");
          return;
        }

        setMyCity(me.city);
        const myInterests = Array.isArray(me.affinity_data?.interests) ? me.affinity_data.interests : [];

        // 2. Recupero altri utenti nella stessa città
        const { data: others, error: othersError } = await supabase
          .from('profiles')
          .select('id, first_name, birth_date, affinity_data')
          .eq('city', me.city)
          .neq('id', session.user.id);

        if (othersError) throw othersError;

        // 3. Algoritmo di affinità
        const ranked = others.map(person => {
          const theirInterests = Array.isArray(person.affinity_data?.interests) ? person.affinity_data.interests : [];
          const common = myInterests.filter(tag => theirInterests.includes(tag));
          
          return { 
            id: person.id,
            name: person.first_name || "Utente Circlo",
            age: calculateAge(person.birth_date),
            score: common.length, 
            commonTags: common 
          };
        })
        .filter(match => match.score > 0) // Mostra solo chi ha almeno un punto in comune
        .sort((a, b) => b.score - a.score);

        setMatches(ranked);
      } catch (err) {
        console.error("Errore Discovery:", err);
        setErrorMsg("Si è verificato un problema nel caricamento delle affinità.");
      } finally {
        setLoading(false);
      }
    }
    getMatches();
  }, [router]);

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
              <div style={styles.row}>
                <div style={styles.avatar}>👤</div>
                <div>
                  <h3 style={styles.name}>{person.name}, {person.age}</h3>
                  <p style={styles.affinity}>🔥 {person.score} passioni in comune</p>
                </div>
              </div>
              
              <div style={styles.tagRow}>
                {person.commonTags.map(tag => (
                  <span key={tag} style={styles.tag}>#{tag}</span>
                ))}
              </div>
              
              <button style={styles.chatBtn}>Inizia a parlare</button>
            </div>
          ))
        ) : (
          /* --- POP-UP / MESSAGGIO PER NUOVE RETI --- */
          <div style={styles.emptyStateCard}>
            <div style={styles.emojiIcon}>🚀</div>
            <h2 style={styles.emptyTitle}>Sei tra i primi pionieri!</h2>
            
            <p style={styles.emptyText}>
              Ciao! Se vedi questa pagina ancora vuota, non è un errore del sistema. 
              <b> Circlo</b> è una realtà giovanissima, creata da <b>studenti per studenti</b>, 
              senza scopi di lucro.
            </p>

            <div style={styles.manifestoBox}>
              <p style={styles.manifestoText}>
                Siamo in una fase di lancio. Per trovare affinità profonde abbiamo bisogno 
                di far crescere la rete. Ogni nuovo iscritto è un pezzo del puzzle che si aggiunge.
              </p>
            </div>

            <p style={styles.callToAction}>
              Vuoi aiutarci? <b>Invita un amico</b> della tua zona o aggiungi ancora più 
              dettagli al tuo DNA. Più siamo, più la magia accade.
            </p>

            <div style={styles.actionButtons}>
              <button onClick={() => router.push('/onboarding')} style={styles.secondaryBtn}>
                Arricchisci il tuo DNA
              </button>
              <button 
                onClick={() => {
                  const text = "Ehi, entra su Circlo! È un'app fatta da studenti per trovare persone con gli stessi interessi. Iscriviti così facciamo match!";
                  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                }} 
                style={styles.primaryBtn}
              >
                Invita i tuoi amici su WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

const styles = {
  container: { padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif' },
  header: { marginBottom: '30px', textAlign: 'center' },
  title: { fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: '0 0 5px 0' },
  subtitle: { fontSize: '15px', color: '#64748b' },
  errorBanner: { padding: '15px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '12px', marginBottom: '20px', textAlign: 'center' },
  list: { display: 'flex', flexDirection: 'column', gap: '20px' },
  card: { backgroundColor: '#fff', borderRadius: '24px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
  row: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' },
  avatar: { width: '50px', height: '50px', borderRadius: '25px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
  name: { fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: 0 },
  affinity: { fontSize: '14px', fontWeight: '600', color: '#10b981', margin: 0 },
  tagRow: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' },
  tag: { fontSize: '12px', fontWeight: '600', color: '#3b82f6', background: '#eff6ff', padding: '5px 10px', borderRadius: '8px' },
  chatBtn: { width: '100%', padding: '12px', border: 'none', borderRadius: '12px', backgroundColor: '#1e293b', color: '#fff', fontWeight: 'bold', cursor: 'pointer' },
  
  // Stili per l'Empty State (Il messaggio agli studenti)
  emptyStateCard: { backgroundColor: '#ffffff', padding: '40px 25px', borderRadius: '28px', textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' },
  emojiIcon: { fontSize: '50px', marginBottom: '15px' },
  emptyTitle: { fontSize: '22px', fontWeight: '800', color: '#0f172a', marginBottom: '15px' },
  emptyText: { fontSize: '15px', color: '#475569', lineHeight: '1.6', marginBottom: '20px' },
  manifestoBox: { backgroundColor: '#f8fafc', padding: '15px', borderRadius: '16px', borderLeft: '4px solid #3b82f6', marginBottom: '20px', textAlign: 'left' },
  manifestoText: { fontSize: '14px', color: '#334155', margin: 0, fontStyle: 'italic' },
  callToAction: { fontSize: '14px', color: '#64748b', marginBottom: '25px' },
  actionButtons: { display: 'flex', flexDirection: 'column', gap: '12px' },
  primaryBtn: { padding: '15px', backgroundColor: '#25D366', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' },
  secondaryBtn: { padding: '15px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' },
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#64748b', fontFamily: 'sans-serif' }
};
