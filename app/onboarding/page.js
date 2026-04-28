
"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState({
    main: "",
    sub: "",
    items: []
  });

  const handleItemToggle = (item) => {
    setSelections(prev => ({
      ...prev,
      items: prev.items.includes(item) 
        ? prev.items.filter(i => i !== item) 
        : [...prev.items, item]
    }));
  };

  return (
    <main style={styles.container}>
      <div style={styles.glassCard}>
        <h2 style={styles.title}>Cosa risuona in te?</h2>
        
        {/* LIVELLO 1: MACRO CATEGORIA */}
        <div style={styles.row}>
          {Object.keys(AFFINITY_CATALOG.musica).map(cat => (
            <button 
              key={cat} 
              style={selections.main === cat ? styles.chipActive : styles.chip}
              onClick={() => setSelections({main: cat, sub: "", items: []})}
            >
              {cat.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>

        <hr style={styles.divider} />

        {/* LIVELLO 2: SOTTO-RAMIFICAZIONE */}
        {selections.main && (
          <div style={styles.row}>
            {Object.keys(AFFINITY_CATALOG.musica[selections.main]).map(sub => (
              <button 
                key={sub} 
                style={selections.sub === sub ? styles.chipActive : styles.chip}
                onClick={() => setSelections({...selections, sub: sub, items: []})}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        {/* LIVELLO 3: GLI ARTISTI / COMPOSITORI */}
        {selections.sub && (
          <div style={styles.grid}>
            {AFFINITY_CATALOG.musica[selections.main][selections.sub].map(artist => (
              <div 
                key={artist} 
                style={selections.items.includes(artist) ? styles.boxActive : styles.box}
                onClick={() => handleItemToggle(artist)}
              >
                <span style={styles.gloss}></span>
                {artist}
              </div>
            ))}
          </div>
        )}

        <button style={styles.blueButton} onClick={() => console.log(selections)}>
          <span style={styles.gloss}></span>
          SALVA AFFINITÀ
        </button>
      </div>
    </main>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e0f7ff 0%, #ffffff 100%)', padding: '20px' },
  glassCard: { background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(15px)', padding: '40px', borderRadius: '40px', border: '1px solid white', width: '100%', maxWidth: '800px', textAlign: 'center' },
  title: { fontWeight: '800', color: '#1e293b', marginBottom: '20px' },
  row: { display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '15px' },
  divider: { border: 'none', height: '1px', background: 'rgba(0,0,0,0.05)', margin: '20px 0' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px', marginTop: '20px', marginBottom: '30px' },
  chip: { padding: '10px 20px', borderRadius: '100px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '0.8rem' },
  chipActive: { padding: '10px 20px', borderRadius: '100px', border: '1px solid #3b82f6', background: '#3b82f6', color: 'white', cursor: 'pointer', fontSize: '0.8rem' },
  box: { position: 'relative', padding: '20px', background: 'rgba(255,255,255,0.7)', borderRadius: '20px', border: '1px solid #e2e8f0', cursor: 'pointer', overflow: 'hidden', fontWeight: '600' },
  boxActive: { position: 'relative', padding: '20px', background: '#3b82f6', color: 'white', borderRadius: '20px', border: 'none', cursor: 'pointer', overflow: 'hidden', fontWeight: '600', boxShadow: '0 10px 20px rgba(59,130,246,0.3)' },
  gloss: { position: 'absolute', top: '0', left: '0', width: '100%', height: '40%', background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)', pointerEvents: 'none' },
  blueButton: { width: '100%', padding: '18px', background: 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white', borderRadius: '100px', border: 'none', fontWeight: 'bold', cursor: 'pointer', position: 'relative', overflow: 'hidden' }
};
