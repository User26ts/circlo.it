"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { MEGA_CATALOGO, PROVINCE_ITALIANE } from "./catalog";

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

export default function Onboarding() {
  const [formData, setFormData] = useState({ firstName: "", birthDate: "", city: "", tags: [] });
  const [ageDisplay, setAgeDisplay] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Calcola l'età dinamicamente mentre l'utente inserisce la data
  useEffect(() => {
    if (formData.birthDate) {
      const birth = new Date(formData.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) {
        age--;
      }
      setAgeDisplay(age >= 0 ? age : null);
    }
  }, [formData.birthDate]);

  const toggleTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.birthDate || !formData.city || formData.tags.length < 3) {
      alert("Completa tutti i campi e seleziona almeno 3 interessi!");
      return;
    }

    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return router.push("/");

    const { error } = await supabase.from('profiles').update({ 
      first_name: formData.firstName, 
      birth_date: formData.birthDate, 
      city: formData.city,
      affinity_data: { interests: formData.tags }
    }).eq('id', session.user.id);

    if (error) alert(error.message);
    else router.push("/discovery");
    setLoading(false);
  };

  const renderTags = (obj) => {
    return Object.entries(obj).map(([key, value]) => {
      if (Array.isArray(value)) {
        return (
          <div key={key} style={styles.subCatBlock}>
            <h5 style={styles.subCatTitle}>{key}</h5>
            <div style={styles.tagGrid}>
              {value.map(t => (
                <button key={t} type="button" onClick={() => toggleTag(t)}
                  style={formData.tags.includes(t) ? styles.tagActive : styles.tagInactive}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        );
      } else {
        return (
          <div key={key} style={styles.catBlock}>
            <h4 style={styles.catTitle}>{key}</h4>
            {renderTags(value)}
          </div>
        );
      }
    });
  };

  return (
    <main style={styles.container}>
      <div style={styles.glassCard}>
        <h1 style={styles.title}>Crea il tuo Profilo</h1>
        <form onSubmit={handleSave} style={styles.form}>
          <div style={styles.section}>
            <input style={styles.input} placeholder="Nome" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
            <div style={{position: 'relative'}}>
                <input type="date" style={styles.input} value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} />
                {ageDisplay !== null && <span style={styles.ageBadge}>{ageDisplay} anni</span>}
            </div>
            <select style={styles.input} value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}>
              <option value="">Seleziona Provincia</option>
              {PROVINCE_ITALIANE.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div style={styles.catalogArea}>
            <p style={styles.catalogLabel}>Seleziona il tuo DNA (Interessi)</p>
            {renderTags(MEGA_CATALOGO)}
          </div>
          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? "Salvataggio..." : "Inizia a Scoprire"}
          </button>
        </form>
      </div>
    </main>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', fontFamily: 'sans-serif' },
  glassCard: { background: '#fff', borderRadius: '32px', padding: '30px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', maxHeight: '90vh', display: 'flex', flexDirection: 'column' },
  title: { fontSize: '22px', fontWeight: '800', marginBottom: '20px', textAlign: 'center' },
  form: { overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' },
  section: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px', outline: 'none' },
  ageBadge: { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: '#eff6ff', color: '#3b82f6', padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' },
  catalogArea: { marginTop: '10px' },
  catalogLabel: { fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' },
  catBlock: { marginTop: '15px', borderTop: '1px solid #f1f5f9', paddingTop: '15px' },
  catTitle: { fontSize: '16px', fontWeight: '700', marginBottom: '10px' },
  subCatTitle: { fontSize: '13px', color: '#64748b', marginBottom: '8px' },
  tagGrid: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  tagInactive: { padding: '6px 12px', borderRadius: '10px', background: '#f1f5f9', fontSize: '13px', cursor: 'pointer', border: 'none' },
  tagActive: { padding: '6px 12px', borderRadius: '10px', background: '#3b82f6', color: '#fff', fontSize: '13px', cursor: 'pointer', border: 'none' },
  submitBtn: { padding: '16px', borderRadius: '14px', background: '#0f172a', color: '#fff', fontWeight: 'bold', cursor: 'pointer', border: 'none', position: 'sticky', bottom: 0 }
};
