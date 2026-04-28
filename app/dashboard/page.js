"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

export default function Dashboard() {
  const [myProfile, setMyProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [filter]);

  async function fetchData() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    // 1. Prendi il mio profilo
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    setMyProfile(profile);

    // 2. Cerca altri utenti (Filtrando per interesse se selezionato)
    let query = supabase.from('profiles').select('*').neq('id', user.id);
    
    // Se c'è un filtro, cerchiamo dentro l'array JSONB
    if (filter) {
      query = query.contains('affinity_data->interests', [filter]);
    }

    const { data: others } = await query;
    setMatches(others || []);
    setLoading(false);
  }

  return (
    <main style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>CIRCLO</h2>
        <p style={{fontSize: '0.8rem', opacity: 0.7}}>Filtra per interesse comune:</p>
        <div style={styles.filterList}>
          {myProfile?.affinity_data?.interests?.map(interest => (
            <button 
              key={interest} 
              onClick={() => setFilter(filter === interest ? "" : interest)}
              style={filter === interest ? styles.filterBtnActive : styles.filterBtn}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.content}>
        <header style={styles.header}>
          <h1>Esplora il Circlo</h1>
          <p>Profili anonimi con i tuoi stessi interessi a {myProfile?.city || "tua città"}</p>
        </header>

        <div style={styles.grid}>
          {matches.map(other => (
            <div key={other.id} style={styles.card}>
              <span style={styles.gloss}></span>
              <div style={styles.avatarPlaceholder}>?</div>
              <h3 style={styles.anonName}>Utente Anonimo</h3>
              <p style={styles.location}>{other.city || "Città non specificata"}</p>
              
              <div style={styles.tagContainer}>
                {other.affinity_data?.interests?.map(tag => (
                  <span key={tag} style={myProfile.affinity_data.interests.includes(tag) ? styles.tagCommon : styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>

              <button style={styles.connectBtn}>
                <span style={styles.gloss}></span>
                CHIEDI DI CONOSCERLO
              </button>
            </div>
          ))}
        </div>

        {matches.length === 0 && !loading && (
          <div style={styles.empty}>
            <p>Nessun utente trovato con questo interesse al momento. Prova a cambiare filtro!</p>
          </div>
        )}
      </div>
    </main>
  );
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', background: '#f0f9ff', fontFamily: '"Segoe UI", sans-serif' },
  sidebar: { width: '300px', background: 'white', padding: '30px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '20px' },
  logo: { fontWeight: '900', color: '#3b82f6', letterSpacing: '-1px' },
  filterList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  filterBtn: { padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '0.85rem' },
  filterBtnActive: { padding: '12px', borderRadius: '12px', border: 'none', background: '#3b82f6', color: 'white', textAlign: 'left', cursor: 'pointer', fontWeight: 'bold' },
  content: { flex: 1, padding: '40px', overflowY: 'auto' },
  header: { marginBottom: '40px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' },
  card: { position: 'relative', background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)', borderRadius: '30px', padding: '30px', border: '1px solid white', textAlign: 'center', overflow: 'hidden' },
  avatarPlaceholder: { width: '80px', height: '80px', background: '#e2e8f0', borderRadius: '50%', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#94a3b8' },
  anonName: { fontSize: '1.1rem', fontWeight: 'bold', color: '#1e293b' },
  location: { fontSize: '0.85rem', color: '#64748b', marginBottom: '15px' },
  tagContainer: { display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'center', marginBottom: '20px' },
  tag: { fontSize: '0.7rem', padding: '4px 10px', background: '#f1f5f9', borderRadius: '100px', color: '#64748b' },
  tagCommon: { fontSize: '0.7rem', padding: '4px 10px', background: '#dbeafe', borderRadius: '100px', color: '#2563eb', fontWeight: 'bold' },
  connectBtn: { width: '100%', padding: '12px', background: 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white', border: 'none', borderRadius: '100px', fontWeight: 'bold', cursor: 'pointer', position: 'relative', overflow: 'hidden' },
  gloss: { position: 'absolute', top: '0', left: '0', width: '100%', height: '40%', background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)', pointerEvents: 'none' },
  empty: { textAlign: 'center', padding: '100px', color: '#94a3b8' }
};
