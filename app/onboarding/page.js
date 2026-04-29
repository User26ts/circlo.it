"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { MEGA_CATALOGO } from "./catalog";

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

const PROVINCE_ITALIANE = ["Agrigento", "Alessandria", "Ancona", "Aosta", "Arezzo", "Ascoli Piceno", "Asti", "Avellino", "Bari", "Barletta-Andria-Trani", "Belluno", "Benevento", "Bergamo", "Biella", "Bologna", "Bolzano", "Brescia", "Brindisi", "Cagliari", "Caltanissetta", "Campobasso", "Carbonia-Iglesias", "Caserta", "Catania", "Catanzaro", "Chieti", "Como", "Cosenza", "Cremona", "Crotone", "Cuneo", "Enna", "Fermo", "Ferrara", "Firenze", "Foggia", "Forlì-Cesena", "Frosinone", "Genova", "Gorizia", "Grosseto", "Imperia", "Isernia", "La Spezia", "L'Aquila", "Latina", "Lecce", "Lecco", "Livorno", "Lodi", "Lucca", "Macerata", "Mantova", "Massa-Carrara", "Matera", "Messina", "Milano", "Modena", "Monza e della Brianza", "Napoli", "Novara", "Nuoro", "Olbia-Tempio", "Oristano", "Padova", "Palermo", "Parma", "Pavia", "Perugia", "Pesaro e Urbino", "Pescara", "Piacenza", "Pisa", "Pistoia", "Pordenone", "Potenza", "Prato", "Ragusa", "Ravenna", "Reggio Calabria", "Reggio Emilia", "Rieti", "Rimini", "Roma", "Rovigo", "Salerno", "Medio Campidano", "Sassari", "Savona", "Siena", "Siracusa", "Sondrio", "Taranto", "Teramo", "Terni", "Torino", "Ogliastra", "Trapani", "Trento", "Treviso", "Trieste", "Udine", "Varese", "Venezia", "Verbano-Cusio-Ossola", "Vercelli", "Verona", "Vibo Valentia", "Vicenza", "Viterbo"];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Dati profilo
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState(""); 
  const [city, setCity] = useState(""); 
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { router.push("/"); return; }
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
        if (profile) {
          setFirstName(profile.first_name || "");
          setLastName(profile.last_name || "");
          setBirthDate(profile.birth_date || "");
          setCity(profile.city || "");
          setSelected(Array.isArray(profile.affinity_data?.interests) ? profile.affinity_data.interests : []);
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    }
    loadProfile();
  }, [router]);

  // --- LOGICA RICORSIVA PER TAG E RICERCA ---
  const toggleTag = (tag) => {
    setSelected(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const getAllTags = (obj) => {
    let tags = [];
    for (let key in obj) {
      if (Array.isArray(obj[key])) { tags = [...tags, ...obj[key]]; }
      else if (typeof obj[key] === 'object') { tags = [...tags, ...getAllTags(obj[key])]; }
    }
    return [...new Set(tags)];
  };

  const allAvailableTags = getAllTags(MEGA_CATALOGO);
  const searchResults = searchTerm.length > 1 
    ? allAvailableTags.filter(t => t.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 10)
    : [];

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await supabase.from('profiles').upsert({
        id: session.user.id,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        birth_date: birthDate,
        city: city,
        affinity_data: { interests: selected },
        updated_at: new Date().toISOString()
      });
      router.push("/discovery");
    } catch (err) { alert("Errore al salvataggio"); setSaving(false); }
  };

  // --- FUNZIONE DI RENDERING RICORSIVO (IL CUORE DEL CATALOGO) ---
  const renderDNA = (data, level = 0) => {
    return Object.keys(data).map(key => {
      const value = data[key];
      if (Array.isArray(value)) {
        return (
          <div key={key} style={{ marginBottom: '20px', marginLeft: level > 0 ? '15px' : '0' }}>
            <p style={styles.subCatTitle}>{key}</p>
            <div style={styles.tagGrid}>
              {value.map(tag => (
                <button key={tag} onClick={() => toggleTag(tag)} style={getTagStyle(selected, tag)}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        );
      }
      return (
        <div key={key} style={{ marginBottom: '30px', borderLeft: level > 0 ? '2px solid #e2e8f0' : 'none', paddingLeft: level > 0 ? '15px' : '0' }}>
          <h3 style={level === 0 ? styles.mainCatTitle : styles.midCatTitle}>
            {level === 0 ? key : `↳ ${key}`}
          </h3>
          {renderDNA(value, level + 1)}
        </div>
      );
    });
  };

  if (loading) return <div style={styles.center}>Caricamento DNA...</div>;

  return (
    <main style={styles.main}>
      <div style={step === 3 ? styles.cardLarge : styles.card}>
        
        {step === 1 && (
          <div style={styles.content}>
            <h2 style={styles.title}>Benvenuto</h2>
            <input style={styles.input} placeholder="Nome" value={firstName} onChange={e=>setFirstName(e.target.value)} />
            <input style={styles.input} type="date" value={birthDate} onChange={e=>setBirthDate(e.target.value)} />
            <select style={styles.input} value={city} onChange={e=>setCity(e.target.value)}>
              <option value="">Provincia</option>
              {PROVINCE_ITALIANE.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <button style={styles.button} onClick={() => setStep(2)}>Continua</button>
          </div>
        )}

        {step === 2 && (
          <div style={{...styles.content, textAlign: 'center'}}>
            <div style={{fontSize: '50px'}}>🧬</div>
            <h2 style={styles.title}>La filosofia di Circlo</h2>
            <p style={styles.text}>Siamo studenti come te. Qui i match nascono dalle passioni, non dal caso. Sii specifico!</p>
            <button style={styles.button} onClick={() => setStep(3)}>Componi il tuo DNA</button>
          </div>
        )}

        {step === 3 && (
          <div style={styles.dnaContainer}>
            <div style={styles.searchBox}>
              <input 
                style={styles.searchInput} 
                placeholder="Cerca un artista, un piatto, un autore..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              {searchResults.length > 0 && (
                <div style={styles.searchDropdown}>
                  {searchResults.map(t => (
                    <div key={t} onClick={() => {toggleTag(t); setSearchTerm("");}} style={styles.searchItem}>
                      {t} {selected.includes(t) ? "✅" : "+"}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={styles.scrollArea}>
              <div style={styles.selectionSummary}>
                Selezionati: <b>{selected.length}</b>
                <div style={styles.miniTagGrid}>
                  {selected.slice(-5).map(s => <span key={s} style={styles.miniTag}>{s}</span>)}
                </div>
              </div>
              {renderDNA(MEGA_CATALOGO)}
            </div>

            <div style={styles.footer}>
              <button style={styles.buttonSave} onClick={handleSave} disabled={saving}>
                {saving ? "Salvataggio..." : "Salva e Inizia"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

const getTagStyle = (selected, tag) => ({
  padding: '8px 14px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer', border: '1px solid #e2e8f0',
  backgroundColor: selected.includes(tag) ? '#10b981' : '#fff',
  color: selected.includes(tag) ? '#fff' : '#475569', transition: '0.2s'
});

const styles = {
  main: { display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh', backgroundColor:'#f1f5f9', padding:'15px', fontFamily: 'sans-serif' },
  card: { backgroundColor:'#fff', padding:'30px', borderRadius:'24px', width:'100%', maxWidth:'400px', boxShadow:'0 10px 25px rgba(0,0,0,0.05)' },
  cardLarge: { backgroundColor:'#fff', borderRadius:'24px', width:'100%', maxWidth:'600px', height: '90vh', display:'flex', flexDirection:'column', overflow:'hidden' },
  content: { display:'flex', flexDirection:'column', gap: '15px' },
  title: { fontSize:'24px', fontWeight:'800', textAlign:'center' },
  text: { color: '#64748b', lineHeight: '1.5' },
  input: { padding:'12px', borderRadius:'12px', border:'1px solid #cbd5e1' },
  button: { padding:'14px', backgroundColor:'#3b82f6', color:'#fff', border:'none', borderRadius:'12px', fontWeight:'bold', cursor:'pointer' },
  dnaContainer: { display:'flex', flexDirection:'column', height:'100%' },
  searchBox: { padding: '20px', borderBottom: '1px solid #f1f5f9', position: 'relative' },
  searchInput: { width:'100%', padding:'12px', borderRadius:'10px', border:'2px solid #3b82f6', boxSizing:'border-box' },
  searchDropdown: { position:'absolute', top:'70px', left:'20px', right:'20px', backgroundColor:'#fff', zIndex:100, borderRadius:'10px', boxShadow:'0 10px 20px rgba(0,0,0,0.1)' },
  searchItem: { padding:'12px', borderBottom:'1px solid #f8fafc', cursor:'pointer' },
  scrollArea: { flex:1, overflowY:'auto', padding:'20px' },
  selectionSummary: { marginBottom:'20px', padding:'15px', backgroundColor:'#f8fafc', borderRadius:'12px' },
  miniTagGrid: { display:'flex', gap:'5px', marginTop:'8px', flexWrap:'wrap' },
  miniTag: { fontSize:'10px', background:'#e2e8f0', padding:'2px 8px', borderRadius:'5px' },
  mainCatTitle: { fontSize:'20px', fontWeight:'800', color:'#1e293b', marginBottom:'15px' },
  midCatTitle: { fontSize:'15px', fontWeight:'700', color:'#64748b', textTransform:'uppercase', marginBottom:'10px' },
  subCatTitle: { fontSize:'13px', color:'#94a3b8', fontWeight:'bold', marginBottom:'8px' },
  tagGrid: { display:'flex', flexWrap:'wrap', gap:'8px' },
  footer: { padding:'20px', borderTop:'1px solid #f1f5f9' },
  buttonSave: { width:'100%', padding:'16px', backgroundColor:'#10b981', color:'#fff', border:'none', borderRadius:'12px', fontWeight:'bold', cursor:'pointer' },
  center: { display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', color:'#64748b' }
};
