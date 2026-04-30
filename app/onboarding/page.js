"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { MEGA_CATALOGO } from "./catalog";

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

const PROVINCE = ["Agrigento", "Alessandria", "Ancona", "Aosta", "Arezzo", "Ascoli Piceno", "Asti", "Avellino", "Bari", "Barletta-Andria-Trani", "Belluno", "Benevento", "Bergamo", "Biella", "Bologna", "Bolzano", "Brescia", "Brindisi", "Cagliari", "Caltanissetta", "Campobasso", "Caserta", "Catania", "Catanzaro", "Chieti", "Como", "Cosenza", "Cremona", "Crotone", "Cuneo", "Enna", "Fermo", "Ferrara", "Firenze", "Foggia", "Forlì-Cesena", "Frosinone", "Genova", "Gorizia", "Grosseto", "Imperia", "Isernia", "La Spezia", "L'Aquila", "Latina", "Lecce", "Lecco", "Livorno", "Lodi", "Lucca", "Macerata", "Mantova", "Massa-Carrara", "Matera", "Messina", "Milano", "Modena", "Monza", "Napoli", "Novara", "Nuoro", "Oristano", "Padova", "Palermo", "Parma", "Pavia", "Perugia", "Pesaro", "Pescara", "Piacenza", "Pisa", "Pistoia", "Pordenone", "Potenza", "Prato", "Ragusa", "Ravenna", "Reggio Calabria", "Reggio Emilia", "Rieti", "Rimini", "Roma", "Rovigo", "Salerno", "Sassari", "Savona", "Siena", "Siracusa", "Sondrio", "Taranto", "Teramo", "Terni", "Torino", "Trapani", "Trento", "Treviso", "Trieste", "Udine", "Varese", "Venezia", "Vercelli", "Verona", "Vibo Valentia", "Vicenza", "Viterbo"];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [firstName, setFirstName] = useState("");
  const [birthDate, setBirthDate] = useState(""); 
  const [city, setCity] = useState(""); 
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push("/");
      const { data: p } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
      if (p) {
        setFirstName(p.first_name || "");
        setBirthDate(p.birth_date || "");
        setCity(p.city || "");
        setSelected(p.affinity_data?.interests || []);
      }
      setLoading(false);
    }
    init();
  }, [router]);

  const toggleTag = (t) => setSelected(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const getAllTags = (obj) => {
    let res = [];
    for (let k in obj) {
      if (Array.isArray(obj[k])) res = [...res, ...obj[k]];
      else if (typeof obj[k] === 'object') res = [...res, ...getAllTags(obj[k])];
    }
    return [...new Set(res)];
  };

  const results = searchTerm.length > 1 ? getAllTags(MEGA_CATALOGO).filter(t => t.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 10) : [];

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { error } = await supabase.from('profiles').upsert({
        id: session.user.id, first_name: firstName, birth_date: birthDate, city,
        affinity_data: { interests: selected }, updated_at: new Date().toISOString()
      });
      if (error) throw error;
      router.push("/discovery");
    } catch (e) {
      alert("Errore al salvataggio: " + e.message);
      setSaving(false);
    }
  };

  const renderDNA = (data, level = 0) => {
    return Object.keys(data).map(key => {
      const val = data[key];
      if (Array.isArray(val)) {
        return (
          <div key={key} style={{ marginBottom: '15px', marginLeft: level * 10 }}>
            <p style={styles.subLabel}>{key}</p>
            <div style={styles.tagGrid}>
              {val.map(t => (
                <button key={t} onClick={() => toggleTag(t)} style={getTagStyle(selected, t)}>{t}</button>
              ))}
            </div>
          </div>
        );
      }
      return (
        <div key={key} style={level === 0 ? styles.folder : { marginLeft: '12px', borderLeft: '1px solid #e2e8f0', paddingLeft: '12px', marginTop: '10px' }}>
          <h3 style={level === 0 ? styles.folderTitle : styles.midTitle}>{key}</h3>
          {renderDNA(val, level + 1)}
        </div>
      );
    });
  };

  if (loading) return <div style={styles.center}>Caricamento profilo...</div>;

  return (
    <main style={styles.main}>
      <div style={step === 3 ? styles.cardLarge : styles.card}>
        {step === 1 && (
          <div style={styles.content}>
            <h2 style={styles.title}>Chi sei?</h2>
            <input style={styles.input} placeholder="Nome" value={firstName} onChange={e=>setFirstName(e.target.value)} />
            <input style={styles.input} type="date" value={birthDate} onChange={e=>setBirthDate(e.target.value)} />
            <select style={styles.input} value={city} onChange={e=>setCity(e.target.value)}>
              <option value="">Provincia</option>
              {PROVINCE.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <button style={styles.button} onClick={() => setStep(2)}>Continua</button>
          </div>
        )}
        {step === 2 && (
          <div style={{...styles.content, textAlign: 'center'}}>
            <h2 style={styles.title}>Circlo 🧬</h2>
            <p style={styles.text}>Nato da studenti per studenti. Trova persone che vibrano sulla tua stessa frequenza.</p>
            <button style={styles.button} onClick={() => setStep(3)}>Componi il tuo DNA</button>
          </div>
        )}
        {step === 3 && (
          <div style={styles.dnaLayout}>
            <div style={styles.searchHeader}>
              <input style={styles.searchInput} placeholder="Cerca passioni..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} />
              {results.length > 0 && (
                <div style={styles.dropdown}>
                  {results.map(r => <div key={r} onClick={()=>{toggleTag(r); setSearchTerm("");}} style={styles.dropItem}>{r}</div>)}
                </div>
              )}
            </div>
            <div style={styles.scrollArea}>
              <div style={styles.badge}>Selezionati: {selected.length}</div>
              {renderDNA(MEGA_CATALOGO)}
            </div>
            <div style={styles.footer}>
              <button style={styles.saveBtn} onClick={handleSave} disabled={selected.length < 3}>{saving ? "Salvataggio..." : "Salva ed Entra"}</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

const getTagStyle = (s, t) => ({
  padding: '8px 12px', borderRadius: '12px', fontSize: '13px', cursor: 'pointer', border: '1px solid #e2e8f0',
  backgroundColor: s.includes(t) ? '#3b82f6' : '#fff', color: s.includes(t) ? '#fff' : '#475569', transition: '0.2s'
});

const styles = {
  main: { display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh', backgroundColor:'#f8fafc', padding:'15px', fontFamily:'sans-serif' },
  card: { backgroundColor:'#fff', padding:'35px', borderRadius:'28px', width:'100%', maxWidth:'420px', boxShadow:'0 15px 35px rgba(0,0,0,0.05)' },
  cardLarge: { backgroundColor:'#fff', borderRadius:'28px', width:'100%', maxWidth:'700px', height:'92vh', display:'flex', flexDirection:'column', overflow:'hidden' },
  content: { display:'flex', flexDirection:'column', gap:'20px' },
  title: { fontSize:'26px', fontWeight:'900', textAlign:'center' },
  text: { color:'#64748b', lineHeight:'1.7', textAlign: 'center' },
  input: { padding:'14px', borderRadius:'14px', border:'1px solid #cbd5e1', outline: 'none' },
  button: { padding:'16px', backgroundColor:'#1e293b', color:'#fff', border:'none', borderRadius:'14px', fontWeight:'bold', cursor:'pointer' },
  dnaLayout: { display:'flex', flexDirection:'column', height:'100%' },
  searchHeader: { padding:'20px', borderBottom:'1px solid #f1f5f9', position:'relative' },
  searchInput: { width:'100%', padding:'14px', borderRadius:'14px', border:'2px solid #e2e8f0', boxSizing:'border-box', outline:'none' },
  dropdown: { position:'absolute', top:'80px', left:'20px', right:'20px', backgroundColor:'#fff', zIndex:100, borderRadius:'16px', boxShadow:'0 10px 25px rgba(0,0,0,0.1)' },
  dropItem: { padding:'14px', borderBottom:'1px solid #f8fafc', cursor:'pointer' },
  scrollArea: { flex:1, overflowY:'auto', padding:'25px' },
  badge: { backgroundColor: '#3b82f6', color: '#fff', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', display: 'inline-block', marginBottom: '20px' },
  folder: { backgroundColor:'#fff', padding:'25px', borderRadius:'24px', marginBottom:'25px', border:'1px solid #f1f5f9' },
  folderTitle: { fontSize:'22px', fontWeight:'800', marginBottom:'15px', color:'#1e293b' },
  midTitle: { fontSize:'14px', fontWeight:'800', color:'#475569', marginTop:'15px', textTransform:'uppercase' },
  subLabel: { fontSize:'12px', color:'#94a3b8', fontWeight:'bold', marginBottom:'10px' },
  tagGrid: { display:'flex', flexWrap:'wrap', gap:'10px' },
  footer: { padding:'20px', borderTop:'1px solid #f1f5f9' },
  saveBtn: { width:'100%', padding:'18px', backgroundColor:'#10b981', color:'#fff', border:'none', borderRadius:'16px', fontWeight:'bold', cursor:'pointer' },
  center: { display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', color:'#64748b' }
};
