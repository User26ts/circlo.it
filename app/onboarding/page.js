"use client";
import { useState, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

// CORREZIONE QUI: Importiamo esattamente i nomi esportati
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

  // Logica Età
  const age = useMemo(() => {
    if (!profile.birthDate) return null;
    const today = new Date();
    const birth = new Date(profile.birthDate);
    let a = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) a--;
    return a;
  }, [profile.birthDate]);

  const isStep1Valid = profile.firstName && profile.birthDate && profile.city && age >= 18;

  const toggleTag = (tag) => {
    setProfile(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag) 
        : [...prev.tags, tag]
    }));
  };

  const handleFinalSave = async () => {
    if (profile.tags.length < 5) {
      alert("Seleziona almeno 5 elementi per definire il tuo DNA.");
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Sessione scaduta");

      const { error } = await supabase.from('profiles').update({
        first_name: profile.firstName,
        birth_date: profile.birthDate,
        city: profile.city,
        affinity_data: { 
          interests: profile.tags,
          bio: profile.bio,
          setup_completed_at: new Date().toISOString()
        }
      }).eq('id', session.user.id);

      if (error) throw error;
      router.push("/discovery");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // RENDERING RICORSIVO COMPLESSO
  const renderDNANode = (node, depth = 0) => {
    return Object.entries(node).map(([key, value]) => {
      // Se è un array (es. "Generi": [...])
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
      // Se è un oggetto (es. "Musica": { ... })
      return (
        <div key={key} style={{ ...styles.categorySection, borderLeft: depth === 0 ? '2px solid #222' : 'none', paddingLeft: depth === 0 ? '20px' : '0' }}>
          <h3 style={depth === 0 ? styles.mainCategoryTitle : styles.midCategoryTitle}>
            {key}
          </h3>
          {renderDNANode(value, depth + 1)}
        </div>
      );
    });
  };

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        
        {/* Progress bar Premium */}
        <div style={styles.progressContainer}>
          <div style={{ ...styles.progressBar, width: step === 1 ? '30%' : '100%' }} />
        </div>

        {step === 1 ? (
          <section style={styles.card}>
            <h1 style={styles.title}>L'Inizio</h1>
            <p style={styles.subtitle}>Chi sei e dove ti trovi.</p>
            
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
                {age && <span style={styles.ageLabel}>{age} anni</span>}
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
              Componi DNA →
            </button>
          </section>
        ) : (
          <section style={styles.cardDNA}>
            <div style={styles.headerDNA}>
              <h1 style={styles.title}>DNA Explorer</h1>
              <p style={styles.subtitle}>Selezionati: <b>{profile.tags.length}</b></p>
            </div>

            <div style={styles.scrollArea}>
              {/* Qui usiamo il MEGA_CATALOGO importato */}
              {renderDNANode(MEGA_CATALOGO)}
            </div>

            <div style={styles.footer}>
              <button onClick={() => setStep(1)} style={styles.backBtn}>Torna indietro</button>
              <button 
                onClick={handleFinalSave}
                disabled={loading || profile.tags.length < 5}
                style={profile.tags.length >= 5 ? styles.saveBtn : styles.disabledBtn}
              >
                {loading ? "Generazione..." : "Entra nel Cerchio"}
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

// STILI PREMIUM OBSIDIAN
const styles = {
  page: { height: '100vh', background: '#050505', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontFamily: 'Inter, sans-serif' },
  container: { width: '100%', maxWidth: '650px', padding: '20px' },
  progressContainer: { width: '100%', height: '2px', background: '#111', marginBottom: '30px' },
  progressBar: { height: '100%', background: '#007AFF', transition: 'width 0.6s cubic-bezier(0.65, 0, 0.35, 1)' },
  card: { background: '#0f0f0f', padding: '50px', borderRadius: '40px', border: '1px solid #1a1a1a', boxShadow: '0 40px 100px rgba(0,0,0,0.8)' },
  cardDNA: { background: '#0f0f0f', borderRadius: '40px', border: '1px solid #1a1a1a', height: '80vh', display: 'flex', flexDirection: 'column' },
  title: { fontSize: '32px', fontWeight: '900', letterSpacing: '-1.5px', marginBottom: '10px' },
  subtitle: { color: '#666', marginBottom: '40px', fontSize: '16px' },
  inputStack: { display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '40px' },
  input: { background: '#151515', border: '1px solid #222', padding: '20px', borderRadius: '18px', color: '#fff', fontSize: '16px', outline: 'none' },
  ageLabel: { position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', color: '#007AFF', fontWeight: 'bold' },
  scrollArea: { flex: 1, overflowY: 'auto', padding: '0 40px 40px 40px' },
  mainCategoryTitle: { fontSize: '24px', fontWeight: '900', color: '#007AFF', marginTop: '40px', marginBottom: '20px' },
  midCategoryTitle: { fontSize: '18px', fontWeight: '700', color: '#eee', margin: '25px 0 15px 0' },
  subCategoryTitle: { fontSize: '11px', color: '#444', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' },
  tagWrapper: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
  tagInactive: { background: '#151515', color: '#555', padding: '10px 20px', borderRadius: '14px', border: '1px solid #222', cursor: 'pointer', transition: '0.3s' },
  tagActive: { background: '#007AFF', color: '#fff', padding: '10px 20px', borderRadius: '14px', border: '1px solid #007AFF', fontWeight: 'bold', boxShadow: '0 0 20px rgba(0,122,255,0.3)' },
  footer: { padding: '30px 40px', borderTop: '1px solid #1a1a1a', display: 'flex', gap: '20px' },
  primaryBtn: { width: '100%', padding: '20px', borderRadius: '20px', background: '#007AFF', color: '#fff', fontWeight: 'bold', border: 'none', cursor: 'pointer' },
  saveBtn: { flex: 2, padding: '20px', borderRadius: '20px', background: '#fff', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer' },
  backBtn: { flex: 1, background: 'transparent', border: '1px solid #222', color: '#666', borderRadius: '20px', cursor: 'pointer' },
  disabledBtn: { width: '100%', padding: '20px', borderRadius: '20px', background: '#111', color: '#333', border: 'none', cursor: 'not-allowed' }
};
