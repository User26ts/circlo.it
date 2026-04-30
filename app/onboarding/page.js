"use client";
import { useState, useEffect, useMemo } from "react";
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
  const [step, setStep] = useState(1); // 1: Bio, 2: DNA
  
  // State Unificato
  const [profile, setProfile] = useState({
    firstName: "",
    birthDate: "",
    city: "",
    tags: [],
    bio: ""
  });

  // Calcolo Età Dinamico
  const age = useMemo(() => {
    if (!profile.birthDate) return null;
    const today = new Date();
    const birth = new Date(profile.birthDate);
    let a = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) a--;
    return a;
  }, [profile.birthDate]);

  // Validazione Step 1
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
      alert("Il tuo DNA è troppo debole! Seleziona almeno 5 interessi per generare affinità reali.");
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Sessione non trovata");

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

  // RENDERIZZAZIONE RICORSIVA DEL DNA (Il cuore del "Componi il tuo DNA")
  const renderDNANode = (node, depth = 0) => {
    return Object.entries(node).map(([key, value]) => {
      // Caso A: È un array di tag finali
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
      // Caso B: È un oggetto (sottocategoria)
      return (
        <div key={key} style={{ ...styles.categorySection, marginLeft: depth * 10 }}>
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
        
        {/* PROGRESS BAR */}
        <div style={styles.progressContainer}>
          <div style={{ ...styles.progressBar, width: step === 1 ? '50%' : '100%' }} />
        </div>

        {step === 1 ? (
          <section style={styles.card}>
            <div style={styles.header}>
              <h1 style={styles.title}>Le Basi</h1>
              <p style={styles.subtitle}>Identità e localizzazione nel cerchio.</p>
            </div>

            <div style={styles.inputStack}>
              <div style={styles.inputBox}>
                <label style={styles.label}>NOME</label>
                <input 
                  style={styles.input} 
                  placeholder="Come ti chiamano gli amici?" 
                  value={profile.firstName}
                  onChange={e => setProfile({...profile, firstName: e.target.value})}
                />
              </div>

              <div style={styles.inputBox}>
                <label style={styles.label}>DATA DI NASCITA {age && `(${age} anni)`}</label>
                <input 
                  type="date" 
                  style={styles.input} 
                  value={profile.birthDate}
                  onChange={e => setProfile({...profile, birthDate: e.target.value})}
                />
              </div>

              <div style={styles.inputBox}>
                <label style={styles.label}>PROVINCIA DI RIFERIMENTO</label>
                <select 
                  style={styles.input} 
                  value={profile.city}
                  onChange={e => setProfile({...profile, city: e.target.value})}
                >
                  <option value="">Seleziona...</option>
                  {PROVINCE_ITALIANE.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <button 
              disabled={!isStep1Valid}
              onClick={() => setStep(2)}
              style={isStep1Valid ? styles.primaryBtn : styles.disabledBtn}
            >
              Configura DNA →
            </button>
          </section>
        ) : (
          <section style={styles.cardDNA}>
            <div style={styles.headerDNA}>
              <button onClick={() => setStep(1)} style={styles.backBtn}>← Indietro</button>
              <h1 style={styles.title}>Componi il tuo DNA</h1>
              <p style={styles.subtitle}>Selezionati: <b>{profile.tags.length}</b> (minimo 5)</p>
            </div>

            <div style={styles.scrollArea}>
              {renderDNANode(MEGA_CATALOGO)}
            </div>

            <div style={styles.footer}>
              <button 
                onClick={handleFinalSave}
                disabled={loading || profile.tags.length < 5}
                style={profile.tags.length >= 5 ? styles.saveBtn : styles.disabledBtn}
              >
                {loading ? "Sincronizzazione..." : "Genera Affinità"}
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

const styles = {
  page: { 
    height: '100vh', background: '#0a0a0a', display: 'flex', 
    justifyContent: 'center', alignItems: 'center', color: '#fff', 
    fontFamily: '-apple-system, system-ui, sans-serif' 
  },
  container: { width: '100%', maxWidth: '600px', padding: '20px', position: 'relative' },
  progressContainer: { width: '100%', height: '4px', background: '#222', borderRadius: '2px', marginBottom: '20px' },
  progressBar: { height: '100%', background: '#007AFF', borderRadius: '2px', transition: 'width 0.4s ease' },
  
  card: { 
    background: '#161616', padding: '40px', borderRadius: '32px', 
    boxShadow: '0 30px 60px rgba(0,0,0,0.5)', border: '1px solid #222' 
  },
  cardDNA: { 
    background: '#161616', borderRadius: '32px', border: '1px solid #222',
    display: 'flex', flexDirection: 'column', height: '85vh', overflow: 'hidden'
  },
  
  header: { marginBottom: '30px' },
  headerDNA: { padding: '30px 30px 10px 30px', borderBottom: '1px solid #222' },
  title: { fontSize: '28px', fontWeight: '900', letterSpacing: '-1px', margin: '10px 0' },
  subtitle: { color: '#888', fontSize: '15px' },
  
  inputStack: { display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' },
  inputBox: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '11px', fontWeight: '800', color: '#555', letterSpacing: '1px' },
  input: { 
    background: '#222', border: '1px solid #333', padding: '16px', 
    borderRadius: '14px', color: '#fff', fontSize: '16px', outline: 'none' 
  },
  
  scrollArea: { flex: 1, overflowY: 'auto', padding: '20px 30px' },
  categorySection: { marginBottom: '35px' },
  mainCategoryTitle: { fontSize: '22px', color: '#007AFF', fontWeight: '900', marginBottom: '20px', borderBottom: '1px solid #222', paddingBottom: '10px' },
  midCategoryTitle: { fontSize: '16px', color: '#fff', fontWeight: '700', margin: '15px 0' },
  subCategoryTitle: { fontSize: '12px', color: '#555', fontWeight: '800', textTransform: 'uppercase', marginBottom: '10px' },
  
  tagGroup: { marginBottom: '20px' },
  tagWrapper: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  tagInactive: { 
    background: '#222', color: '#aaa', padding: '8px 16px', borderRadius: '20px', 
    border: '1px solid #333', cursor: 'pointer', transition: '0.2s', fontSize: '14px' 
  },
  tagActive: { 
    background: '#007AFF', color: '#fff', padding: '8px 16px', borderRadius: '20px', 
    border: '1px solid #007AFF', cursor: 'pointer', fontWeight: '600', fontSize: '14px',
    boxShadow: '0 0 15px rgba(0,122,255,0.4)'
  },
  
  footer: { padding: '20px 30px', borderTop: '1px solid #222', background: '#1a1a1a' },
  primaryBtn: { 
    width: '100%', padding: '18px', borderRadius: '16px', border: 'none', 
    background: '#007AFF', color: '#fff', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' 
  },
  saveBtn: { 
    width: '100%', padding: '18px', borderRadius: '16px', border: 'none', 
    background: '#fff', color: '#000', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' 
  },
  disabledBtn: { 
    width: '100%', padding: '18px', borderRadius: '16px', border: 'none', 
    background: '#222', color: '#555', fontWeight: 'bold', fontSize: '16px', cursor: 'not-allowed' 
  },
  backBtn: { background: 'none', border: 'none', color: '#007AFF', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }
};
