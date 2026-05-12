"use client";
import { useState, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { MEGA_CATALOGO, PROVINCE_ITALIANE } from "./catalog";

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

export default function Onboarding() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({ firstName: "", birthDate: "", city: "", tags: [], bio: "" });

  // Calcolo età in tempo reale
  const age = useMemo(() => {
    if (!profile.birthDate) return null;
    const today = new Date();
    const birth = new Date(profile.birthDate);
    let a = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) a--;
    return a;
  }, [profile.birthDate]);

  const toggleTag = (tag) => {
    setProfile(p => ({
      ...p,
      tags: p.tags.includes(tag) ? p.tags.filter(t => t !== tag) : [...p.tags, tag]
    }));
  };

  const saveDNA = async () => {
    if (profile.tags.length < 5) return alert("Seleziona almeno 5 tag per il tuo DNA.");
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        first_name: profile.firstName,
        birth_date: profile.birthDate,
        city: profile.city,
        setup_finished: true, // LA CHIAVE CHE SBLOCCA TUTTO
        affinity_data: { interests: profile.tags, bio: profile.bio }
      });
      if (error) throw error;
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Errore nel salvataggio. Riprova.");
    } finally { setLoading(false); }
  };

  const renderCatalog = (node, depth = 0) => {
    return Object.entries(node).map(([key, value]) => {
      if (Array.isArray(value)) {
        return (
          <div key={key} style={{marginBottom: '15px'}}>
            <h4 style={styles.subLabel}>{key}</h4>
            <div style={styles.tagGrid}>
              {value.map(t => (
                <button key={t} onClick={() => toggleTag(t)} style={profile.tags.includes(t) ? styles.tagActive : styles.tag}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        );
      }
      return (
        <div key={key} style={{marginBottom: '25px', borderLeft: depth === 0 ? '2px solid #00d1ff' : 'none', paddingLeft: '15px'}}>
          <h3 style={depth === 0 ? styles.catTitle : styles.subCatTitle}>{key}</h3>
          {renderCatalog(value, depth + 1)}
        </div>
      );
    });
  };

  return (
    <main style={styles.page}>
      <div style={styles.aurora}></div>
      <div style={step === 1 ? styles.glassCard : styles.glassCardLarge}>
        {step === 1 ? (
          <>
            <h1 style={styles.title}>L'Inizio<span style={{color:'#00d1ff'}}>.</span></h1>
            <p style={styles.subtitle}>Inserisci i tuoi dati per iniziare.</p>
            <div style={styles.inputStack}>
              <input style={styles.input} placeholder="Nome" value={profile.firstName} onChange={e => setProfile({...profile, firstName: e.target.value})} />
              <input type="date" style={styles.input} value={profile.birthDate} onChange={e => setProfile({...profile, birthDate: e.target.value})} />
              <select style={styles.input} value={profile.city} onChange={e => setProfile({...profile, city: e.target.value})}>
                <option value="">Città/Provincia</option>
                {PROVINCE_ITALIANE.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <button disabled={!profile.firstName || age < 18 || !profile.city} onClick={() => setStep(2)} style={styles.btnMain}>Prosegui →</button>
          </>
        ) : (
          <div style={{display:'flex', flexDirection:'column', height:'100%'}}>
            <h2 style={styles.title}>Il tuo DNA🧬</h2>
            <p style={styles.subtitle}>Selezionati: {profile.tags.length}/5</p>
            <div style={styles.scrollArea}>{renderCatalog(MEGA_CATALOGO)}</div>
            <button onClick={saveDNA} disabled={profile.tags.length < 5 || loading} style={styles.btnMain}>
              {loading ? "Sincronizzazione..." : "ENTRA NEL CIRCLO"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4f8', position: 'relative', overflow: 'hidden', fontFamily: 'sans-serif' },
  aurora: { position: 'absolute', width: '100%', height: '100%', background: 'radial-gradient(circle at 10% 10%, rgba(0,209,255,0.15) 0%, transparent 50%), radial-gradient(circle at 90% 90%, rgba(59,130,246,0.2) 0%, transparent 50%)', filter: 'blur(80px)' },
  glassCard: { zIndex: 2, background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(20px)', borderRadius: '35px', padding: '40px', width: '90%', maxWidth: '400px', border: '1px solid white', boxShadow: '0 15px 35px rgba(0,0,0,0.05)' },
  glassCardLarge: { zIndex: 2, background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(20px)', borderRadius: '35px', padding: '30px', width: '95%', maxWidth: '500px', height: '85vh', display: 'flex', flexDirection: 'column', border: '1px solid white' },
  title: { fontSize: '2rem', fontWeight: '800', color: '#1e293b', margin: '0 0 10px 0' },
  subtitle: { fontSize: '0.9rem', color: '#64748b', marginBottom: '30px' },
  inputStack: { display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' },
  input: { padding: '15px', borderRadius: '15px', border: '1px solid #e2e8f0', background: 'white', outline: 'none', fontSize: '1rem' },
  btnMain: { padding: '18px', background: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)', color: 'white', border: 'none', borderRadius: '100px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 8px 20px rgba(37, 99, 235, 0.2)' },
  scrollArea: { flex: 1, overflowY: 'auto', paddingRight: '10px', marginBottom: '20px' },
  catTitle: { fontSize: '1.2rem', color: '#3b82f6', marginBottom: '10px' },
  subCatTitle: { fontSize: '1rem', color: '#475569', marginBottom: '10px', fontWeight: '700' },
  subLabel: { fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' },
  tagGrid: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '5px' },
  tag: { padding: '8px 12px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.8rem', cursor: 'pointer' },
  tagActive: { padding: '8px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold' }
};
