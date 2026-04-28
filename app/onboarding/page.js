
"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { AFFINITY_CATALOG } from "@/constants/catalog";
import { useRouter } from "next/navigation";

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

export default function Onboarding() {
  const router = useRouter();
  const [mainCat, setMainCat] = useState(Object.keys(AFFINITY_CATALOG)[0]);
  const [subCat, setSubCat] = useState("");
  const [selected, setSelected] = useState([]);

  const toggleItem = (item) => {
    setSelected(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const handleFinish = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('profiles').update({
        affinity_data: { interests: selected }
      }).eq('id', user.id);
      router.push("/dashboard");
    }
  };

  return (
    <main style={styles.container}>
      <div style={styles.glassCard}>
        <h1 style={styles.title}>Configura la tua Identità</h1>
        
        {/* Navigazione Macro */}
        <div style={styles.nav}>
          {Object.keys(AFFINITY_CATALOG).map(cat => (
            <button key={cat} 
                    style={mainCat === cat ? styles.navBtnActive : styles.navBtn}
                    onClick={() => {setMainCat(cat); setSubCat("");}}>
              {cat.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>

        {/* Navigazione Micro */}
        <div style={styles.subNav}>
          {Object.keys(AFFINITY_CATALOG[mainCat]).map(sub => (
            <button key={sub} 
                    style={subCat === sub ? styles.subBtnActive : styles.subBtn}
                    onClick={() => setSubCat(sub)}>
              {sub.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Griglia Scelte */}
        <div style={styles.grid}>
          {subCat && AFFINITY_CATALOG[mainCat][subCat].map(item => (
            <div key={item} 
                 style={selected.includes(item) ? styles.itemActive : styles.item}
                 onClick={() => toggleItem(item)}>
              <span style={styles.gloss}></span>
              {item}
            </div>
          ))}
        </div>

        <button style={styles.saveBtn} onClick={handleFinish}>
          SALVA ({selected.length} INTERESSI)
        </button>
      </div>
    </main>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#e0f2fe', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' },
  glassCard: { background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(20px)', borderRadius: '40px', padding: '40px', width: '100%', maxWidth: '900px', border: '1px solid white', textAlign: 'center' },
  title: { fontSize: '2.2rem', fontWeight: '900', color: '#1e293b', marginBottom: '30px' },
  nav: { display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '20px' },
  navBtn: { padding: '10px 20px', borderRadius: '100px', border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer' },
  navBtnActive: { padding: '10px 20px', borderRadius: '100px', border: 'none', background: '#3b82f6', color: 'white', cursor: 'pointer', fontWeight: 'bold' },
  subNav: { display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '30px' },
  subBtn: { padding: '6px 12px', borderRadius: '100px', border: '1px solid #e2e8f0', cursor: 'pointer', fontSize: '0.8rem' },
  subBtnActive: { padding: '6px 12px', borderRadius: '100px', border: '1px solid #3b82f6', color: '#3b82f6', background: 'white', cursor: 'pointer', fontWeight: 'bold' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px', maxHeight: '400px', overflowY: 'auto', marginBottom: '30px', padding: '10px' },
  item: { position: 'relative', padding: '15px', background: 'white', borderRadius: '15px', border: '1px solid #e2e8f0', cursor: 'pointer', overflow: 'hidden', fontWeight: '500' },
  itemActive: { position: 'relative', padding: '15px', background: '#3b82f6', color: 'white', borderRadius: '15px', border: 'none', cursor: 'pointer', overflow: 'hidden', fontWeight: 'bold', boxShadow: '0 5px 15px rgba(59,130,246,0.3)' },
  gloss: { position: 'absolute', top: '0', left: '0', width: '100%', height: '40%', background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)' },
  saveBtn: { padding: '15px 40px', background: '#10b981', color: 'white', border: 'none', borderRadius: '100px', fontWeight: 'bold', cursor: 'pointer' }
};
