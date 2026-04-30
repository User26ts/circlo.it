"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

export default function Discovery() {
  const [matches, setMatches] = useState([]);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getAge = (dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  useEffect(() => {
    async function loadDiscovery() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push("/");

      const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      if (!profile?.city) return router.push("/onboarding");
      setMe(profile);

      const myInterests = profile.affinity_data?.interests || [];
      const { data: others } = await supabase.from('profiles').select('*').eq('city', profile.city).neq('id', session.user.id);

      const scored = others.map(u => {
        const common = myInterests.filter(tag => (u.affinity_data?.interests || []).includes(tag));
        return { ...u, age: getAge(u.birth_date), affinityScore: common.length, commonTags: common };
      }).filter(u => u.affinityScore > 0).sort((a, b) => b.affinityScore - a.affinityScore);

      setMatches(scored);
      setLoading(false);
    }
    loadDiscovery();
  }, []);

  if (loading) return <div style={{textAlign:'center', padding:'50px'}}>Cerco affinità nel tuo cerchio...</div>;

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>Persone a {me.city}</h1>
      <div style={styles.list}>
        {matches.map(user => (
          <div key={user.id} style={styles.userCard}>
            <div style={styles.cardHeader}>
              <div>
                <h2 style={styles.name}>{user.first_name}, {user.age}</h2>
                <span style={styles.scoreBadge}>{user.affinityScore} interessi in comune</span>
              </div>
              <div style={styles.avatar}>👤</div>
            </div>
            <div style={styles.tags}>
              {user.commonTags.slice(0, 5).map(t => <span key={t} style={styles.tag}>#{t}</span>)}
            </div>
            <button onClick={() => router.push(`/chat/${user.id}`)} style={styles.chatBtn}>Inizia a parlare</button>
          </div>
        ))}
        {matches.length === 0 && <p style={{textAlign:'center', color:'#94a3b8'}}>Nessun match trovato con i tuoi interessi.</p>}
      </div>
    </main>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#f8fafc', padding: '20px', fontFamily: 'sans-serif' },
  title: { fontSize: '24px', fontWeight: '800', marginBottom: '25px', textAlign: 'center' },
  list: { maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '15px' },
  userCard: { background: '#fff', borderRadius: '24px', padding: '20px', boxShadow: '0 10px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  name: { fontSize: '18px', fontWeight: '700', margin: 0 },
  scoreBadge: { fontSize: '12px', color: '#10b981', fontWeight: 'bold' },
  avatar: { width: '45px', height: '45px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' },
  tag: { fontSize: '12px', color: '#3b82f6', fontWeight: '600' },
  chatBtn: { width: '100%', padding: '12px', borderRadius: '12px', background: '#0f172a', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }
};
