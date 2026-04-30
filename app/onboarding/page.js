"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

// IMPORTA LE TUE COSTANTI QUI
// Cambia il percorso "@/" in base a dove hai salvato il tuo file con il catalogo
import { DNA_CATALOG, PROVINCE_ITALIANE } from "@/lib/data"; 

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

export default function OnboardingPremium() {
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
    if (!formData.firstName || !formData.birthDate || !formData.city || formData.tags.length === 0) {
      alert("Tutti i campi (Nome, Data, Provincia) e almeno un interesse sono obbligatori!");
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { error } = await supabase.from('profiles').update({ 
        first_name: formData.firstName, 
        birth_date: formData.birthDate, 
        city: formData.city,
        affinity_data: { interests: formData.tags }
      }).eq('id', session.user.id);

      if (error) throw error;
      
      router.push("/discovery");
    } catch (err) {
      alert("Errore nel salvataggio: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Crea il tuo Profilo</h1>
        <p style={styles.subtitle}>Iniziamo dalle basi. Chi sei e cosa ami fare?</p>
        
        <form onSubmit={handleSave} style={styles.form}>
          
          {/* DATI BASE */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Come ti chiami?</label>
            <input style={styles.input} placeholder="Il tuo nome" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Quando sei nato/a?</label>
            <input type="date" style={styles.input} value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} required />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>In che provincia vivi?</label>
            <select style={styles.input} value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required>
              <option value="">Seleziona Provincia...</option>
              {/* Usa l'array importato */}
              {PROVINCE_ITALIANE?.map(prov => <option key={prov} value={prov}>{prov}</option>)}
            </select>
          </div>

          <hr style={styles.divider} />

          {/* SEZIONE DNA - Dinamica dal tuo file */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Seleziona il tuo DNA (Più ne metti, migliori saranno i match)</label>
            
            <div style={styles.dnaScrollArea}>
              {/* Controlla se il catalogo esiste prima di mapparlo */}
              {DNA_CATALOG && Object.entries(DNA_CATALOG).map(([categoryName, tags]) => (
                <div key={categoryName} style={styles.categoryBlock}>
                  <h3 style={styles.categoryTitle}>{categoryName}</h3>
                  <div style={styles.tagGrid}>
                    {tags.map(t => (
                      <button 
                        type="button" 
                        key={t} 
                        onClick={() => toggleTag(t)} 
                        style={formData.tags.includes(t) ? styles.tagActive : styles.tagInactive}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PULSANTE SALVA */}
          <div style={styles.stickyFooter}>
            <button type="submit" disabled={loading} style={styles.btn}>
              {loading ? "Salvataggio in corso..." : "Salva e Scopri Match"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '20px', fontFamily: '-apple-system, system-ui, sans-serif' },
  card: { backgroundColor: '#fff', padding: '40px', borderRadius: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', maxWidth: '500px', width: '100%', border: '1px solid #e2e8f0', maxHeight: '90vh', overflowY: 'hidden', display: 'flex', flexDirection: 'column' },
  title: { fontSize: '28px', fontWeight: '900', marginBottom: '8px', color: '#0f172a' },
  subtitle: { fontSize: '15px', color: '#64748b', marginBottom: '25px', lineHeight: '1.4' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', paddingRight: '5px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '13px', fontWeight: '700', color: '#334155' },
  input: { padding: '15px', borderRadius: '14px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', outline: 'none', fontSize: '15px', color: '#0f172a', width: '100%' },
  divider: { border: 'none', borderTop: '1px solid #e2e8f0', margin: '10px 0' },
  dnaScrollArea: { display: 'flex', flexDirection: 'column', gap: '20px' },
  categoryBlock: { display: 'flex', flexDirection: 'column', gap: '10px' },
  categoryTitle: { fontSize: '14px', fontWeight: '800', color: '#0f172a', margin: 0 },
  tagGrid: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  tagInactive: { padding: '8px 14px', borderRadius: '12px', border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#64748b', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s ease' },
  tagActive: { padding: '8px 14px', borderRadius: '12px', border: '1px solid #3b82f6', backgroundColor: '#eff6ff', color: '#3b82f6', cursor: 'pointer', fontSize: '13px', fontWeight: '700', transition: 'all 0.2s ease', transform: 'scale(1.02)' },
  stickyFooter: { position: 'sticky', bottom: 0, backgroundColor: '#fff', paddingTop: '15px', borderTop: '1px solid transparent' },
  btn: { width: '100%', padding: '16px', borderRadius: '14px', border: 'none', backgroundColor: '#0f172a', color: '#fff', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }
};
