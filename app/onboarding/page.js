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
  const [city, setCity] = useState(""); // Qui salviamo la Provincia
  const [selected, setSelected] = useState([]);
  
  // Navigazione catalogo
  const [mainCat, setMainCat] = useState("musica");
  const [subCat, setSubCat] = useState("Rock & Alternative");

  useEffect(() => {
    async function load() {
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
    load();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('profiles').update({
      first_name: firstName,
      last_name: lastName,
      city: city, // Salvataggio pulito
      affinity_data: { interests: selected }
    }).eq('id', user.id);

    if (!error) router.push("/discovery");
    else alert(error.message);
    setLoading(false);
  };

  if (loading) return <div>Caricamento...</div>;

return (
  <main style={styles.main}>
    <div style={styles.card}>
      {step === 1 ? (
        /* --- STEP 1: DATI PERSONALI --- */
        <div style={styles.stepContainer}>
          <h2 style={styles.title}>Iniziamo dalle basi</h2>
          <p style={styles.subtitle}>Come ti chiami e dove ti trovi?</p>
          
          <input 
            style={styles.input} 
            placeholder="Il tuo nome" 
            value={firstName} 
            onChange={e => setFirstName(e.target.value)} 
          />
          
          <select 
            style={styles.input} 
            value={city} 
            onChange={e => setCity(e.target.value)}
          >
            <option value="">Seleziona la tua provincia</option>
            {PROVINCE_ITALIANE.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <button 
            style={styles.button} 
            onClick={() => {
              if(!firstName || !city) alert("Inserisci nome e provincia!");
              else setStep(2);
            }}
          >
            Scegli i tuoi interessi →
          </button>
        </div>
      ) : (
        /* --- STEP 2: IL CATALOGO (Quello che era sparito) --- */
        <div style={styles.stepContainer}>
          <h2 style={styles.title}>Crea il tuo DNA</h2>
          <p style={styles.subtitle}>Seleziona almeno 5 passioni per trovare i tuoi simili</p>
          
          {/* Qui deve esserci la tua griglia degli interessi (quella con MEGA_CATALOGO) */}
          <div style={styles.grid}>
             {/* ... inserisci qui il codice della griglia che avevi su github ... */}
          </div>

          <button 
            style={styles.buttonSave} 
            onClick={handleSave}
          >
            {loading ? "Salvataggio..." : "Trova persone affini"}
          </button>
        </div>
      )}
    </div>
  </main>
);
const styles = { /* ... gli stili che abbiamo già ... */ };
