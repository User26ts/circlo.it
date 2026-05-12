"use client";
import { useState, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { MEGA_CATALOGO, PROVINCE_ITALIANE } from "./catalog";

const supabase = createClient(
  "https://cuntsizxhdoenlmldkrp.supabase.co", 
  "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK"
);

export default function OnboardingDNA() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [profile, setProfile] = useState({
    firstName: "",
    birthDate: "",
    city: "",
    tags: [],
    bio: ""
  });

  // --- LOGICA CALCOLO ETÀ ---
  const age = useMemo(() => {
    if (!profile.birthDate) return null;
    const today = new Date();
    const birth = new Date(profile.birthDate);
    let a = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) a--;
    return a;
  }, [profile.birthDate]);

  const isStep1Valid = profile.firstName.trim().length > 1 && profile.birthDate && profile.city && age >= 18;

  // --- GESTIONE TAG ---
  const toggleTag = (tag) => {
    setProfile(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag) 
        : [...prev.tags, tag]
    }));
  };

  // --- FUNZIONE DI SALVATAGGIO DEFINITIVA ---
  const handleFinalSave = async () => {
    if (profile.tags.length < 5) {
      alert("Il tuo DNA è troppo corto! Seleziona almeno 5 tag.");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Devi essere loggato per salvare il profilo.");

      // UPSERT sblocca l'utente impostando setup_finished: true
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        first_name: profile.firstName,
        birth_date: profile.birthDate,
        city: profile.city,
        setup_finished: true, // QUESTO SBLOCCA LA DASHBOARD
        affinity_data: { 
          interests: profile.tags,
          bio: profile.bio,
          completed_at: new Date().toISOString()
        }
      });

      if (error) throw error;

      // Redirect forzato alla Dashboard
      window.location.href = "/dashboard";

    } catch (err) {
      console.error("Errore:", err);
      alert(err.message || "Errore nel salvataggio.");
    } finally {
      setLoading(false);
    }
  };

  // --- RENDERING DEL CATALOGO (RICORSIVO) ---
  const renderDNANode = (node, depth = 0) => {
    return Object.entries(node).map(([key, value]) => {
      if (Array.isArray(value)) {
        return (
          <div key={key} style={styles.tagGroup}>
            <h4 style={styles.subCategoryTitle}>{key}</h4>
            <div style={styles.tagWrapper}>
              {value.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  style={profile.tags.includes(tag) ? styles.tagActive : styles.tagInactive}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        );
      } 
      return (
        <div key={key} style={{ ...styles.categorySection, borderLeft: depth === 0 ? '2px solid #3b82f6' : 'none', paddingLeft: depth === 0 ? '20px' : '0', marginBottom: '20px' }}>
          <h3 style={depth === 0 ? styles.mainCategoryTitle : styles.midCategoryTitle}>{key}</h3>
          {renderDNANode(value, depth + 1)}
        </div>
      );
    });
  };

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        
        {/* Progress Bar */}
        <div style={styles.progressBg}>
          <div style={{ ...styles.progressFill, width: step === 1 ? '50%' : '100%' }} />
        </div>

        {step === 1 ? (
          <section style={styles.card}>
            <h1 style={styles.title}>L'Inizio</h1>
            <p style={styles.subtitle}>Inserisci i tuoi dati base per iniziare.</p>
            
            <div style={styles.inputStack}>
              <input 
                style={styles.input} placeholder="Nome" 
                value={profile.firstName} onChange={e => setProfile({...profile, firstName: e.target.value})}
              />
              <div style={{position:'relative'}}>
                <input 
                  type="date" style={styles.input} 
                  value={profile.birthDate} onChange={e => setProfile({...profile, birthDate: e.target.value})}
                />
                {age !== null && <span style={styles.ageLabel}>{age} anni</span>}
              </div>
              <select 
                style={styles.input} value={profile.city}
                onChange={e => setProfile({...profile, city: e.target.value})}
              >
                <option value="">Seleziona Provincia</option>
                {PROVINCE_ITALIANE.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <button 
              disabled={!isStep1Valid}
              onClick={() => setStep(2)}
              style={isStep1Valid ? styles.primaryBtn : styles.disabledBtn}
            >
              Prosegui →
            </button>
          </section>
        ) : (
          <section style={styles.cardDNA}>
            <div style={styles.dnaHeader}>
              <h1 style={styles.title}>Componi il tuo DNA</h1>
              <p style={styles.subtitle}>Selezionati: <b>{profile.tags.length}</b> (minimo 5)</p>
            </div>

            <div style={styles.scrollArea}>
              {renderDNANode(MEGA_CATALOGO)}
            </div>

            <div style={styles.footer}>
              <button onClick={() => setStep(1)} style={styles.backBtn}>Indietro</button>
              <button 
                onClick={handleFinalSave}
                disabled={loading || profile.tags.length < 5}
                style={profile.tags.length >= 5 ? styles.saveBtn : styles.disabledBtn}
              >
                {loading ? "Sincronizzazione..." : "ENTRA NEL CIRCLO"}
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

// --- STILI ---
const styles = {
  page: { height: '100vh', background: '#f0f4f8', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: '"Segoe UI", sans-serif' },
  container: { width: '90%', maxWidth: '500px' },
  progressBg: { width: '100%', height: '4px', background: '#e2e8f0', marginBottom: '20px', borderRadius: '10px', overflow: 'hidden' },
  progressFill: { height: '100%', background: '#3b82f6', transition: 'width 0.4s ease' },
  card: { background: 'white', padding: '40px', borderRadius: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid rgba(255,255,255,0.7)' },
  cardDNA: { background: 'white', borderRadius: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', height: '80vh', display: 'flex', flexDirection: 'column' },
  title: { fontSize: '24px', fontWeight: '800', color: '#334155', marginBottom: '8px' },
  subtitle: { color: '#64748b', fontSize: '14px', marginBottom: '30px' },
  inputStack: { display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' },
  input: { padding: '15px', borderRadius: '15px', border: '1px solid #e2e8f0', fontSize: '16px', outline: 'none', background: '#f8fafc', width: '100%' },
  ageLabel: { position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: '#3b82f6', fontWeight: 'bold', fontSize: '13px' },
  dnaHeader: { padding: '30px 30px 10px 30px' },
  scrollArea: { flex: 1, overflowY: 'auto', padding: '0 30px 30px 30px' },
  mainCategoryTitle: { fontSize: '20px', fontWeight: '800', color: '#3b82f6', marginBottom: '15px' },
  midCategoryTitle: { fontSize: '16px', fontWeight: '700', color: '#475569', marginTop: '15px' },
  subCategoryTitle: { fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' },
  tagWrapper: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' },
  tagInactive: { padding: '8px 14px', borderRadius: '12px', background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#64748b', fontSize: '13px', cursor: 'pointer' },
  tagActive: { padding: '8px 14px', borderRadius: '12px', background: '#3b82f6', border: '1px solid #3b82f6', color: 'white', fontSize: '13px', fontWeight: 'bold' },
  footer: { padding: '20px 30px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '10px' },
  primaryBtn: { width: '100%', padding: '16px', borderRadius: '15px', background: '#3b82f6', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer' },
  saveBtn: { flex: 2, padding: '16px', borderRadius: '15px', background: '#3b82f6', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer' },
  backBtn: { flex: 1, padding: '16px', borderRadius: '15px', background: 'white', color: '#64748b', border: '1px solid #e2e8f0', cursor: 'pointer' },
  disabledBtn: { width: '100%', padding: '16px', borderRadius: '15px', background: '#e2e8f0', color: '#94a3b8', border: 'none', cursor: 'not-allowed' }
};
