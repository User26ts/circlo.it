
"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { AFFINITY_CATALOG } from "@/constants/catalog";
import { useRouter } from "next/navigation";

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

export default function Onboarding() {
  const router = useRouter();
  const [mainCat, setMainCat] = useState(Object.keys(AFFINITY_CATALOG)[0]);
  const [subCat, setSubCat] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleItem = (item) => {
    setSelectedItems(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleSave = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.from('profiles').update({
        affinity_data: { selections: selectedItems }
      }).eq('id', user.id);
      
      if (!error) router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <main style={styles.container}>
      <div style={styles.aurora}></div>
      
      <div style={styles.glassCard}>
        <header style={{marginBottom: '30px'}}>
          <h1 style={styles.title}>Mappa della tua Identità</h1>
          <p style={styles.subtitle}>Naviga tra i mondi e seleziona le tue affinità.</p>
        </header>

        {/* BARRA CATEGORIE PRINCIPALI */}
        <nav style={styles.mainNav}>
          {Object.keys(AFFINITY_CATALOG).map(cat => (
            <button key={cat} 
              style={mainCat === cat ? styles.mainBtnActive : styles.mainBtn}
              onClick={() => { setMainCat(cat); setSubCat(""); }}>
              {cat.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </nav>

        {/* SOTTOCATEGORIE */}
        <div style={styles.subNav}>
          {Object.keys(AFFINITY_CATALOG[mainCat]).map(sub => (
            <button key={sub} 
              style={subCat === sub ? styles.subBtnActive : styles.subBtn}
              onClick={() => setSubCat(sub)}>
              {sub.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* GRIGLIA PARAMETRI ESPLOSIVA */}
        <div style={styles.grid}>
          {subCat ? (
            AFFINITY_CATALOG[mainCat][subCat].map(item => (
              <div key={item} 
                style={selectedItems.includes(item) ? styles.itemActive : styles.item}
                onClick={() => toggleItem(item)}>
                <span style={styles.gloss}></span>
                {item}
              </div>
            ))
          ) : (
            <div style={styles.emptyState}>
              <p>Seleziona una branca del sapere o un interesse sopra per visualizzare le opzioni.</p>
            </div>
          )}
        </div>

        {/* FOOTER FISSO */}
        <div style={styles.footer}>
          <div style={styles.counter}>
            <span>{selectedItems.length}</span> affinità trovate
          </div>
          <button style={styles.saveBtn} onClick={handleSave} disabled={loading}>
            <span style={styles.gloss}></span>
            {loading ? "SALVATAGGIO..." : "CONFERMA PROFILO"}
          </button>
        </div>
      </div>
    </main>
  );
}

// STILI FRUTIGER AERO / DREAMCORE
const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e0f2fe 0%, #ffffff 100%)', padding: '20px', overflow: 'hidden' },
  aurora: { position: 'absolute', width: '150%', height: '150%', background: 'radial-gradient(circle at 10% 10%, #00d1ff 0%, transparent 40%), radial-gradient(circle at 90% 90%, #70ffdb 0%, transparent 40%)', filter: 'blur(100px)', opacity: 0.3, zIndex: 0 },
  glassCard: { zIndex: 1, width: '100%', maxWidth: '1100px', height: '85vh', background: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(30px)', borderRadius: '50px', padding: '40px', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 30px 100px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' },
  title: { fontSize: '2.5rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-2px' },
  subtitle: { color: '#64748b', fontSize: '1rem' },
  mainNav: { display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '20px', borderBottom: '1px solid rgba(0,0,0,0.05)' },
  mainBtn: { padding: '12px 24px', borderRadius: '100px', border: 'none', background: 'rgba(255,255,255,0.8)', color: '#475569', cursor: 'pointer', fontWeight: '700', fontSize: '0.8rem', whiteSpace: 'nowrap' },
  mainBtnActive: { padding: '12px 24px', borderRadius: '100px', border: 'none', background: '#3b82f6', color: 'white', cursor: 'pointer', fontWeight: '700', fontSize: '0.8rem', whiteSpace: 'nowrap', boxShadow: '0 10px 20px rgba(59,130,246,0.3)' },
  subNav: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '30px' },
  subBtn: { padding: '8px 16px', borderRadius: '100px', border: '1px solid rgba(0,0,0,0.05)', background: 'transparent', cursor: 'pointer', fontSize: '0.85rem' },
  subBtnActive: { padding: '8px 16px', borderRadius: '100px', border: '1px solid #3b82f6', background: 'white', color: '#3b82f6', cursor: 'pointer', fontWeight: 'bold' },
  grid: { flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px', overflowY: 'auto', paddingRight: '10px' },
  item: { position: 'relative', padding: '25px 20px', background: 'rgba(255,255,255,0.6)', borderRadius: '25px', border: '1px solid white', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s ease', fontWeight: '600', color: '#1e293b' },
  itemActive: { position: 'relative', padding: '25px 20px', background: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)', color: 'white', borderRadius: '25px', border: 'none', textAlign: 'center', cursor: 'pointer', transform: 'scale(1.05)', boxShadow: '0 15px 30px rgba(37,99,235,0.2)' },
  gloss: { position: 'absolute', top: '0', left: '0', width: '100%', height: '45%', background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 100%)', borderRadius: '25px 25px 0 0', pointerEvents: 'none' },
  footer: { marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  counter: { fontSize: '1.1rem', color: '#475569', fontWeight: '600' },
  saveBtn: { padding: '20px 50px', background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)', color: 'white', borderRadius: '100px', border: 'none', fontWeight: '900', cursor: 'pointer', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(16,185,129,0.3)' },
  emptyState: { gridColumn: '1/-1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '1.2rem', fontStyle: 'italic' }
};
