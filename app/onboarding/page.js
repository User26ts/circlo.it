"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

// Assicurati che questo file esista, altrimenti incolla qui il tuo array MEGA_CATALOGO
// import { MEGA_CATALOGO } from "./catalog"; 

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

const PROVINCE_ITALIANE = ["Agrigento", "Alessandria", "Ancona", "Aosta", "Arezzo", "Ascoli Piceno", "Asti", "Avellino", "Bari", "Barletta-Andria-Trani", "Belluno", "Benevento", "Bergamo", "Biella", "Bologna", "Bolzano", "Brescia", "Brindisi", "Cagliari", "Caltanissetta", "Campobasso", "Carbonia-Iglesias", "Caserta", "Catania", "Catanzaro", "Chieti", "Como", "Cosenza", "Cremona", "Crotone", "Cuneo", "Enna", "Fermo", "Ferrara", "Firenze", "Foggia", "Forlì-Cesena", "Frosinone", "Genova", "Gorizia", "Grosseto", "Imperia", "Isernia", "La Spezia", "L'Aquila", "Latina", "Lecce", "Lecco", "Livorno", "Lodi", "Lucca", "Macerata", "Mantova", "Massa-Carrara", "Matera", "Messina", "Milano", "Modena", "Monza e della Brianza", "Napoli", "Novara", "Nuoro", "Olbia-Tempio", "Oristano", "Padova", "Palermo", "Parma", "Pavia", "Perugia", "Pesaro e Urbino", "Pescara", "Piacenza", "Pisa", "Pistoia", "Pordenone", "Potenza", "Prato", "Ragusa", "Ravenna", "Reggio Calabria", "Reggio Emilia", "Rieti", "Rimini", "Roma", "Rovigo", "Salerno", "Medio Campidano", "Sassari", "Savona", "Siena", "Siracusa", "Sondrio", "Taranto", "Teramo", "Terni", "Torino", "Ogliastra", "Trapani", "Trento", "Treviso", "Trieste", "Udine", "Varese", "Venezia", "Verbano-Cusio-Ossola", "Vercelli", "Verona", "Vibo Valentia", "Vicenza", "Viterbo"];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [city, setCity] = useState(""); 
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (p) {
          setFirstName(p.first_name || "");
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
      city: city,
      affinity_data: { interests: selected }
    }).eq('id', user.id);

    if (!error) router.push("/discovery");
    else alert(error.message);
    setLoading(false);
  };

  if (loading) return <div style={styles.center}>Caricamento...</div>;

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        {step === 1 ? (
          <div>
            <h2 style={styles.title}>Dati Personali</h2>
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
            <button style={styles.button} onClick={() => setStep(2)}>CONTINUA</button>
          </div>
        ) : (
          <div>
            <h2 style={styles.title}>Scegli i tuoi interessi</h2>
            <p style={styles.subtitle}>Seleziona cosa ti appassiona</p>
            {/* Qui andrebbe il tuo componente griglia. Per ora un placeholder: */}
            <div style={{padding: '20px', textAlign: 'center'}}>
               [Griglia Interessi Catalogo]
            </div>
            <button style={styles.buttonSave} onClick={handleSave}>SALVA DNA</button>
          </div>
        )}
      </div>
    </main>
  );
}

const styles = {
  main: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '20px' },
  card: { backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px' },
  title: { fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', textAlign: 'center' },
  subtitle: { fontSize: '14px', color: '#666', marginBottom: '20px', textAlign: 'center' },
  input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '16px' },
  button: { width: '100%', padding: '12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
  buttonSave: { width: '100%', padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }
};
