"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

// Lista città predefinita (puoi espanderla)
const CITIES = ["Roma", "Milano", "Napoli", "Torino", "Palermo", "Genova", "Bologna", "Firenze", "Bari", "Catania", "Venezia", "Verona", "Messina", "Padova", "Trieste"];

// Interessi per il DNA
const INTEREST_TAGS = ["Musica", "Tech", "Arte", "Sport", "Gaming", "Viaggi", "Cinema", "Cucina", "Libri", "Natura", "Fitness", "Fotografia"];

export default function OnboardingGlassy() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ firstName: "", birthDate: "", city: "", interests: [] });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(tag) 
        ? prev.interests.filter(t => t !== tag) 
        : [...prev.interests, tag]
    }));
  };

  const handleFinish = async () => {
    if (!formData.firstName || !formData.birthDate || !formData.city || formData.interests.length === 0) {
      alert("Tutti i campi e almeno un interesse sono obbligatori!");
      return;
    }

    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    const { error } = await supabase
      .from('profiles')
      .update({ 
        first_name: formData.firstName, 
        birth_date: formData.birthDate, 
        city: formData.city,
        affinity_data: { interests: formData.interests }
      })
      .eq('id', session.user.id);

    if (!error) router.push("/discovery");
    else alert("Errore: " + error.message);
    setLoading(false);
  };

  return (
    <main style={styles.background}>
      <div style={styles.glassCard}>
        {step === 1 ? (
          <section>
            <h1 style={styles.title}>Chi sei? ✨</h1>
            <p style={styles.subtitle}>Le basi per iniziare il tuo viaggio.</p>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nome</label>
              <input style={styles.input} value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} placeholder="Il tuo nome..." />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Data di Nascita</label>
              <input type="date" style={styles.input} value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Città</label>
              <select style={styles.input} value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}>
                <option value="">Seleziona...</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <button style={styles.nextBtn} onClick={() => setStep(2)}>Configura DNA →</button>
          </section>
        ) : (
          <section>
            <h1 style={styles.title}>Il tuo DNA 🧬</h1>
            <p style={styles.subtitle}>Cosa ti fa vibrare? Scegli i tuoi interessi.</p>
            
            <div style={styles.tagContainer}>
              {INTEREST_TAGS.map(tag => (
                <button 
                  key={tag} 
                  onClick={() => toggleTag(tag)}
                  style={formData.interests.includes(tag) ? styles.tagActive : styles.tagInactive}
                >
                  {tag}
                </button>
              ))}
            </div>

            <div style={styles.btnRow}>
              <button style={styles.backBtn} onClick={() => setStep(1)}>Indietro</button>
              <button style={styles.finishBtn} onClick={handleFinish} disabled={loading}>
                {loading ? "Salvataggio..." : "Entra nel Cerchio"}
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

const styles = {
  background: { 
    height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #a5f3fc 0%, #ddd6fe 50%, #fbcfe8 100%)', // Dreamcore Palette
    padding: '20px'
  },
  glassCard: { 
    background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(15px)',
    borderRadius: '32px', padding: '40px', width: '100%', maxWidth: '420px',
    border: '1px solid rgba(255, 255, 255, 0.6)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
  },
  title: { fontSize: '28px', fontWeight: '900', color: '#4c1d95', marginBottom: '8px', textAlign: 'center' },
  subtitle: { fontSize: '15px', color: '#6d28d9', textAlign: 'center', marginBottom: '30px', opacity: 0.8 },
  inputGroup: { marginBottom: '18px' },
  label: { fontSize: '13px', fontWeight: '800', color: '#5b21b6', marginBottom: '6px', display: 'block', marginLeft: '5px' },
  input: { 
    width: '100%', padding: '14px', borderRadius: '16px', border: 'none', 
    background: 'rgba(255, 255, 255, 0.5)', outline: 'none', fontSize: '15px', color: '#4c1d95'
  },
  tagContainer: { display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px' },
  tagInactive: { padding: '10px 16px', borderRadius: '12px', border: '1px solid rgba(109, 40, 217, 0.2)', background: 'transparent', cursor: 'pointer', transition: '0.3s' },
  tagActive: { padding: '10px 16px', borderRadius: '12px', border: '1px solid transparent', background: '#7c3aed', color: '#fff', cursor: 'pointer', transform: 'scale(1.05)' },
  nextBtn: { width: '100%', padding: '16px', borderRadius: '18px', border: 'none', background: '#7c3aed', color: '#fff', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
  btnRow: { display: 'flex', gap: '10px' },
  backBtn: { flex: 1, padding: '16px', borderRadius: '18px', border: 'none', background: 'rgba(255,255,255,0.3)', fontWeight: 'bold' },
  finishBtn: { flex: 2, padding: '16px', borderRadius: '18px', border: 'none', background: '#7c3aed', color: '#fff', fontWeight: 'bold' }
};
