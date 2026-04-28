"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    birth_date: "",
    gender: "",
    music: [],
    aesthetics: []
  });

  const nextStep = () => setStep(step + 1);

  const saveProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      ...formData,
      updated_at: new Date()
    });

    if (!error) window.location.href = "/matches";
  };

  return (
    <main style={styles.container}>
      <div style={styles.aurora}></div>
      
      <div style={styles.glassCard}>
        {step === 1 && (
          <section>
            <h2 style={styles.title}>Chi sei?</h2>
            <input 
              style={styles.input} type="text" placeholder="Nome" 
              onChange={(e) => setFormData({...formData, first_name: e.target.value})} 
            />
            <input 
              style={styles.input} type="date" placeholder="Data di nascita" 
              onChange={(e) => setFormData({...formData, birth_date: e.target.value})} 
            />
            <button style={styles.button} onClick={nextStep}>Continua</button>
          </section>
        )}

        {step === 2 && (
          <section>
            <h2 style={styles.title}>Affinità Musicali</h2>
            <p style={{color: '#64748b', marginBottom: '20px'}}>Cosa risuona nelle tue orecchie?</p>
            {/* Qui inseriremo la logica dei sottogruppi */}
            <div style={styles.grid}>
              {['Classica', 'Jazz', 'Techno', 'Rock', 'Ambient'].map(genre => (
                <div key={genre} style={styles.chip} onClick={() => {/* logica selezione */}}>
                  {genre}
                </div>
              ))}
            </div>
            <button style={styles.button} onClick={saveProfile}>Completa</button>
          </section>
        )}
      </div>
    </main>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e2e8f0', position: 'relative', overflow: 'hidden', fontFamily: 'sans-serif' },
  aurora: { position: 'absolute', width: '100%', height: '100%', background: 'radial-gradient(circle at 10% 20%, #bae6fd 0%, transparent 40%)', filter: 'blur(100px)' },
  glassCard: { zIndex: 2, background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(20px)', padding: '50px', borderRadius: '40px', width: '100%', maxWidth: '400px', textAlign: 'center', border: '1px solid white' },
  title: { fontWeight: '300', fontSize: '1.8rem', marginBottom: '30px', color: '#1e293b' },
  input: { width: '100%', padding: '15px', marginBottom: '15px', borderRadius: '15px', border: '1px solid #cbd5e1', background: 'rgba(255,255,255,0.8)' },
  button: { width: '100%', padding: '15px', background: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)', color: 'white', border: 'none', borderRadius: '100px', fontWeight: 'bold', cursor: 'pointer' },
  grid: { display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '30px' },
  chip: { padding: '10px 20px', background: 'white', borderRadius: '100px', border: '1px solid #e2e8f0', cursor: 'pointer', fontSize: '0.8rem' }
};
