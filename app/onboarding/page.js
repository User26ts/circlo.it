"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { MEGA_CATALOGO } from "./catalog";

// Inizializzazione esterna per evitare warning "Multiple instances"
const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

const PROVINCE_ITALIANE = ["Agrigento", "Alessandria", "Ancona", "Aosta", "Arezzo", "Ascoli Piceno", "Asti", "Avellino", "Bari", "Barletta-Andria-Trani", "Belluno", "Benevento", "Bergamo", "Biella", "Bologna", "Bolzano", "Brescia", "Brindisi", "Cagliari", "Caltanissetta", "Campobasso", "Carbonia-Iglesias", "Caserta", "Catania", "Catanzaro", "Chieti", "Como", "Cosenza", "Cremona", "Crotone", "Cuneo", "Enna", "Fermo", "Ferrara", "Firenze", "Foggia", "Forlì-Cesena", "Frosinone", "Genova", "Gorizia", "Grosseto", "Imperia", "Isernia", "La Spezia", "L'Aquila", "Latina", "Lecce", "Lecco", "Livorno", "Lodi", "Lucca", "Macerata", "Mantova", "Massa-Carrara", "Matera", "Messina", "Milano", "Modena", "Monza e della Brianza", "Napoli", "Novara", "Nuoro", "Olbia-Tempio", "Oristano", "Padova", "Palermo", "Parma", "Pavia", "Perugia", "Pesaro e Urbino", "Pescara", "Piacenza", "Pisa", "Pistoia", "Pordenone", "Potenza", "Prato", "Ragusa", "Ravenna", "Reggio Calabria", "Reggio Emilia", "Rieti", "Rimini", "Roma", "Rovigo", "Salerno", "Medio Campidano", "Sassari", "Savona", "Siena", "Siracusa", "Sondrio", "Taranto", "Teramo", "Terni", "Torino", "Ogliastra", "Trapani", "Trento", "Treviso", "Trieste", "Udine", "Varese", "Venezia", "Verbano-Cusio-Ossola", "Vercelli", "Verona", "Vibo Valentia", "Vicenza", "Viterbo"];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Stati del form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState(""); 
  const [city, setCity] = useState(""); 
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        
        if (authError || !session) {
          router.push("/");
          return;
        }

        const { data: profile, error: dbError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (dbError) throw dbError;

        if (profile) {
          setFirstName(profile.first_name || "");
          setLastName(profile.last_name || "");
          setBirthDate(profile.birth_date || "");
          setCity(profile.city || "");
          // Controllo paranoico per evitare crash se i dati nel DB sono corrotti
          setSelected(Array.isArray(profile.affinity_data?.interests) ? profile.affinity_data.interests : []);
        }
      } catch (err) {
        console.error("Errore nel caricamento del profilo:", err);
        setErrorMsg("Non siamo riusciti a caricare i tuoi dati. Riprova più tardi.");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [router]);

  const toggleInteresse = (item) => {
    setSelected(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg("");
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Utente non autenticato");

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
      console.error("Errore salvataggio:", err);
      setErrorMsg(err.message || "Si è verificato un errore durante il salvataggio.");
      setSaving(false);
    }
  };

  // Funzione di utilità per capire se lo step 1 è completo
  const isStep1Valid = firstName.trim() !== "" && city !== "" && birthDate !== "";

  if (loading) return <div style={styles.center}>Caricamento in corso...</div>;

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        {errorMsg && <div style={styles.errorBanner}>{errorMsg}</div>}
        
        {step === 1 ? (
          <div style={styles.content}>
            <h2 style={styles.title}>Benvenuto su Circlo</h2>
            <p style={styles.subtitle}>Iniziamo dalle basi.</p>
            
            <form onSubmit={(e) => { e.preventDefault(); if(isStep1Valid) setStep(2); }}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Nome *</label>
                <input required style={styles.input} placeholder="Il tuo nome" value={firstName} onChange={e=>setFirstName(e.target.value)} />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>Cognome</label>
                <input style={styles.input} placeholder="Il tuo cognome" value={lastName} onChange={e=>setLastName(e.target.value)} />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Data di nascita *</label>
                <input required style={styles.input} type="date" value={birthDate} onChange={e=>setBirthDate(e.target.value)} max={new Date().toISOString().split("T")[0]} />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Provincia *</label>
                <select required style={styles.input} value={city} onChange={e=>setCity(e.target.value)}>
                  <option value="">Seleziona Provincia</option>
                  {PROVINCE_ITALIANE.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <button 
                type="submit"
                style={{...styles.button, opacity: isStep1Valid ? 1 : 0.5}} 
                disabled={!isStep1Valid}
              >
                Configura DNA →
              </button>
            </form>
          </div>
        ) : (
          <div style={styles.content}>
            <h2 style={styles.title}>Il tuo DNA</h2>
            <p style={styles.subtitle}>Scegli con cura le tue passioni.</p>
            
            <div style={styles.scrollArea}>
              {MEGA_CATALOGO && Object.keys(MEGA_CATALOGO).map(mainCat => (
                <div key={mainCat} style={{marginBottom:'24px'}}>
                  <h3 style={styles.mainCatTitle}>{mainCat.replace(/_/g, ' ')}</h3>
                  
                  {MEGA_CATALOGO[mainCat] && typeof MEGA_CATALOGO[mainCat] === 'object' && Object.keys(MEGA_CATALOGO[mainCat]).map(subCat => {
                    const data = MEGA_CATALOGO[mainCat][subCat];
                    return (
                      <div key={subCat} style={styles.subCatBox}>
                        <p style={styles.subCatTitle}>{subCat}</p>
                        
                        {/* Controllo se è un array finale o un ulteriore sotto-oggetto */}
                        {Array.isArray(data) ? (
                          <div style={styles.tagGrid}>
                            {data.map(item => (
                              <button key={item} onClick={()=>toggleInteresse(item)} style={getTagStyle(selected, item)}>
                                {item}
                              </button>
                            ))}
                          </div>
                        ) : (
                          data && typeof data === 'object' && Object.keys(data).map(deepKey => (
                            <div key={deepKey} style={{marginTop:'8px', marginBottom: '8px'}}>
                              <span style={styles.deepKeyLabel}>{deepKey}:</span>
                              <div style={styles.tagGrid}>
                                {Array.isArray(data[deepKey]) && data[deepKey].map(item => (
                                  <button key={item} onClick={()=>toggleInteresse(item)} style={getTagStyle(selected, item)}>
                                    {item}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            
            <button 
              style={{...styles.buttonSave, opacity: saving ? 0.7 : 1}} 
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Salvataggio..." : "Salva e Inizia"}
            </button>
            <p style={styles.backLink} onClick={()=>setStep(1)}>← Modifica Dati Personali</p>
          </div>
        )}
      </div>
    </main>
  );
}

// Stili dinamici per i Tag
const getTagStyle = (selected, item) => {
  const isActive = selected.includes(item);
  return {
    padding: '6px 12px', 
    borderRadius: '20px', 
    fontSize: '13px', 
    fontWeight: '500',
    cursor: 'pointer', 
    border: isActive ? '1px solid #3b82f6' : '1px solid #e2e8f0', 
    transition: 'all 0.2s ease',
    backgroundColor: isActive ? '#3b82f6' : '#f8fafc',
    color: isActive ? '#fff' : '#475569'
  };
};

const styles = {
  main: { display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh', backgroundColor:'#f1f5f9', padding:'20px', fontFamily: 'sans-serif' },
  card: { backgroundColor:'#fff', padding:'32px', borderRadius:'24px', width:'100%', maxWidth:'480px', boxShadow:'0 10px 25px rgba(0,0,0,0.05)' },
  content: { display:'flex', flexDirection:'column' },
  title: { fontSize:'24px', fontWeight:'800', textAlign:'center', margin:'0 0 8px 0', color: '#0f172a' },
  subtitle: { fontSize:'14px', textAlign:'center', color:'#64748b', margin:'0 0 24px 0' },
  errorBanner: { backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' },
  inputGroup: { marginBottom:'16px' },
  label: { fontSize:'13px', fontWeight: '600', color:'#475569', marginBottom:'6px', display: 'block' },
  input: { width:'100%', padding:'12px', borderRadius:'12px', border:'1px solid #cbd5e1', fontSize:'16px', boxSizing: 'border-box', outline: 'none' },
  button: { width: '100%', padding:'14px', backgroundColor:'#3b82f6', color:'#fff', border:'none', borderRadius:'12px', fontWeight:'bold', fontSize: '16px', cursor:'pointer', marginTop: '10px' },
  scrollArea: { maxHeight:'450px', overflowY:'auto', paddingRight:'10px', marginBottom: '20px' },
  mainCatTitle: { fontSize:'15px', fontWeight: '700', color:'#94a3b8', textTransform:'uppercase', borderBottom:'1px solid #e2e8f0', paddingBottom:'8px', marginBottom: '12px' },
  subCatBox: { marginLeft:'12px', marginBottom:'20px', paddingLeft:'12px', borderLeft:'2px solid #f1f5f9' },
  subCatTitle: { fontSize:'14px', fontWeight:'bold', color:'#334155', margin:'0 0 10px 0' },
  deepKeyLabel: { fontSize:'11px', fontWeight: '600', color:'#94a3b8', textTransform:'uppercase', display: 'block', marginBottom: '6px' },
  tagGrid: { display:'flex', flexWrap:'wrap', gap:'8px' },
  buttonSave: { width: '100%', padding:'14px', backgroundColor:'#10b981', color:'#fff', border:'none', borderRadius:'12px', fontWeight:'bold', fontSize: '16px', cursor:'pointer' },
  backLink: { textAlign:'center', fontSize:'13px', fontWeight: '500', color:'#64748b', marginTop:'16px', cursor:'pointer' },
  center: { display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', color: '#64748b', fontFamily: 'sans-serif' }
};
