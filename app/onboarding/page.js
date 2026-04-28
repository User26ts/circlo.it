
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// --- INSERISCI I TUOI DATI SUPABASE ---
const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Stato che rispecchia esattamente il tuo nuovo database
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    birth_date: "",
    gender: "",
    affinity_data: {
      music: { genre: "", sub: "", specific: [] },
      aesthetics: [],
    }
  });

  // Controlla che l'utente sia loggato
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push("/auth");
      else setUser(user);
    };
    checkUser();
  }, [router]);

  // Salva i dati e vai alla Dashboard
  const completeOnboarding = async () => {
    if (!formData.first_name || !formData.birth_date) {
      alert("Nome e data di nascita sono necessari per continuare.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      first_name: formData.first_name,
      last_name: formData.last_name,
      birth_date: formData.birth_date,
      gender: formData.gender,
      affinity_data: formData.affinity_data,
      updated_at: new Date()
    });

    if (error) {
      console.error("Errore salvataggio:", error.message);
      alert("Errore durante il salvataggio.");
      setLoading(false);
    } else {
      router.push("/dashboard"); // Ti lancia nel sito vero e proprio!
    }
  };

  // Aggiorna i dati nidificati (musica)
  const updateMusic = (field, value) => {
    setFormData(prev => ({
      ...prev,
      affinity_data: {
        ...prev.affinity_data,
        music: { ...prev.affinity_data.music, [field]: value }
      }
    }));
  };

  if (!user) return <div style={styles.container}>Sincronizzazione...</div>;

  return (
    <main style={styles.container}>
      <div style={styles.aurora}></div>

      <div style={styles.glassCard}>
        {step === 1 && (
          <div className="fade-in">
            <h2 style={styles.title}>Chi sei?</h2>
            <p style={styles.subtitle}>Le tue coordinate nel mondo reale.</p>
            
            <input style={styles.input} type="text" placeholder="Nome (obbligatorio)" 
              value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} />
            
            <input style={styles.input} type="text" placeholder="Cognome" 
              value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} />
            
            <p style={styles.label}>Data di nascita (calcoleremo la tua età dinamicamente)</p>
            <input style={styles.input} type="date" 
              value={formData.birth_date} onChange={(e) => setFormData({...formData, birth_date: e.target.value})} />

            <select style={styles.input} value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
              <option value="">Genere</option>
              <option value="uomo">Uomo</option>
              <option value="donna">Donna</option>
              <option value="altro">Altro / Preferisco non dirlo</option>
            </select>

            <button style={styles.blueButton} onClick={() => setStep(2)}>
              <span style={styles.gloss}></span>AVANTI
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="fade-in">
            <h2 style={styles.title}>Frequenze.</h2>
            <p style={styles.subtitle}>Qual è la tua base musicale?</p>

            <select style={styles.input} value={formData.affinity_data.music.genre} onChange={(e) => updateMusic('genre', e.target.value)}>
              <option value="">Scegli il genere principale</option>
              <option value="classica">Classica</option>
              <option value="elettronica">Elettronica</option>
              <option value="rock">Rock</option>
            </select>

            {formData.affinity_data.music.genre === "classica" && (
              <select style={styles.input} value={formData.affinity_data.music.sub} onChange={(e) => updateMusic('sub', e.target.value)}>
                <option value="">Scegli l'epoca</option>
                <option value="barocca">Barocca</option>
                <option value="romantica">Romantica</option>
              </select>
            )}

            {formData.affinity_data.music.sub === "romantica" && (
              <div style={styles.chipContainer}>
                {['Chopin', 'Rachmaninov', 'Liszt', 'Beethoven'].map(composer => {
                  const isSelected = formData.affinity_data.music.specific.includes(composer);
                  return (
                    <button key={composer} style={isSelected ? styles.chipActive : styles.chip}
                      onClick={() => {
                        const newSpecific = isSelected 
                          ? formData.affinity_data.music.specific.filter(c => c !== composer)
                          : [...formData.affinity_data.music.specific, composer];
                        updateMusic('specific', newSpecific);
                      }}>
                      {composer}
                    </button>
                  )
                })}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button style={styles.whiteButton} onClick={() => setStep(1)}>INDIETRO</button>
              <button style={styles.blueButton} onClick={completeOnboarding} disabled={loading}>
                <span style={styles.gloss}></span>{loading ? "ATTENDI..." : "ENTRA NEL CIRCLO"}
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
  aurora: { position: 'absolute', width: '150%', height: '150%', background: 'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)', filter: 'blur(80px)', zIndex: 0 },
  glassCard: { zIndex: 1, background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(20px)', padding: '40px', borderRadius: '40px', width: '90%', maxWidth: '420px', border: '1px solid rgba(255,255,255,0.7)', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' },
  title: { fontSize: '2.2rem', fontWeight: '800', color: '#1e293b', marginBottom: '5px', letterSpacing: '-1px' },
  subtitle: { fontSize: '0.95rem', color: '#64748b', marginBottom: '30px' },
  label: { fontSize: '0.8rem', color: '#94a3b8', textAlign: 'left', marginBottom: '5px', marginLeft: '5px' },
  input: { width: '100%', padding: '16px', marginBottom: '15px', borderRadius: '15px', border: '1px solid rgba(0,0,0,0.05)', background: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', outline: 'none', color: '#334155' },
  blueButton: { width: '100%', padding: '16px', background: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)', color: 'white', border: 'none', borderRadius: '100px', fontWeight: 'bold', letterSpacing: '1px', cursor: 'pointer', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 20px rgba(37, 99, 235, 0.2)' },
  whiteButton: { width: '100%', padding: '16px', background: 'white', color: '#1e293b', border: '1px solid #e2e8f0', borderRadius: '100px', fontWeight: 'bold', letterSpacing: '1px', cursor: 'pointer', boxShadow: '0 8px 20px rgba(0,0,0,0.03)' },
  gloss: { position: 'absolute', top: '2px', left: '10%', width: '80%', height: '35%', background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)', borderRadius: '100px' },
  chipContainer: { display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' },
  chip: { padding: '10px 18px', background: 'rgba(255,255,255,0.6)', borderRadius: '100px', border: '1px solid #e2e8f0', fontSize: '0.85rem', cursor: 'pointer', color: '#475569', transition: 'all 0.2s' },
  chipActive: { padding: '10px 18px', background: '#3b82f6', color: 'white', borderRadius: '100px', border: '1px solid #3b82f6', fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)', transition: 'all 0.2s' }
};
