"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { MEGA_CATALOGO } from "./catalog";

// INIZIALIZZAZIONE FUORI DAL COMPONENTE (Risolve il warning delle istanze multiple)
const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

const PROVINCE_ITALIANE = ["Agrigento", "Alessandria", "Ancona", "Aosta", "Arezzo", "Ascoli Piceno", "Asti", "Avellino", "Bari", "Barletta-Andria-Trani", "Belluno", "Benevento", "Bergamo", "Biella", "Bologna", "Bolzano", "Brescia", "Brindisi", "Cagliari", "Caltanissetta", "Campobasso", "Carbonia-Iglesias", "Caserta", "Catania", "Catanzaro", "Chieti", "Como", "Cosenza", "Cremona", "Crotone", "Cuneo", "Enna", "Fermo", "Ferrara", "Firenze", "Foggia", "Forlì-Cesena", "Frosinone", "Genova", "Gorizia", "Grosseto", "Imperia", "Isernia", "La Spezia", "L'Aquila", "Latina", "Lecce", "Lecco", "Livorno", "Lodi", "Lucca", "Macerata", "Mantova", "Massa-Carrara", "Matera", "Messina", "Milano", "Modena", "Monza e della Brianza", "Napoli", "Novara", "Nuoro", "Olbia-Tempio", "Oristano", "Padova", "Palermo", "Parma", "Pavia", "Perugia", "Pesaro e Urbino", "Pescara", "Piacenza", "Pisa", "Pistoia", "Pordenone", "Potenza", "Prato", "Ragusa", "Ravenna", "Reggio Calabria", "Reggio Emilia", "Rieti", "Rimini", "Roma", "Rovigo", "Salerno", "Medio Campidano", "Sassari", "Savona", "Siena", "Siracusa", "Sondrio", "Taranto", "Teramo", "Terni", "Torino", "Ogliastra", "Trapani", "Trento", "Treviso", "Trieste", "Udine", "Varese", "Venezia", "Verbano-Cusio-Ossola", "Vercelli", "Verona", "Vibo Valentia", "Vicenza", "Viterbo"];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState(""); 
  const [city, setCity] = useState(""); 
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push("/");
          return;
        }

        const { data: p } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (p) {
          setFirstName(p.first_name || "");
          setLastName(p.last_name || "");
          setBirthDate(p.birth_date || "");
          setCity(p.city || "");
          // Sicurezza: se affinity_data non è un array, resetta a array vuoto
          setSelected(Array.isArray(p.affinity_data?.interests) ? p.affinity_data.interests : []);
        }
      } catch (err) {
        console.error("Errore critico:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [router]);

  const handleSave = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      first_name: firstName,
      last_name: lastName,
      birth_date: birthDate,
      city: city,
      affinity_data: { interests: selected },
      updated_at: new Date()
    });

    if (!error) router.push("/discovery");
    else {
      alert("Errore salvataggio: " + error.message);
      setLoading(false);
    }
  };

  if (loading) return <div style={{textAlign:'center', padding:'50px'}}>Caricamento...</div>;

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        {step === 1 ? (
          <div style={styles.content}>
            <h2 style={styles.title}>Chi sei?</h2>
            <input style={styles.input} placeholder="Nome" value={firstName} onChange={e=>setFirstName(e.target.value)} />
            <input style={styles.input} placeholder="Cognome" value={lastName} onChange={e=>setLastName(e.target.value)} />
            <label style={styles.label}>Data di nascita</label>
            <input style={styles.input} type="date" value={birthDate} onChange={e=>setBirthDate(e.target.value)} />
            <select style={styles.input} value={city} onChange={e=>setCity(e.target.value)}>
              <option value="">Provincia</option>
              {PROVINCE_ITALIANE.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <button 
              style={{...styles.button, opacity: (!firstName || !city || !birthDate) ? 0.5 : 1}} 
              disabled={!firstName || !city || !birthDate}
              onClick={() => setStep(2)}
            >
              Avanti
            </button>
          </div>
        ) : (
          <div style={styles.content}>
            <h2 style={styles.title}>I tuoi interessi</h2>
            <div style={styles.scrollArea}>
              {MEGA_CATALOGO && Object.keys(MEGA_CATALOGO).map((cat) => (
                <div key={cat} style={{marginBottom:'15px'}}>
                  <p style={styles.catTitle}>{cat}</p>
                  <div style={styles.tagGrid}>
                    {/* Controllo di sicurezza Array.isArray */}
                    {Array.isArray(MEGA_CATALOGO[cat]) && MEGA_CATALOGO[cat].map(item => (
                      <button
                        key={item}
                        onClick={() => selected.includes(item) ? setSelected(selected.filter(i=>i!==item)) : setSelected([...selected, item])}
                        style={{...styles.tag, backgroundColor: selected.includes(item) ? '#3b82f6' : '#f1f5f9', color: selected.includes(item) ? '#fff' : '#475569'}}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button style={styles.buttonSave} onClick={handleSave}>Salva DNA</button>
            <p style={{textAlign:'center', fontSize:'12px', cursor:'pointer'}} onClick={()=>setStep(1)}>Indietro</p>
          </div>
        )}
      </div>
    </main>
  );
}

const styles = {
  main: { display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh', backgroundColor:'#f8fafc' },
  card: { backgroundColor:'#fff', padding:'30px', borderRadius:'20px', width:'100%', maxWidth:'400px', boxShadow:'0 10px 15px rgba(0,0,0,0.05)' },
  title: { textAlign:'center', marginBottom:'20px', color:'#1e293b' },
  input: { width:'100%', padding:'12px', marginBottom:'15px', borderRadius:'12px', border:'1px solid #e2e8f0', boxSizing:'border-box' },
  label: { fontSize:'12px', color:'#64748b', marginBottom:'5px', display:'block' },
  button: { width:'100%', padding:'12px', backgroundColor:'#3b82f6', color:'#fff', border:'none', borderRadius:'12px', cursor:'pointer', fontWeight:'bold' },
  buttonSave: { width:'100%', padding:'12px', backgroundColor:'#10b981', color:'#fff', border:'none', borderRadius:'12px', cursor:'pointer', fontWeight:'bold', marginBottom:'10px' },
  scrollArea: { maxHeight:'300px', overflowY:'auto', marginBottom:'20px', padding:'10px' },
  catTitle: { fontSize:'11px', fontWeight:'bold', color:'#94a3b8', textTransform:'uppercase', marginBottom:'8px' },
  tagGrid: { display:'flex', flexWrap:'wrap', gap:'6px' },
  tag: { padding:'6px 12px', borderRadius:'20px', border:'none', fontSize:'12px', cursor:'pointer', transition:'0.2s' }
};
