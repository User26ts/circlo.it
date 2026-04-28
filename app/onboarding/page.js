"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// Sostituisci con i tuoi dati reali
const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    birth_date: "",
    gender: "",
    music: { genre: "", sub: "", specific: "" },
    aesthetic: ""
  });

  // Funzione per salvare tutto su Supabase
  const completeOnboarding = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        first_name: formData.first_name,
        last_name: formData.last_name,
        birth_date: formData.birth_date,
        gender: formData.gender,
        affinity_data: {
          music: formData.music,
          aesthetic: formData.aesthetic
        }
      });

      if (!error) router.push("/dashboard");
      else alert("Errore nel salvataggio");
    }
    setLoading(false);
  };

  return (
    <main style={styles.container}>
      <div style={styles.aurora}></div>

      <div style={styles.glassCard}>
        {/* STEP 1: ANAGRAFICA */}
        {step === 1 && (
          <div className="fade-in">
            <h2 style={styles.title}>Iniziamo.</h2>
            <p style={styles.subtitle}>Come ti chiamano gli altri?</p>
            <input 
              style={styles.input} type="text" placeholder="Nome" 
              onChange={(e) => setFormData({...formData, first_name: e.target.value})} 
            />
            <input 
              style={styles.input} type="text" placeholder="Cognome" 
              onChange={(e) => setFormData({...formData, last_name: e.target.value})} 
            />
            <p style={styles.label}>Quando sei nato/a?</p>
            <input 
              style={styles.input} type="date" 
              onChange={(e) => setFormData({...formData, birth_date: e.target.value})} 
            />
            <button style={styles.blueButton} onClick={() => setStep(2)}>
              <span style={styles.gloss}></span>AVANTI
            </button>
          </div>
        )}

        {/* STEP 2: MUSICA (Sottogruppi) */}
        {step === 2 && (
          <div className="fade-in">
            <h2 style={styles.title}>Risonanza.</h2>
            <p style={styles.subtitle}>Scegli il tuo nucleo musicale</p>
            
            <select 
              style={styles.input} 
              onChange={(e) => setFormData({...formData, music: {...formData.music, genre: e.target.value}})}
            >
              <option value="">Seleziona Genere</option>
              <option value="classica">Classica</option>
              <option value="elettronica">Elettronica</option>
              <option value="rock">Rock</option>
            </select>

            {formData.music.genre === "classica" && (
              <select 
                style={styles.input}
                onChange={(e) => setFormData({...formData, music: {...formData.music, sub: e.target.value}})}
              >
                <option value="">Quale epoca?</option>
                <option value="barocca">Barocca</option>
                <option value="romantica">Romantica</option>
              </select>
            )}

            {formData.music.sub === "romantica" && (
              <div style={styles.chipContainer}>
                {['Chopin', 'Rachmaninov', 'Liszt'].map(composer => (
                  <button 
                    key={composer} 
                    style={formData.music.specific === composer ? styles.chipActive : styles.chip}
                    onClick={() => setFormData({...formData, music: {...formData.music, specific: composer}})}
                  >
                    {composer}
                  </button>
                ))}
              </div>
            )}

            <div style={{display: 'flex', gap: '10px'}}>
              <button style={styles.whiteButton} onClick={() => setStep(1)}>INDIETRO</button>
              <button style={styles.blueButton} onClick={completeOnboarding} disabled={loading}>
                <span style={styles.gloss}></span>{loading ? "SALVATAGGIO..." : "FINITO"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e0f2fe 0%, #ffffff 100%)', position: 'relative', overflow: 'hidden', fontFamily: '"Segoe UI", sans-serif' },
  aurora: { position: 'absolute', width: '150%', height: '150%', background: 'radial-gradient(circle at 20% 20%, rgba(0, 209, 255, 0.2) 0%, transparent 50%)', filter: 'blur(80px)', zIndex: 0 },
  glassCard: { zIndex: 1, background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(20px)', padding: '50px', borderRadius: '40px', width: '90%', maxWidth: '400px', border: '1px solid rgba(255,255,255,0.7)', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' },
  title: { fontSize: '2rem', fontWeight: '800', color: '#1e293b', marginBottom: '5px' },
  subtitle: { fontSize: '0.9rem', color: '#64748b', marginBottom: '30px' },
  label: { fontSize: '0.8rem', color: '#94a3b8', textAlign: 'left', marginBottom: '5px', marginLeft: '5px' },
  input: { width: '100%', padding: '15px', marginBottom: '15px', borderRadius: '15px', border: '1px solid rgba(0,0,0,0.05)', background: 'rgba(255,255,255,0.8)', fontSize: '1rem', outline: 'none' },
  blueButton: { width: '100%', padding: '15px', background: 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white', border: 'none', borderRadius: '100px', fontWeight: 'bold', cursor: 'pointer', position: 'relative', overflow: 'hidden' },
  whiteButton: { width: '100%', padding: '15px', background: 'white', color: '#1e293b', border: '1px solid #e2e8f0', borderRadius: '100px', fontWeight: 'bold', cursor: 'pointer' },
  gloss: { position: 'absolute', top: '2px', left: '10%', width: '80%', height: '35%', background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)', borderRadius: '100px' },
  chipContainer: { display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' },
  chip: { padding: '8px 15px', background: 'rgba(255,255,255,0.5)', borderRadius: '20px', border: '1px solid #e2e8f0', fontSize: '0.8rem', cursor: 'pointer' },
  chipActive: { padding: '8px 15px', background: '#3b82f6', color: 'white', borderRadius: '20px', border: '1px solid #3b82f6', fontSize: '0.8rem', cursor: 'pointer' }
};
