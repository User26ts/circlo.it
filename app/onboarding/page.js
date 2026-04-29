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
  const [errorMsg, setErrorMsg] = useState("");
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState(""); 
  const [city, setCity] = useState(""); 
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        if (authError || !session) { router.push("/"); return; }

        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle();

        if (profile) {
          setFirstName(profile.first_name || "");
          setLastName(profile.last_name || "");
          setBirthDate(profile.birth_date || "");
          setCity(profile.city || "");
          setSelected(Array.isArray(profile.affinity_data?.interests) ? profile.affinity_data.interests : []);
        }
      } catch (err) {
        console.error("Errore:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [router]);

  const toggleInteresse = (item) => {
    setSelected(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { error } = await supabase.from('profiles').upsert({
        id: session.user.id,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        birth_date: birthDate,
        city: city,
        affinity_data: { interests: selected },
        updated_at: new Date().toISOString()
      });

      if (error) throw error;
      router.push("/discovery");
    } catch (err) {
      setErrorMsg(err.message || "Errore durante il salvataggio.");
      setSaving(false);
    }
  };

  const isStep1Valid = firstName.trim() !== "" && city !== "" && birthDate !== "";

  if (loading) return <div style={styles.center}>Inizializzazione...</div>;

  return (
    <main style={styles.main}>
      <div style={step === 3 ? styles.cardLarge : styles.card}>
        {errorMsg && <div style={styles.errorBanner}>{errorMsg}</div>}
        
        {/* STEP 1: Dati base */}
        {step === 1 && (
          <div style={styles.content}>
            <h2 style={styles.title}>Chi sei?</h2>
            <p style={styles.subtitle}>Iniziamo dalle presentazioni base.</p>
            
            <form onSubmit={(e) => { e.preventDefault(); if(isStep1Valid) setStep(2); }}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Nome</label>
                <input required style={styles.input} placeholder="Es. Giulia" value={firstName} onChange={e=>setFirstName(e.target.value)} />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Cognome <span style={{fontWeight:'normal', color:'#94a3b8'}}>(opzionale)</span></label>
                <input style={styles.input} placeholder="Es. Rossi" value={lastName} onChange={e=>setLastName(e.target.value)} />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Data di nascita</label>
                <input required style={styles.input} type="date" value={birthDate} onChange={e=>setBirthDate(e.target.value)} max={new Date().toISOString().split("T")[0]} />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Provincia</label>
                <select required style={styles.input} value={city} onChange={e=>setCity(e.target.value)}>
                  <option value="">Seleziona...</option>
                  {PROVINCE_ITALIANE.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <button type="submit" style={{...styles.button, opacity: isStep1Valid ? 1 : 0.5}} disabled={!isStep1Valid}>
                Continua →
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: Filosofia (Il "Pop-up" integrato) */}
        {step === 2 && (
          <div style={{...styles.content, textAlign: 'center', padding: '20px 10px'}}>
            <div style={{fontSize: '60px', marginBottom: '10px'}}>🧬</div>
            <h2 style={{...styles.title, fontSize: '28px', color: '#0f172a'}}>Crea il tuo DNA</h2>
            <p style={{fontSize: '16px', color: '#475569', lineHeight: '1.6', marginBottom: '20px'}}>
              Su Circlo non si scorrono foto infinite. Le connessioni si basano sulle <b>passioni che condividi</b> con l'altra persona.
            </p>
            <div style={{backgroundColor: '#f1f5f9', padding: '15px', borderRadius: '12px', marginBottom: '30px', textAlign: 'left'}}>
              <p style={{margin: '0 0 10px 0', fontSize: '14px', color: '#334155'}}>✨ <b>Sii specifico:</b> Non scegliere solo "Musica", scegli "Shoegaze" o "Techno".</p>
              <p style={{margin: '0 0 10px 0', fontSize: '14px', color: '#334155'}}>🔍 <b>Match migliori:</b> Più tag selezioni, più accurati saranno i profili che ti proporremo.</p>
              <p style={{margin: '0', fontSize: '14px', color: '#334155'}}>🛡️ <b>Privacy:</b> Gli altri vedranno <i>solo</i> i tag che avete in comune.</p>
            </div>
            
            <button onClick={() => setStep(3)} style={styles.button}>Ho capito, creiamo il DNA</button>
            <p style={styles.backLink} onClick={()=>setStep(1)}>← Torna indietro</p>
          </div>
        )}

        {/* STEP 3: Il Catalogo (Nuovo Layout a schede) */}
        {step === 3 && (
          <div style={styles.content}>
            <div style={styles.headerSticky}>
              <h2 style={{...styles.title, margin: 0}}>Il tuo DNA</h2>
              <p style={{fontSize: '13px', color: '#64748b', margin: 0}}>Selezionati: <b>{selected.length}</b></p>
            </div>
            
            <div style={styles.scrollArea}>
              {MEGA_CATALOGO && Object.keys(MEGA_CATALOGO).map(mainCat => (
                <div key={mainCat} style={styles.categoryCard}>
                  <h3 style={styles.mainCatTitle}>{mainCat}</h3>
                  
                  {Object.keys(MEGA_CATALOGO[mainCat]).map(subCat => {
                    const items = MEGA_CATALOGO[mainCat][subCat];
                    return (
                      <div key={subCat} style={styles.subCatBox}>
                        <p style={styles.subCatTitle}>{subCat}</p>
                        <div style={styles.tagGrid}>
                          {Array.isArray(items) && items.map(item => (
                            <button key={item} onClick={()=>toggleInteresse(item)} style={getTagStyle(selected, item)}>
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            
            <div style={styles.footerAction}>
              <button 
                style={{...styles.buttonSave, opacity: selected.length < 3 || saving ? 0.7 : 1}} 
                onClick={handleSave}
                disabled={selected.length < 3 || saving}
              >
                {saving ? "Salvataggio..." : selected.length < 3 ? "Scegli almeno 3 tag" : "Salva e Inizia"}
              </button>
              <p style={styles.backLink} onClick={()=>setStep(2)}>Rileggi le istruzioni</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

const getTagStyle = (selected, item) => {
  const isActive = selected.includes(item);
  return {
    padding: '8px 14px', 
    borderRadius: '20px', 
    fontSize: '13px', 
    fontWeight: '500',
    cursor: 'pointer', 
    border: isActive ? '1px solid #10b981' : '1px solid #e2e8f0', 
    transition: 'all 0.15s ease',
    backgroundColor: isActive ? '#10b981' : '#fff',
    color: isActive ? '#fff' : '#475569',
    boxShadow: isActive ? '0 4px 6px -1px rgba(16, 185, 129, 0.2)' : 'none'
  };
};

const styles = {
  main: { display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh', backgroundColor:'#f8fafc', padding:'15px', fontFamily: 'sans-serif' },
  card: { backgroundColor:'#fff', padding:'30px', borderRadius:'24px', width:'100%', maxWidth:'450px', boxShadow:'0 10px 25px rgba(0,0,0,0.05)' },
  cardLarge: { backgroundColor:'#f8fafc', width:'100%', maxWidth:'600px', display: 'flex', flexDirection: 'column', height: '90vh', borderRadius:'24px', overflow: 'hidden' },
  content: { display:'flex', flexDirection:'column', flex: 1, overflow: 'hidden' },
  headerSticky: { padding: '20px', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '24px 24px 0 0' },
  title: { fontSize:'24px', fontWeight:'800', margin:'0 0 8px 0', color: '#0f172a' },
  subtitle: { fontSize:'14px', color:'#64748b', margin:'0 0 24px 0' },
  errorBanner: { backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' },
  inputGroup: { marginBottom:'16px' },
  label: { fontSize:'13px', fontWeight: '600', color:'#475569', marginBottom:'6px', display: 'block' },
  input: { width:'100%', padding:'12px', borderRadius:'12px', border:'1px solid #cbd5e1', fontSize:'16px', boxSizing: 'border-box', outline: 'none' },
  button: { width: '100%', padding:'14px', backgroundColor:'#3b82f6', color:'#fff', border:'none', borderRadius:'14px', fontWeight:'bold', fontSize: '16px', cursor:'pointer', marginTop: '10px' },
  buttonSave: { width: '100%', padding:'16px', backgroundColor:'#10b981', color:'#fff', border:'none', borderRadius:'14px', fontWeight:'bold', fontSize: '16px', cursor:'pointer', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)' },
  scrollArea: { flex: 1, overflowY:'auto', padding: '15px' },
  categoryCard: { backgroundColor: '#fff', borderRadius: '16px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' },
  mainCatTitle: { fontSize:'18px', fontWeight: '800', color:'#1e293b', margin: '0 0 15px 0' },
  subCatBox: { marginBottom:'20px' },
  subCatTitle: { fontSize:'13px', fontWeight:'700', color:'#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', margin:'0 0 10px 0' },
  tagGrid: { display:'flex', flexWrap:'wrap', gap:'8px' },
  footerAction: { padding: '20px', backgroundColor: '#fff', borderTop: '1px solid #e2e8f0', borderRadius: '0 0 24px 24px' },
  backLink: { textAlign:'center', fontSize:'13px', fontWeight: '600', color:'#94a3b8', marginTop:'16px', cursor:'pointer', transition: 'color 0.2s' },
  center: { display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', color: '#64748b', fontFamily: 'sans-serif', fontWeight: '500' }
};
