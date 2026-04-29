
"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
// Importiamo il catalogo dal file esterno che hai creato
import { MEGA_CATALOGO } from "./catalog";

// Sostituisci con le tue chiavi reali
const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Dati Profilo
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [selected, setSelected] = useState([]);

  // Navigazione Catalogo
  const [mainCat, setMainCat] = useState("musica");
  const [subCat, setSubCat] = useState(Object.keys(MEGA_CATALOGO.musica)[0]);
  const [leafCat, setLeafCat] = useState(null);

  // 1. Caricamento dati iniziali
  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (profile) {
          setFirstName(profile.first_name || "");
          setLastName(profile.last_name || "");
          setCity(profile.city || "");
          setGender(profile.gender || "");
          setBirthDate(profile.birth_date || "");
          setSelected(profile.affinity_data?.interests || []);
        }
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  // 2. Funzione intelligente per estrarre gli elementi dal catalogo senza crash
  const getDisplayItems = () => {
    try {
      const currentMain = MEGA_CATALOGO[mainCat];
      if (!currentMain) return [];
      if (Array.isArray(currentMain)) {
        return searchTerm ? currentMain.filter(i => i.toLowerCase().includes(searchTerm.toLowerCase())) : currentMain;
      }

      const currentSub = currentMain[subCat];
      if (!currentSub) return [];

      let finalArray = [];
      if (Array.isArray(currentSub)) {
        finalArray = currentSub;
      } else if (typeof currentSub === 'object') {
        finalArray = leafCat ? (currentSub[leafCat] || []) : Object.values(currentSub).flat();
      }

      if (searchTerm) {
        return finalArray.filter(i => i.toLowerCase().includes(searchTerm.toLowerCase()));
      }
      return finalArray;
    } catch (e) {
      return [];
    }
  };

  const toggle = (item) => {
    setSelected(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const handleSave = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Sessione scaduta, effettua il login.");

    const { error } = await supabase.from('profiles').update({
      first_name: firstName,
      last_name: lastName,
      city: city.trim().toLowerCase(),
      gender: gender,
      birth_date: birthDate || null,
      affinity_data: { interests: selected }
    }).eq('id', user.id);

    if (!error) {
      router.push("/dashboard");
    } else {
      alert("Errore nel salvataggio: " + error.message);
    }
    setLoading(false);
  };

  if (loading) return <div style={styles.loading}>Caricamento DNA Circlo...</div>;

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        
        {step === 1 ? (
          <div>
            <h2 style={styles.title}>Il tuo Profilo</h2>
            <div style={styles.formGrid}>
              <input style={styles.input} placeholder="Nome" value={firstName} onChange={e=>setFirstName(e.target.value)} />
              <input style={styles.input} placeholder="Cognome" value={lastName} onChange={e=>setLastName(e.target.value)} />
              <select style={styles.input} value={gender} onChange={e=>setGender(e.target.value)}>
                <option value="">Genere</option>
                <option value="M">Uomo</option>
                <option value="F">Donna</option>
                <option value="NB">Non-Binary</option>
              </select>
              <input type="date" style={styles.input} value={birthDate} onChange={e=>setBirthDate(e.target.value)} />
              <input style={{...styles.input, gridColumn: '1/-1'}} placeholder="Città" value={city} onChange={e=>setCity(e.target.value)} />
            </div>
            <button style={styles.btnNext} onClick={()=>setStep(2)}>PROSEGUI AL DNA →</button>
          </div>
        ) : (
          <div>
            <div style={styles.header}>
              <button style={styles.btnBack} onClick={()=>setStep(1)}>← DATI</button>
              <div style={styles.badge}>{selected.length} INTERESSI</div>
              <button style={styles.btnSaveSmall} onClick={handleSave}>SALVA</button>
            </div>

            {/* Menu Macro Categorie */}
            <div style={styles.scrollRow}>
              {Object.keys(MEGA_CATALOGO).map(cat => (
                <button key={cat} onClick={()=>{
                  setMainCat(cat);
                  setSubCat(Object.keys(MEGA_CATALOGO[cat])[0]);
                  setLeafCat(null);
                  setSearchTerm("");
                }} style={mainCat === cat ? styles.pillActive : styles.pill}>
                  {cat.replace('_', ' ').toUpperCase()}
                </button>
              ))}
            </div>

            {/* Menu Sotto Categorie (se esistono) */}
            {typeof MEGA_CATALOGO[mainCat] === 'object' && !Array.isArray(MEGA_CATALOGO[mainCat]) && (
              <div style={styles.scrollRow}>
                {Object.keys(MEGA_CATALOGO[mainCat]).map(sub => (
                  <button key={sub} onClick={()=>{setSubCat(sub); setLeafCat(null); setSearchTerm("");}} 
                  style={subCat === sub ? styles.subActive : styles.sub}>{sub}</button>
                ))}
              </div>
            )}

            {/* Menu Terzo Livello (es. Generi vs Artisti) */}
            {MEGA_CATALOGO[mainCat][subCat] && typeof MEGA_CATALOGO[mainCat][subCat] === 'object' && !Array.isArray(MEGA_CATALOGO[mainCat][subCat]) && (
              <div style={styles.scrollRow}>
                {Object.keys(MEGA_CATALOGO[mainCat][subCat]).map(leaf => (
                  <button key={leaf} onClick={()=>setLeafCat(leaf)} 
                  style={leafCat === leaf ? styles.leafActive : styles.leaf}>{leaf.toUpperCase()}</button>
                ))}
              </div>
            )}

            <input 
              style={styles.searchInput} 
              placeholder={`Cerca in ${leafCat || subCat || mainCat}...`} 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />

            <div style={styles.grid}>
              {getDisplayItems().map(item => (
                <div key={item} onClick={()=>toggle(item)} 
                style={selected.includes(item) ? styles.itemActive : styles.item}>{item}</div>
              ))}
            </div>

            <button style={styles.btnFinal} onClick={handleSave} disabled={loading}>
              {loading ? "SALVATAGGIO..." : "CONCLUDI E TROVA AFFINITÀ"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

const styles = {
  main: { minHeight: '100vh', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'sans-serif' },
  card: { background: 'white', padding: '25px', borderRadius: '24px', width: '100%', maxWidth: '750px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' },
  title: { textAlign: 'center', marginBottom: '20px', fontSize: '22px', fontWeight: 'bold' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' },
  input: { padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px' },
  btnNext: { width: '100%', padding: '16px', borderRadius: '12px', border: 'none', background: '#1e293b', color: 'white', fontWeight: 'bold', cursor: 'pointer' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  btnBack: { background: 'none', border: 'none', color: '#3b82f6', fontWeight: 'bold', cursor: 'pointer' },
  badge: { background: '#f1f5f9', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  btnSaveSmall: { background: '#10b981', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' },
  scrollRow: { display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '10px' },
  pill: { padding: '8px 16px', borderRadius: '20px', border: '1px solid #e2e8f0', background: 'white', whiteSpace: 'nowrap', fontSize: '12px', cursor: 'pointer' },
  pillActive: { padding: '8px 16px', borderRadius: '20px', border: 'none', background: '#3b82f6', color: 'white', fontWeight: 'bold', whiteSpace: 'nowrap', fontSize: '12px' },
  sub: { padding: '6px 12px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', whiteSpace: 'nowrap', fontSize: '11px', cursor: 'pointer' },
  subActive: { padding: '6px 12px', borderRadius: '8px', background: '#64748b', color: 'white', border: 'none', whiteSpace: 'nowrap', fontSize: '11px' },
  leaf: { padding: '4px 8px', borderRadius: '4px', border: 'none', background: '#e2e8f0', fontSize: '10px', cursor: 'pointer' },
  leafActive: { padding: '4px 8px', borderRadius: '4px', background: '#1e293b', color: 'white', fontSize: '10px' },
  searchInput: { width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #3b82f6', marginBottom: '12px', outline: 'none' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px', maxHeight: '300px', overflowY: 'auto', padding: '10px', background: '#f8fafc', borderRadius: '15px' },
  item: { padding: '10px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', textAlign: 'center', fontSize: '11px', cursor: 'pointer' },
  itemActive: { padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', textAlign: 'center', fontSize: '11px', fontWeight: 'bold' },
  btnFinal: { width: '100%', padding: '16px', borderRadius: '100px', border: 'none', background: '#10b981', color: 'white', fontWeight: 'bold', marginTop: '20px', cursor: 'pointer' },
  loading: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }
};
