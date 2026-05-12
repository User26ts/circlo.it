"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Link from "next/link";

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("explore"); // explore | chats | profile
  const [myProfile, setMyProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasNewMsg, setHasNewMsg] = useState(false);

  useEffect(() => {
    fetchData();
    
    // Realtime per notifica pallino rosso sulle chat
    const channel = supabase.channel('notifiche_globali')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        if (payload.new.receiver_id === myProfile?.id) setHasNewMsg(true);
      }).subscribe();

    return () => supabase.removeChannel(channel);
  }, [filter, activeTab]);

  async function fetchData() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push("/");

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    setMyProfile(profile);

    if (activeTab === "explore") {
      let query = supabase.from('profiles').select('*').neq('id', user.id);
      if (filter) {
        query = query.contains('affinity_data->interests', [filter]);
      }
      const { data: others } = await query;
      setMatches(others || []);
    }
    setLoading(false);
  }

  return (
    <main style={styles.container}>
      <div style={styles.aurora}></div>

      {/* HEADER DINAMICO */}
      <header style={styles.header}>
        <h2 style={styles.logo}>circlo<span style={{color: '#00d1ff'}}>.</span></h2>
        <div style={styles.cityBadge}>{myProfile?.city || "..."}</div>
      </header>

      {/* VIEWPORT CONTENUTO */}
      <div style={styles.viewport}>
        {activeTab === "explore" && (
          <section style={styles.fadeAnim}>
            <div style={styles.filterBar}>
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

            <div style={styles.grid}>
              {matches.map(other => (
                <div key={other.id} style={styles.card}>
                  <div style={styles.avatarPlaceholder}>?</div>
                  <h3 style={styles.anonName}>Utente Anonimo</h3>
                  <div style={styles.tagContainer}>
                    {other.affinity_data?.interests?.slice(0, 4).map(tag => (
                      <span key={tag} style={myProfile.affinity_data.interests.includes(tag) ? styles.tagCommon : styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link href={`/chat/${other.id}`} style={styles.connectBtn}>
                    CONNETTI
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "chats" && (
          <div style={styles.emptyState}>
            <p>Le tue conversazioni appariranno qui.</p>
            <button onClick={() => setActiveTab("explore")} style={styles.simpleBtn}>Inizia a esplorare</button>
          </div>
        )}

        {activeTab === "profile" && (
          <div style={styles.profileCard}>
            <div style={styles.bigAvatar}>{myProfile?.first_name?.[0]}</div>
            <h2>{myProfile?.first_name}</h2>
            <p>{myProfile?.city}</p>
            <button onClick={() => router.push("/onboarding")} style={styles.editBtn}>Modifica DNA</button>
            <button onClick={async () => { await supabase.auth.signOut(); router.push("/"); }} style={styles.logoutBtn}>Esci</button>
          </div>
        )}
      </div>

      {/* NAVBAR MOBILE-FIRST (BOTTOM) */}
      <nav style={styles.bottomNav}>
        <button onClick={() => setActiveTab("explore")} style={activeTab === "explore" ? styles.navItemActive : styles.navItem}>
          <span style={{fontSize: '1.4rem'}}>🧬</span>
          <small>DNA</small>
        </button>
        <button onClick={() => {setActiveTab("chats"); setHasNewMsg(false);}} style={activeTab === "chats" ? styles.navItemActive : styles.navItem}>
          <div style={{position: 'relative'}}>
            <span style={{fontSize: '1.4rem'}}>💬</span>
            {hasNewMsg && <div style={styles.redDot} />}
          </div>
          <small>Chat</small>
        </button>
        <button onClick={() => setActiveTab("profile")} style={activeTab === "profile" ? styles.navItemActive : styles.navItem}>
          <span style={{fontSize: '1.4rem'}}>👤</span>
          <small>Io</small>
        </button>
      </nav>
    </main>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#f0f4f8', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  aurora: { position: 'absolute', width: '100%', height: '100%', background: 'radial-gradient(circle at 80% 20%, rgba(186,230,253,0.4) 0%, transparent 50%)', filter: 'blur(80px)', zIndex: 0 },
  header: { zIndex: 10, padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.5)' },
  logo: { fontSize: '1.5rem', fontWeight: '800', color: '#334155', margin: 0 },
  cityBadge: { background: '#3b82f6', color: 'white', padding: '5px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 'bold' },
  viewport: { flex: 1, padding: '20px', overflowY: 'auto', zIndex: 1, paddingBottom: '100px' },
  filterBar: { display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '10px' },
  filterBtn: { padding: '8px 16px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.5)', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.8rem' },
  filterBtnActive: { padding: '8px 16px', borderRadius: '100px', border: 'none', background: '#3b82f6', color: 'white', fontWeight: 'bold', whiteSpace: 'nowrap', fontSize: '0.8rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '15px' },
  card: { background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(15px)', borderRadius: '25px', padding: '20px', border: '1px solid white', textAlign: 'center' },
  avatarPlaceholder: { width: '60px', height: '60px', background: '#e2e8f0', borderRadius: '50%', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' },
  anonName: { fontSize: '0.9rem', marginBottom: '10px', color: '#334155' },
  tagContainer: { display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center', marginBottom: '15px' },
  tag: { fontSize: '0.6rem', padding: '3px 8px', background: 'rgba(0,0,0,0.05)', borderRadius: '100px', color: '#64748b' },
  tagCommon: { fontSize: '0.6rem', padding: '3px 8px', background: '#dbeafe', borderRadius: '100px', color: '#2563eb', fontWeight: 'bold' },
  connectBtn: { display: 'block', padding: '10px', background: '#3b82f6', color: 'white', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 'bold', textDecoration: 'none' },
  bottomNav: { position: 'fixed', bottom: '20px', left: '20px', right: '20px', height: '70px', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', borderRadius: '30px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', zIndex: 100 },
  navItem: { background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#94a3b8', gap: '2px', cursor: 'pointer' },
  navItemActive: { background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#3b82f6', gap: '2px', cursor: 'pointer' },
  redDot: { position: 'absolute', top: '0', right: '0', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', border: '2px solid white' },
  profileCard: { textAlign: 'center', padding: '40px 20px' },
  bigAvatar: { width: '100px', height: '100px', background: 'white', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' },
  editBtn: { width: '100%', padding: '15px', borderRadius: '100px', border: '1px solid #3b82f6', color: '#3b82f6', background: 'white', fontWeight: 'bold', marginBottom: '10px', cursor: 'pointer' },
  logoutBtn: { color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' },
  emptyState: { textAlign: 'center', padding: '100px 20px', color: '#94a3b8' },
  simpleBtn: { marginTop: '15px', background: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '100px', fontWeight: 'bold' },
  fadeAnim: { animation: 'fadeIn 0.5s ease-in-out' }
};
