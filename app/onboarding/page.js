
"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

// --- IL CATALOGO È ORA INTEGRATO DIRETTAMENTE QUI ---
const AFFINITY_CATALOG = {
  musica: {
    classica: {
      barocca: ["Bach", "Vivaldi", "Handel", "Scarlatti", "Corelli", "Purcell", "Monteverdi"],
      romantica: ["Chopin", "Rachmaninov", "Liszt", "Beethoven", "Schubert", "Brahms", "Tchaikovsky"],
      moderna: ["Stravinsky", "Debussy", "Ravel", "Mahler", "Shostakovich"],
      minimalista: ["Einaudi", "Max Richter", "Philip Glass", "Jóhannsson"]
    },
    contemporanea: {
      trap_it: ["Sfera Ebbasta", "Lazza", "Marracash", "Guè", "Tedua", "Tony Effe", "Anna", "Shiva"],
      urban_usa: ["Travis Scott", "Drake", "Kendrick Lamar", "Kanye West", "Playboi Carti"],
      pop: ["Taylor Swift", "Ariana Grande", "The Weeknd", "Harry Styles", "Billie Eilish", "Lana Del Rey"]
    }
  },
  scienze: {
    pure: ["Matematica Pura", "Fisica Teorica", "Astrofisica", "Chimica Organica", "Biologia Molecolare"],
    applicate: ["Robotica", "AI/Informatica", "Meccanica", "Aerospaziale", "Bioingegneria"]
  },
  cultura: {
    filosofia: ["Stoicismo", "Esistenzialismo", "Nichilismo", "Idealismo", "Epicureismo", "Nietzsche", "Camus"],
    hobby: ["Fotografia", "Pittura", "Gaming", "Scrittura", "Coding", "Vini Naturali", "Cucinare"]
  },
  sport: {
    outdoor: ["Arrampicata", "Surf", "Skate", "Snowboard", "Trekking"],
    classici: ["Tennis", "Padel", "Basket", "Calcio", "Nuoto", "Yoga", "Palestra"]
  }
};

// --- CONFIGURAZIONE SUPABASE ---
const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Dati Utente
  const [firstName, setFirstName] = useState("");
  const [city, setCity] = useState("");
  const [mainCat, setMainCat] = useState(Object.keys(AFFINITY_CATALOG)[0]);
  const [subCat, setSubCat] = useState("");
  const [selected, setSelected] = useState([]);

  const toggleItem = (item) => {
    setSelected(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const handleFinish = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.from('profiles').update({
        first_name: firstName,
        city: city,
        affinity_data: { interests: selected }
      }).eq('id', user.id);
      
      if (!error) router.push("/dashboard");
      else console.error("Errore salvataggio:", error);
    }
    setLoading(false);
  };

  return (
    <main style={styles.container}>
      <div style={styles.aurora}></div>
      <div style={styles.glassCard}>
        
        {step === 1 ? (
          <div>
            <h1 style={styles.title}>Le tue Coordinate</h1>
            <p style={styles.subtitle}>Come ti chiami e dove studi?</p>
            <input style={styles.input} placeholder="Il tuo nome (es. Marco)" onChange={(e) => setFirstName(e.target.value)} />
            <input style={styles.input} placeholder="Città (es. Treviso)" onChange={(e) => setCity(e.target.value)} />
            <button style={styles.btnNext} onClick={() => setStep(2)}>PROSEGUI</button>
          </div>
        ) : (
          <div>
            <h1 style={styles.title}>DNA Digitale</h1>
            <div style={styles.nav}>
              {Object.keys(AFFINITY_CATALOG).map(cat => (
                <button key={cat} style={mainCat === cat ? styles.navBtnActive : styles.navBtn} onClick={() => {setMainCat(cat); setSubCat("");}}>
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
            <div style={styles.subNav}>
              {Object.keys(AFFINITY_CATALOG[mainCat]).map(sub => (
                <button key={sub} style={subCat === sub ? styles.subBtnActive : styles.subBtn} onClick={() => setSubCat(sub)}>
                  {sub}
                </button>
              ))}
            </div>
            <div style={styles.grid}>
              {subCat && AFFINITY_CATALOG[mainCat][subCat].map(item => (
                <div key={item} style={selected.includes(item) ? styles.itemActive : styles.item} onClick={() => toggleItem(item)}>
                  <span style={styles.gloss}></span>
                  {item}
                </div>
              ))}
            </div>
            <button style={styles.btnSave} onClick={handleFinish} disabled={loading}>
              {loading ? "SALVATAGGIO..." : `CONFERMA (${selected.length} SCELTE)`}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e0f2fe', position: 'relative', overflow: 'hidden', fontFamily: 'sans-serif' },
  aurora: { position: 'absolute', width: '100%', height: '100%', background: 'radial-gradient(circle at 10% 10%, #bae6fd 0%, transparent 50%)', filter: 'blur(80px)', zIndex: 0 },
  glassCard: { zIndex: 1, background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(20px)', borderRadius: '40px', padding: '40px', width: '100%', maxWidth: '800px', border: '1px solid white', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', textAlign: 'center' },
  title: { fontSize: '2rem', fontWeight: '800', color: '#1e293b', marginBottom: '10px' },
  subtitle: { color: '#64748b', marginBottom: '25px' },
  input: { width: '100%', padding: '15px', borderRadius: '15px', border: '1px solid #cbd5e1', marginBottom: '15px', outline: 'none' },
  nav: { display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' },
  navBtn: { padding: '10px 18px', borderRadius: '100px', border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer', fontSize: '0.8rem' },
  navBtnActive: { padding: '10px 18px', borderRadius: '100px', border: 'none', background: '#3b82f6', color: 'white', fontWeight: 'bold' },
  subNav: { display: 'flex', gap: '5px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '25px' },
  subBtn: { padding: '6px 12px', borderRadius: '100px', border: '1px solid #e2e8f0', cursor: 'pointer', fontSize: '0.75rem' },
  subBtnActive: { padding: '6px 12px', borderRadius: '100px', border: '1px solid #3b82f6', color: '#3b82f6', background: 'white', fontWeight: 'bold' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px', maxHeight: '300px', overflowY: 'auto', padding: '10px' },
  item: { position: 'relative', padding: '15px', background: 'white', borderRadius: '15px', border: '1px solid #e2e8f0', cursor: 'pointer', overflow: 'hidden' },
  itemActive: { position: 'relative', padding: '15px', background: '#3b82f6', color: 'white', borderRadius: '15px', border: 'none', fontWeight: 'bold' },
  gloss: { position: 'absolute', top: 0, left: 0, width: '100%', height: '40%', background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)' },
  btnNext: { width: '100%', padding: '15px', borderRadius: '100px', border: 'none', background: '#3b82f6', color: 'white', fontWeight: 'bold', cursor: 'pointer' },
  btnSave: { marginTop: '20px', width: '100%', padding: '18px', borderRadius: '100px', border: 'none', background: '#10b981', color: 'white', fontWeight: 'bold', cursor: 'pointer' }
};
