"use client";
import { useState, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { MEGA_CATALOGO, PROVINCE_ITALIANE } from "./catalog";

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

export default function OnboardingDNA() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({ firstName: "", birthDate: "", city: "", tags: [], bio: "" });

  const age = useMemo(() => {
    if (!profile.birthDate) return null;
    const today = new Date();
    const birth = new Date(profile.birthDate);
    let a = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) a--;
    return a;
  }, [profile.birthDate]);

  const toggleTag = (tag) => {
    setProfile(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
    }));
  };

  const handleFinalSave = async () => {
    if (profile.tags.length < 5) return alert("Seleziona almeno 5 tag!");
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        first_name: profile.firstName,
        birth_date: profile.birthDate,
        city: profile.city,
        setup_finished: true, // SBLOCCA L'ACCESSO PERMANENTE
        affinity_data: { interests: profile.tags, bio: profile.bio }
      });
      if (error) throw error;
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Errore nel salvataggio.");
    } finally {
      setLoading(false);
    }
  };

  const renderDNANode = (node, depth = 0) => {
    return Object.entries(node).map(([key, value]) => {
      if (Array.isArray(value)) {
        return (
          <div key={key} style={styles.tagGroup}>
            <h4 style={styles.subCategoryTitle}>{key}</h4>
            <div style={styles.tagWrapper}>
              {value.map(tag => (
                <button key={tag} onClick={() => toggleTag(tag)} style={profile.tags.includes(tag) ? styles.tagActive : styles.tagInactive}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        );
      } 
      return (
        <div key={key} style={{ borderLeft: depth === 0 ? '2px solid #3b82f6' : 'none', paddingLeft: depth === 0 ? '20px' : '0', marginBottom: '20px' }}>
          <h3 style={depth === 0 ? styles.mainCategoryTitle : styles.midCategoryTitle}>{key}</h3>
          {renderDNANode(value, depth + 1)}
        </div>
      );
    });
  };

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        {step === 1 ? (
          <section style={styles.card}>
            <h1 style={styles.title}>L'Inizio</h1>
            <div style={styles.inputStack}>
              <input style={styles.input} placeholder="Nome" value={profile.firstName} onChange={e => setProfile({...profile, firstName: e.target.value})} />
              <input type="date" style={styles.input} value={profile.birthDate} onChange={e => setProfile({...profile, birthDate: e.target.value})} />
              <select style={styles.input} value={profile.city} onChange={e => setProfile({...profile, city: e.target.value})}>
                <option value="">Provincia</option>
                {PROVINCE_ITALIANE.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <button disabled={!profile.firstName || age < 18} onClick={() => setStep(2)} style={styles.primaryBtn}>Prosegui →</button>
          </section>
        ) : (
          <section style={styles.cardDNA}>
            <div style={{padding: '20px'}}>
              <h1 style={styles.title}>Il tuo DNA</h1>
              <p>Tag selezionati: {profile.tags.length}/5</p>
            </div>
            <div style={styles.scrollArea}>{renderDNANode(MEGA_CATALOGO)}</div>
            <div style={styles.footer}>
              <button onClick={handleFinalSave} disabled={profile.tags.length < 5} style={styles.saveBtn}>
                {loading ? "Sincronizzazione..." : "ENTRA NEL CIRCLO"}
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

const styles = {
  page: { height: '100vh', background: '#f0f4f8', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' },
  container: { width: '90%', maxWidth: '450px' },
  card: { background: 'white', padding: '30px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' },
  cardDNA: { background: 'white', borderRadius: '30px', height: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  inputStack: { display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' },
  input: { padding: '15px', borderRadius: '15px', border: '1px solid #ddd', outline: 'none' },
  scrollArea: { flex: 1, overflowY: 'auto', padding: '0 20px' },
  tagWrapper: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' },
  tagInactive: { padding: '8px 12px', borderRadius: '10px', background: '#f1f5f9', border: 'none', fontSize: '12px', cursor: 'pointer' },
  tagActive: { padding: '8px 12px', borderRadius: '10px', background: '#3b82f6', color: 'white', border: 'none', fontSize: '12px', fontWeight: 'bold' },
  primaryBtn: { width: '100%', padding: '15px', borderRadius: '15px', background: '#3b82f6', color: 'white', border: 'none', fontWeight: 'bold' },
  saveBtn: { width: '100%', padding: '15px', borderRadius: '15px', background: '#3b82f6', color: 'white', border: 'none', fontWeight: 'bold' },
  footer: { padding: '20px', borderTop: '1px solid #eee' },
  mainCategoryTitle: { color: '#3b82f6', fontSize: '18px' },
  subCategoryTitle: { fontSize: '10px', color: '#999', textTransform: 'uppercase' }
};
