"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

export default function Dashboard() {
  const [tab, setTab] = useState("explore"); // explore | chats | profile
  const [myProfile, setMyProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [filter, setFilter] = useState("");
  const [showPromo, setShowPromo] = useState(true);
  const [hasNewMsg, setHasNewMsg] = useState(false);

  useEffect(() => {
    fetchData();
  }, [tab, filter]);

  async function fetchData() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    setMyProfile(profile);

    if (tab === "explore") {
      let query = supabase.from('profiles').select('*').neq('id', user.id);
      if (filter) query = query.contains('affinity_data->interests', [filter]);
      const { data: others } = await query;
      setMatches(others || []);
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.aurora}></div>
      
      <header style={styles.header}>
        <h2 style={styles.logo}>circlo<span style={{color:'#00d1ff'}}>.</span></h2>
        <div style={styles.badge}>{myProfile?.city}</div>
      </header>

      <div style={styles.viewport}>
        {tab === "explore" && (
          <section>
            {showPromo && (
              <div style={styles.promoBanner}>
                <div>
                  <div style={{fontWeight:'bold'}}>Invita un amico nel Circlo🧬</div>
                  <div style={{fontSize:'10px', opacity:0.8}}>Fai crescere la tua community locale.</div>
                </div>
                <button onClick={() => { navigator.share({url: window.location.origin}); setShowPromo(false); }} style={styles.promoBtn}>INVITA</button>
              </div>
            )}
            
            <div style={styles.filterBar}>
              {myProfile?.affinity_data?.interests?.map(i => (
                <button key={i} onClick={() => setFilter(filter === i ? "" : i)} style={filter === i ? styles.fBtnA : styles.fBtn}>
                  {i}
                </button>
              ))}
            </div>

            <div style={styles.grid}>
              {matches.map(m => (
                <div key={m.id} style={styles.card}>
                  <div style={styles.avatar}>?</div>
                  <div style={{fontWeight:'bold', fontSize:'0.9rem'}}>Utente Anonimo</div>
                  <div style={styles.cardTags}>
                    {m.affinity_data?.interests?.slice(0,3).map(t => (
                      <span key={t} style={myProfile.affinity_data.interests.includes(t) ? styles.tagC : styles.tagN}>{t}</span>
                    ))}
                  </div>
                  <button style={styles.connBtn}>CONNETTI</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === "profile" && (
          <div style={{textAlign:'center', padding:'40px 20px'}}>
             <div style={styles.bigAvatar}>{myProfile?.first_name?.[0]}</div>
             <h2 style={{margin:'10px 0'}}>{myProfile?.first_name}</h2>
             <button onClick={() => window.location.href='/onboarding'} style={styles.editBtn}>Modifica DNA</button>
             <button onClick={() => supabase.auth.signOut().then(()=> window.location.href='/')} style={styles.logoutBtn}>Logout</button>
          </div>
        )}
      </div>

      <nav style={styles.nav}>
        <button onClick={() => setTab("explore")} style={tab === "explore" ? styles.navA : styles.navI}>🧬<small>DNA</small></button>
        <button onClick={() => {setTab("chats"); setHasNewMsg(false);}} style={tab === "chats" ? styles.navA : styles.navI}>
          <div style={{position:'relative'}}>💬{hasNewMsg && <div style={styles.dot}/>}</div>
          <small>Chat</small>
        </button>
        <button onClick={() => setTab("profile")} style={tab === "profile" ? styles.navA : styles.navI}>👤<small>Io</small></button>
      </nav>
    </main>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' },
  aurora: { position: 'absolute', width: '100%', height: '100%', background: 'radial-gradient(circle at 50% 0%, rgba(0,209,255,0.08) 0%, transparent 50%)', filter: 'blur(60px)' },
  header: { padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10, background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(10px)' },
  logo: { margin: 0, fontWeight: '900', color: '#1e293b' },
  badge: { background: '#3b82f6', color: 'white', padding: '5px 12px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 'bold' },
  viewport: { flex: 1, padding: '20px', overflowY: 'auto', zIndex: 5, paddingBottom: '100px' },
  promoBanner: { background: 'linear-gradient(90deg, #25D366, #128C7E)', color: 'white', padding: '15px 20px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', boxShadow: '0 10px 20px rgba(37,211,102,0.2)' },
  promoBtn: { background: 'white', color: '#128C7E', border: 'none', padding: '8px 15px', borderRadius: '10px', fontWeight: 'bold', fontSize: '0.7rem' },
  filterBar: { display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '20px', paddingBottom: '5px' },
  fBtn: { padding: '8px 15px', borderRadius: '100px', border: '1px solid #e2e8f0', background: 'white', whiteSpace: 'nowrap', fontSize: '0.8rem' },
  fBtnA: { padding: '8px 15px', borderRadius: '100px', border: 'none', background: '#3b82f6', color: 'white', whiteSpace: 'nowrap', fontWeight: 'bold', fontSize: '0.8rem' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  card: { background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', padding: '20px', borderRadius: '25px', textAlign: 'center', border: '1px solid white' },
  avatar: { width: '60px', height: '60px', background: '#e2e8f0', borderRadius: '50%', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' },
  cardTags: { display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center', margin: '10px 0' },
  tagN: { fontSize: '0.6rem', padding: '3px 7px', background: '#f1f5f9', borderRadius: '5px' },
  tagC: { fontSize: '0.6rem', padding: '3px 7px', background: '#dbeafe', color: '#2563eb', fontWeight: 'bold', borderRadius: '5px' },
  connBtn: { width: '100%', padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '100px', fontWeight: 'bold', fontSize: '0.7rem' },
  nav: { position: 'fixed', bottom: '20px', left: '20px', right: '20px', height: '75px', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', borderRadius: '30px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', border: '1px solid white', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', zIndex: 100 },
  navI: { background: 'none', border: 'none', color: '#94a3b8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' },
  navA: { background: 'none', border: 'none', color: '#3b82f6', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontWeight: 'bold' },
  dot: { position: 'absolute', top: '0', right: '-2px', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', border: '2px solid white' },
  bigAvatar: { width: '100px', height: '100px', background: 'white', borderRadius: '50%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' },
  editBtn: { width: '100%', padding: '15px', borderRadius: '100px', border: '1px solid #3b82f6', color: '#3b82f6', background: 'white', fontWeight: 'bold', marginTop: '20px' },
  logoutBtn: { border: 'none', background: 'none', color: '#ef4444', fontWeight: 'bold', marginTop: '20px' }
};
