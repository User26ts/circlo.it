"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

const CITIES = ["Roma", "Milano", "Napoli", "Torino", "Palermo", "Genova", "Bologna", "Firenze", "Bari", "Catania", "Venezia", "Verona"];
const INTERESTS = ["Musica", "Tech", "Arte", "Sport", "Gaming", "Viaggi", "Cinema", "Letteratura", "Natura", "Fitness", "Fotografia", "Cucina"];

export default function OnboardingLiminal() {
  const [formData, setFormData] = useState({ firstName: "", birthDate: "", city: "", tags: [] });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
    }));
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.birthDate || !formData.city || formData.tags.length === 0) {
      alert("Devi compilare tutti i campi e selezionare almeno un interesse.");
      return;
    }

    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    const { error } = await supabase.from('profiles').update({ 
      first_name: formData.firstName, 
      birth_date: formData.birthDate, 
      city: formData.city,
      affinity_data: { interests: formData.tags }
    }).eq('id', session.user.id);

    if (error) alert("Errore di connessione al database.");
    else router.push("/discovery");
    
    setLoading(false);
  };

  return (
    <main style={styles.liminalSpace}>
      <div style={styles.glassPanel}>
        <h1 style={styles.title}>Inizializzazione...</h1>
        <p style={styles.sub}>Inserisci i tuoi parametri vitali.</p>
        
        <form onSubmit={saveProfile} style={styles.form}>
          <input 
            style={styles.input} 
            placeholder="Nome in codice (Il tuo nome)" 
            value={formData.firstName}
            onChange={e => setFormData({...formData, firstName: e.target.value})}
          />
          
          <input 
            type="date" 
            style={styles.input} 
            value={formData.birthDate}
            onChange={e => setFormData({...formData, birthDate: e.target.value})}
          />
          
          <select style={styles.input} value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}>
            <option value="">Seleziona Settore (Città)...</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <div style={styles.tagZone}>
            <p style={styles.tagLabel}>Seleziona il tuo DNA:</p>
            <div style={styles.tags}>
              {INTERESTS.map(t => (
                <button 
                  type="button" 
                  key={t} 
                  onClick={() => toggleTag(t)}
                  style={formData.tags.includes(t) ? styles.tagActive : styles.tagIdle}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} style={styles.enterBtn}>
            {loading ? "Sincronizzazione..." : "Accedi al Livello"}
          </button>
        </form>
      </div>
    </main>
  );
}

const styles = {
  liminalSpace: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #f0ebd8 0%, #e3dcb8 100%)', padding: '20px', fontFamily: 'monospace' },
  glassPanel: { background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '8px', padding: '30px', width: '100%', maxWidth: '400px', boxShadow: '0 8px 32px rgba(0,0,0,0.05)' },
  title: { margin: '0 0 5px 0', fontSize: '22px', color: '#2d2c25', textTransform: 'uppercase', letterSpacing: '-1px' },
  sub: { margin: '0 0 25px 0', fontSize: '13px', color: '#5c5a4f' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '12px', background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '4px', outline: 'none', color: '#2d2c25', fontFamily: 'inherit', fontSize: '15px' },
  tagZone: { marginTop: '10px' },
  tagLabel: { margin: '0 0 10px 0', fontSize: '12px', color: '#5c5a4f', textTransform: 'uppercase' },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  tagIdle: { padding: '6px 10px', background: 'transparent', border: '1px solid #a39e88', color: '#5c5a4f', borderRadius: '4px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px' },
  tagActive: { padding: '6px 10px', background: '#2d2c25', border: '1px solid #2d2c25', color: '#f0ebd8', borderRadius: '4px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px' },
  enterBtn: { marginTop: '20px', padding: '15px', background: '#2d2c25', color: '#e3dcb8', border: 'none', borderRadius: '4px', cursor: 'pointer', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }
};
