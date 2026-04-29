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
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState(""); 
  const [city, setCity] = useState(""); 
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/"); // Se non è loggato, torna alla home
          return;
        }

        const { data: p, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (p) {
          setFirstName(p.first_name || "");
          setLastName(p.last_name || "");
          setBirthDate(p.birth_date || "");
          setCity(p.city || "");
          setSelected(p.affinity_data?.interests || []);
        }
      } catch (err) {
        console.error("Errore caricamento:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [router]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('profiles').upsert({
        id: user.id, // Usiamo upsert per sicurezza
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate,
        city: city,
        affinity_data: { interests: selected },
        updated_at: new Date()
      });

      if (!error) {
        router.push("/discovery");
      } else {
        alert("Errore Supabase: " + error.message);
      }
    } catch (err) {
      alert("Errore critico durante il salvataggio");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={styles.center}>Caricamento in corso...</div>;

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        {step === 1 ? (
          <div style={styles.content}>
            <h2 style={styles.title}>Completa il profilo</h2>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nome</label>
              <input style={styles.input} value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Nome" />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Cognome</label>
              <input style={styles.input} value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Cognome" />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Data di Nascita</label>
              <input style={styles.input} type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Provincia</label>
              <select style={styles.input} value={city} onChange={e => setCity(e.target.value)}>
                <option value="">Seleziona...</option>
                {PROVINCE_ITALIANE.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <button 
              style={{...styles.button, opacity: (!firstName || !city || !birthDate) ? 0.5 : 1}} 
              disabled={!firstName || !city || !birthDate}
              onClick={() => setStep(2)}
            >
              Prossimo Step
            </button>
          </div>
        ) : (
          <div style={styles.content}>
            <h2 style={styles.title}>Il tuo DNA</h2>
            <div style={styles.scrollArea}>
              {MEGA_CATALOGO && Object.keys(MEGA_CATALOGO).map((cat) => (
                <div key={cat} style={{marginBottom: '15px'}}>
                  <h4 style={styles.catTitle}>{cat}</h4>
                  <div style={styles.tagGrid}>
                    {MEGA_CATALOGO[cat].map(item => (
                      <button
                        key={item}
                        onClick={() => selected.includes(item) ? setSelected(selected.filter(i => i !== item)) : setSelected([...selected, item])}
                        style={{...styles.tag, backgroundColor: selected.includes(item) ? '#3b82f6' : '#f3f4f6', color: selected.includes(item) ? '#fff' : '#333'}}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button style={styles.buttonSave} onClick={handleSave}>
              {loading ? "Salvataggio..." : "Salva e Inizia"}
            </button>
            <p style={{textAlign:'center', cursor:'pointer', marginTop:'10px', fontSize:'12px'}} onClick={()=>setStep(1)}>Indietro</p>
          </div>
        )}
      </div>
    </main>
  );
}

const styles = {
  main: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f9fafb', padding: '20px' },
  card: { backgroundColor: 'white', borderRadius: '20px', padding: '30px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
  title: { textAlign: 'center', marginBottom: '20px', fontWeight: 'bold', fontSize: '22px' },
  inputGroup: { marginBottom: '15px' },
  label: { display: 'block', fontSize: '13px', marginBottom: '5px', fontWeight: '600' },
  input: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' },
  button: { width: '100%', padding: '12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
  buttonSave: { width: '100%', padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
  scrollArea: { maxHeight: '300px', overflowY: 'auto', marginBottom: '20px', padding: '10px', border: '1px solid #eee', borderRadius: '10px' },
  catTitle: { fontSize: '12px', color: '#999', textTransform: 'uppercase', marginBottom: '5px' },
  tagGrid: { display: 'flex', flexWrap: 'wrap', gap: '5px' },
  tag: { padding: '5px 10px', borderRadius: '15px', border: 'none', fontSize: '12px', cursor: 'pointer' },
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }
};
