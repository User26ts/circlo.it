"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { MEGA_CATALOGO, PROVINCE_ITALIANE } from "./catalog";

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

export default function Onboarding() {
  const [formData, setFormData] = useState({ firstName: "", birthDate: "", city: "", tags: [] });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.birthDate || !formData.city || formData.tags.length < 3) {
      alert("Inserisci tutti i dati e seleziona almeno 3 interessi per un match accurato!");
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

  // Funzione ricorsiva per renderizzare il tuo catalogo complesso
  const renderTags = (obj) => {
    return Object.entries(obj).map(([key, value]) => {
      if (Array.isArray(value)) {
        return (
          <div key={key} style={styles.subCatBlock}>
            <h5 style={styles.subCatTitle}>{key}</h5>
            <div style={styles.tagGrid}>
              {value.map(t => (
                <button 
                  key={t} type="button" 
                  onClick={() => toggleTag(t)}
                  style={formData.tags.includes(t) ? styles.tagActive : styles.tagInactive}
                >
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
        <header style={styles.header}>
          <h1 style={styles.title}>Configura il tuo DNA</h1>
          <p style={styles.subtitle}>Le tue passioni definiranno i tuoi incontri.</p>
        </header>

        <form onSubmit={handleSave} style={styles.form}>
          <section style={styles.section}>
            <input 
              style={styles.input} placeholder="Nome" 
              value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} 
            />
            <input 
              type="date" style={styles.input} 
              value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} 
            />
            <select 
              style={styles.input} value={formData.city} 
              onChange={e => setFormData({...formData, city: e.target.value})}
            >
              <option value="">Seleziona Provincia</option>
              {PROVINCE_ITALIANE.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </section>

          <div style={styles.divider} />

          <section style={styles.catalogArea}>
            <p style={styles.catalogLabel}>Seleziona i tuoi interessi (min. 3)</p>
            {renderTags(MEGA_CATALOGO)}
          </section>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? "Salvataggio..." : "Entra in Circlo"}
          </button>
        </form>
      </div>
    </main>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#f5f7fa', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  glassCard: { background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(20px)', borderRadius: '32px', padding: '35px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', border: '1px solid #ffffff', maxHeight: '92vh', display: 'flex', flexDirection: 'column' },
  header: { textAlign: 'center', marginBottom: '25px' },
  title: { fontSize: '24px', fontWeight: '850', color: '#111', margin: '0 0 8px 0', letterSpacing: '-0.5px' },
  subtitle: { fontSize: '14px', color: '#666', margin: 0 },
  form: { overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', paddingRight: '5px' },
  section: { display: 'flex', flexDirection: 'column', gap: '12px' },
  input: { padding: '15px', borderRadius: '14px', border: '1px solid #e1e4e8', fontSize: '15px', outline: 'none', background: '#fcfcfc', transition: 'border 0.2s' },
  divider: { height: '1px', background: '#eee', margin: '10px 0' },
  catalogArea: { display: 'flex', flexDirection: 'column', gap: '15px' },
  catalogLabel: { fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: '#999', letterSpacing: '0.5px' },
  catBlock: { marginBottom: '20px', padding: '15px', background: '#fff', borderRadius: '18px', border: '1px solid #f0f0f0' },
  catTitle: { fontSize: '18px', fontWeight: '800', margin: '0 0 15px 0', color: '#111' },
  subCatBlock: { marginBottom: '15px' },
  subCatTitle: { fontSize: '13px', fontWeight: '600', color: '#444', margin: '0 0 8px 0' },
  tagGrid: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  tagInactive: { padding: '7px 14px', borderRadius: '10px', background: '#f5f7fa', border: '1px solid #e1e4e8', fontSize: '13px', cursor: 'pointer', transition: '0.2s', color: '#444' },
  tagActive: { padding: '7px 14px', borderRadius: '10px', background: '#007AFF', border: '1px solid #007AFF', fontSize: '13px', cursor: 'pointer', color: '#fff', fontWeight: '600', boxShadow: '0 4px 12px rgba(0,122,255,0.2)' },
  submitBtn: { padding: '18px', borderRadius: '16px', border: 'none', background: '#111', color: '#fff', fontWeight: '700', fontSize: '16px', cursor: 'pointer', marginTop: '10px', position: 'sticky', bottom: 0 },
};
