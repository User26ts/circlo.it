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
          <div>
            <h2>I tuoi Dati</h2>
            <input style={styles.input} placeholder="Nome" value={firstName} onChange={e=>setFirstName(e.target.value)} />
            <select style={styles.input} value={city} onChange={e=>setCity(e.target.value)}>
              <option value="">In che provincia vivi?</option>
              {PROVINCE_ITALIANE.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <button onClick={()=>setStep(2)}>PROSEGUI</button>
          </div>
        ) : (
          <div>
            {/* ... Qui inserisci la griglia degli interessi che avevamo già fatto ... */}
            <button onClick={handleSave}>SALVA DNA</button>
          </div>
        )}
      </div>
    </main>
  );
}
const styles = { /* ... gli stili che abbiamo già ... */ };
