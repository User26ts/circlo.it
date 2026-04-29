"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { MEGA_CATALOGO } from "./catalog"; // Assicurati che il percorso sia corretto

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

const PROVINCE_ITALIANE = ["Agrigento", "Alessandria", "Ancona", "Aosta", "Arezzo", "Ascoli Piceno", "Asti", "Avellino", "Bari", "Barletta-Andria-Trani", "Belluno", "Benevento", "Bergamo", "Biella", "Bologna", "Bolzano", "Brescia", "Brindisi", "Cagliari", "Caltanissetta", "Campobasso", "Carbonia-Iglesias", "Caserta", "Catania", "Catanzaro", "Chieti", "Como", "Cosenza", "Cremona", "Crotone", "Cuneo", "Enna", "Fermo", "Ferrara", "Firenze", "Foggia", "Forlì-Cesena", "Frosinone", "Genova", "Gorizia", "Grosseto", "Imperia", "Isernia", "La Spezia", "L'Aquila", "Latina", "Lecce", "Lecco", "Livorno", "Lodi", "Lucca", "Macerata", "Mantova", "Massa-Carrara", "Matera", "Messina", "Milano", "Modena", "Monza e della Brianza", "Napoli", "Novara", "Nuoro", "Olbia-Tempio", "Oristano", "Padova", "Palermo", "Parma", "Pavia", "Perugia", "Pesaro e Urbino", "Pescara", "Piacenza", "Pisa", "Pistoia", "Pordenone", "Potenza", "Prato", "Ragusa", "Ravenna", "Reggio Calabria", "Reggio Emilia", "Rieti", "Rimini", "Roma", "Rovigo", "Salerno", "Medio Campidano", "Sassari", "Savona", "Siena", "Siracusa", "Sondrio", "Taranto", "Teramo", "Terni", "Torino", "Ogliastra", "Trapani", "Trento", "Treviso", "Trieste", "Udine", "Varese", "Venezia", "Verbano-Cusio-Ossola", "Vercelli", "Verona", "Vibo Valentia", "Vicenza", "Viterbo"];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // Dati Profilo
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState(""); 
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (p) {
          setFirstName(p.first_name || "");
          setLastName(p.last_name || "");
          setCity(p.city || "");
          setSelected(p.affinity_data?.interests || []);
        }
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase.from('profiles').update({
      first_name: firstName,
      last_name: lastName,
      city: city,
      affinity_data: { interests: selected }
    }).eq('id', user.id);

    if (!error) {
      router.push("/discovery");
    } else {
      alert("Errore nel salvataggio: " + error.message);
      setLoading(false);
    }
  };

  if (loading) return <div style={styles.center}>Caricamento profilo...</div>;

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        
        {step === 1 ? (
          /* STEP 1: DATI ANAGRAFICI */
          <div style={styles.content}>
            <h2 style={styles.title}>Benvenuto su Circlo</h2>
            <p style={styles.subtitle}>Presentati alla community</p>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nome</label>
              <input 
                style={styles.input} 
                placeholder="Es. Mario" 
                value={firstName} 
                onChange={e => setFirstName(e.target.value)} 
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Cognome (sarà nascosto inizialmente)</label>
              <input 
                style={styles.input} 
                placeholder="Es. Rossi" 
                value={lastName} 
                onChange={e => setLastName(e.target.value)} 
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>La tua Provincia</label>
              <select 
                style={styles.input} 
                value={city} 
                onChange={e => setCity(e.target.value)}
              >
                <option value="">Dove vivi?</option>
                {PROVINCE_ITALIANE.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <button 
              style={{...styles.button, opacity: (!firstName || !city) ? 0.6 : 1}} 
              disabled={!firstName || !city}
              onClick={() => setStep(2)}
            >
              Configura il tuo DNA →
            </button>
          </div>
        ) : (
          /* STEP 2: CATALOGO INTERESSI */
          <div style={styles.content}>
            <h2 style={styles.title}>Il tuo DNA</h2>
            <p style={styles.subtitle}>Seleziona cosa ti appassiona per trovare i tuoi simili</p>
            
            <div style={styles.scrollArea}>
              {Object.keys(MEGA_CATALOGO).map((category) => (
                <div key={category} style={styles.categoryBlock}>
                  <h4 style={styles.categoryTitle}>{category.replace(/_/g, ' ')}</h4>
                  <div style={styles.tagGrid}>
                    {MEGA_CATALOGO[category].map((item) => {
                      const isActive = selected.includes(item);
                      return (
                        <button
                          key={item}
                          onClick={() => {
                            if (isActive) setSelected(selected.filter(i => i !== item));
                            else setSelected([...selected, item]);
                          }}
                          style={{
                            ...styles.tag,
                            backgroundColor: isActive ? '#3b82f6' : '#f3f4f6',
                            color: isActive ? '#fff' : '#4b5563',
                            borderColor: isActive ? '#3b82f6' : '#e5e7eb'
                          }}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.footer}>
              <button 
                style={{...styles.buttonSave, opacity: selected.length < 3 ? 0.6 : 1}} 
                disabled={selected.length < 3 || loading}
                onClick={handleSave}
              >
                {loading ? "Salvataggio..." : `CONFERMA ${selected.length} INTERESSI`}
              </button>
              <p style={styles.backLink} onClick={() => setStep(1)}>Modifica dati personali</p>
            </div>
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
  title: { fontSize: '26px', fontWeight: '800', color: '#111827', margin: '0 0 8px 0', textAlign: 'center' },
  subtitle: { fontSize: '15px', color: '#6b7280', margin: '0 0 24px 0', textAlign: 'center' },
  inputGroup: { marginBottom: '20px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' },
  input: { width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #e5e7eb', fontSize: '16px', outline: 'none', transition: 'border-color 0.2s' },
  button: { width: '100%', padding: '14px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '10px' },
  scrollArea: { maxHeight: '350px', overflowY: 'auto', paddingRight: '10px', marginBottom: '20px' },
  categoryBlock: { marginBottom: '24px' },
  categoryTitle: { fontSize: '12px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' },
  tagGrid: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  tag: { padding: '8px 14px', borderRadius: '20px', border: '1px solid', fontSize: '13px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s' },
  buttonSave: { width: '100%', padding: '14px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' },
  backLink: { textAlign: 'center', fontSize: '13px', color: '#6b7280', marginTop: '15px', cursor: 'pointer', textDecoration: 'underline' },
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#6b7280' }
};
