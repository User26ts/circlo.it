
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
  
  // Dati Profilo
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState(""); // Aggiunto per l'età dinamica
  const [city, setCity] = useState(""); 
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: p, error } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
          if (p) {
            setFirstName(p.first_name || "");
            setLastName(p.last_name || "");
            setBirthDate(p.birth_date || "");
            setCity(p.city || "");
            setSelected(p.affinity_data?.interests || []);
          }
        }
      } catch (err) {
        console.error("Errore caricamento:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase.from('profiles').update({
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate, // Salviamo la data, non l'età fissa
        city: city,
        affinity_data: { interests: selected }
      }).eq('id', user.id);

      if (!error) {
        router.push("/discovery");
      } else {
        alert("Errore nel salvataggio: " + error.message);
      }
    } catch (err) {
      alert("Errore di connessione al database");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={styles.center}>Caricamento profilo...</div>;

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        
        {step === 1 ? (
          <div style={styles.content}>
            <h2 style={styles.title}>Benvenuto su Circlo</h2>
            <p style={styles.subtitle}>Presentati alla community</p>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nome</label>
              <input style={styles.input} placeholder="Es. Mario" value={firstName} onChange={e => setFirstName(e.target.value)} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Data di Nascita (per calcolare l'età)</label>
              <input style={styles.input} type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>La tua Provincia</label>
              <select style={styles.input} value={city} onChange={e => setCity(e.target.value)}>
                <option value="">Dove vivi?</option>
                {PROVINCE_ITALIANE.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <button 
              style={{...styles.button, opacity: (!firstName || !city || !birthDate) ? 0.6 : 1}} 
              disabled={!firstName || !city || !birthDate}
              onClick={() => setStep(2)}
            >
              Configura il tuo DNA →
            </button>
          </div>
        ) : (
          <div style={styles.content}>
            <h2 style={styles.title}>Il tuo DNA</h2>
            <p style={styles.subtitle}>Seleziona cosa ti appassiona</p>
            <div style={styles.scrollArea}>
              {MEGA_CATALOGO && Object.keys(MEGA_CATALOGO).map((category) => (
                <div key={category} style={styles.categoryBlock}>
                  <h4 style={styles.categoryTitle}>{category}</h4>
                  <div style={styles.tagGrid}>
                    {MEGA_CATALOGO[category].map((item) => {
                      const isActive = selected.includes(item);
                      return (
                        <button
                          key={item}
                          onClick={() => isActive ? setSelected(selected.filter(i => i !== item)) : setSelected([...selected, item])}
                          style={{...styles.tag, backgroundColor: isActive ? '#3b82f6' : '#f3f4f6', color: isActive ? '#fff' : '#4b5563'}}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <button style={styles.buttonSave} onClick={handleSave}>{loading ? "Salvataggio..." : "CONFERMA DNA"}</button>
          </div>
        )}
      </div>
    </main>
  );
}

const styles = {
  main: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f9fafb', padding: '20px', fontFamily: 'sans-serif' },
  card: { backgroundColor: 'white', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', width: '100%', maxWidth: '450px', overflow: 'hidden' },
  content: { padding: '32px' },
  title: { fontSize: '26px', fontWeight: '800', textAlign: 'center' },
  subtitle: { fontSize: '15px', color: '#6b7280', textAlign: 'center', marginBottom: '20px' },
  inputGroup: { marginBottom: '15px' },
  label: { fontSize: '13px', fontWeight: '600', marginBottom: '5px', display: 'block' },
  input: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb' },
  button: { width: '100%', padding: '14px', backgroundColor: '#3b82f6', color: 'white', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 'bold' },
  buttonSave: { width: '100%', padding: '14px', backgroundColor: '#10b981', color: 'white', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 'bold' },
  scrollArea: { maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' },
  tagGrid: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  tag: { padding: '6px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer' },
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }
};
