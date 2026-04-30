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
  const [step, setStep] = useState(1);
  
  const [profile, setProfile] = useState({
    firstName: "",
    birthDate: "",
    city: "",
    tags: [],
    bio: ""
  });

  // Calcolo Età Dinamico e Reattivo
  const age = useMemo(() => {
    if (!profile.birthDate) return null;
    const today = new Date();
    const birth = new Date(profile.birthDate);
    let a = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) a--;
    return a;
  }, [profile.birthDate]);

  // Validazione Step 1 (Obbligatorio 18+)
  const isStep1Valid = profile.firstName.trim().length > 1 && profile.birthDate && profile.city && age >= 18;

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
      alert("Il tuo DNA è incompleto. Seleziona almeno 5 tag.");
      return;
    }

    setLoading(true);
    try {
      // 1. Recupero utente certo (GetUser è più sicuro di getSession)
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("Sessione non valida. Riesegui il login.");

      // 2. Operazione di UPSERT (Crea se manca, aggiorna se esiste)
      // Risolve il problema del redirect al login per i nuovi profili
      const { error: dbError } = await supabase.from('profiles').upsert({
        id: user.id,
        first_name: profile.firstName,
        birth_date: profile.birthDate,
        city: profile.city,
        affinity_data: { 
          interests: profile.tags,
          bio: profile.bio,
          completed: true,
          updated_at: new Date().toISOString()
        }
      });

      if (dbError) throw dbError;

      // 3. Reindirizzamento forzato (window.location evita glitch di Next.js)
      window.location.href = "/discovery";

    } catch (err) {
      console.error("Errore critico:", err);
      alert(err.message || "Errore durante il salvataggio.");
    } finally {
      setLoading(false);
    }
  };

  // Rendering Ricorsivo per il Mega Catalogo (Gestisce Dreamcore/Liminal/ecc.)
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
        <div key={key} style={{ ...styles.categorySection, borderLeft: depth === 0 ? '2px solid #007AFF' : 'none', paddingLeft: depth === 0 ? '20px' : '0' }}>
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
        
        <div style={styles.progressContainer}>
          <div style={{ ...styles.progressBar, width: step === 1 ? '40%' : '100%' }} />
        </div>

        {step === 1 ? (
          <section style={styles.card}>
            <h1 style={styles.title}>Benvenuto</h1>
            <p style={styles.subtitle}>Configura la tua identità di base.</p>
            
            <div style={styles.inputStack}>
              <div style={styles.field}>
                <label style={styles.label}>NOME</label>
                <input 
                  style={styles.input} placeholder="Il tuo nome" 
                  value={profile.firstName} onChange={e => setProfile({...profile, firstName: e.target.value})}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>DATA DI NASCITA</label>
                <div style={{position:'relative'}}>
                  <input 
                    type="date" style={styles.input} 
                    value={profile.birthDate} onChange={e => setProfile({...profile, birthDate: e.target.value})}
                  />
                  {age !== null && <span style={styles.ageLabel}>{age} anni</span>}
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>CITTÀ</label>
                <select 
                  style={styles.input} value={profile.city}
                  onChange={e => setProfile({...profile, city: e.target.value})}
                >
                  <option value="">Dove ti trovi?</option>
                  {PROVINCE_ITALIANE.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <button 
              disabled={!isStep1Valid}
              onClick={() => setStep(2)}
              style={isStep1Valid ? styles.primaryBtn : styles.disabledBtn}
            >
              Componi il tuo DNA →
            </button>
          </section>
        ) : (
          <section style={styles.cardDNA}>
            <div style={styles.headerDNA}>
              <h1 style={styles.title}>Componi il DNA</h1>
              <p style={styles.subtitle}>Seleziona gli elementi che ti definiscono (<b>{profile.tags.length}</b> selezionati)</p>
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
  page: { height: '100vh', background: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontFamily: '-apple-system, system-ui, sans-serif' },
  container: { width: '100%', maxWidth: '600px', padding: '20px' },
  progressContainer: { width: '100%', height: '3px', background: '#111', marginBottom: '25px', borderRadius: '10px', overflow: 'hidden' },
  progressBar: { height: '100%', background: '#007AFF', transition: 'width 0.5s ease' },
  card: { background: '#0A0A0A', padding: '40px', borderRadius: '30px', border: '1px solid #1A1A1A', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' },
  cardDNA: { background: '#0A0A0A', borderRadius: '30px', border: '1px solid #1A1A1A', height: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  title: { fontSize: '28px', fontWeight: '850', letterSpacing: '-1px', marginBottom: '8px' },
  subtitle: { color: '#666', marginBottom: '30px', fontSize: '15px' },
  inputStack: { display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '35px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '10px', fontWeight: '800', color: '#444', letterSpacing: '1px' },
  input: { background: '#111', border: '1px solid #222', padding: '16px', borderRadius: '15px', color: '#fff', fontSize: '16px', outline: 'none', width: '100%' },
  ageLabel: { position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: '#007AFF', fontWeight: '700', fontSize: '14px' },
  scrollArea: { flex: 1, overflowY: 'auto', padding: '0 30px 30px 30px' },
  mainCategoryTitle: { fontSize: '22px', fontWeight: '900', color: '#007AFF', marginTop: '35px', marginBottom: '15px' },
  midCategoryTitle: { fontSize: '17px', fontWeight: '700', color: '#eee', margin: '20px 0 10px 0' },
  subCategoryTitle: { fontSize: '11px', color: '#555', fontWeight: '900', textTransform: 'uppercase', marginBottom: '10px' },
  tagWrapper: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  tagInactive: { background: '#111', color: '#777', padding: '9px 15px', borderRadius: '12px', border: '1px solid #222', cursor: 'pointer', fontSize: '13px', transition: '0.2s' },
  tagActive: { background: '#007AFF', color: '#fff', padding: '9px 15px', borderRadius: '12px', border: '1px solid #007AFF', fontWeight: '600', fontSize: '13px', boxShadow: '0 0 15px rgba(0,122,255,0.3)' },
  footer: { padding: '25px 30px', borderTop: '1px solid #1A1A1A', background: '#0A0A0A', display: 'flex', gap: '15px' },
  primaryBtn: { width: '100%', padding: '18px', borderRadius: '15px', background: '#007AFF', color: '#fff', fontWeight: '700', border: 'none', cursor: 'pointer' },
  saveBtn: { flex: 2, padding: '18px', borderRadius: '15px', background: '#fff', color: '#000', fontWeight: '700', border: 'none', cursor: 'pointer' },
  backBtn: { flex: 1, background: 'transparent', border: '1px solid #222', color: '#666', borderRadius: '15px', cursor: 'pointer', fontWeight: '600' },
  disabledBtn: { width: '100%', padding: '18px', borderRadius: '15px', background: '#111', color: '#333', border: 'none', cursor: 'not-allowed' },
  headerDNA: { padding: '30px' }
};
