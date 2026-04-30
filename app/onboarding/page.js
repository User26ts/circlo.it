"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { DNA_CATALOG, PROVINCE_ITALIANE } from "../../lib/data"; // Percorso relativo corretto

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
    if (!formData.firstName || !formData.birthDate || !formData.city || formData.tags.length === 0) {
      alert("Compila tutti i campi e seleziona almeno un interesse!");
      return;
    }

    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      alert("Sessione scaduta. Effettua di nuovo il login.");
      return router.push("/");
    }

    const { error } = await supabase.from('profiles').update({ 
      first_name: formData.firstName, 
      birth_date: formData.birthDate, 
      city: formData.city,
      affinity_data: { interests: formData.tags }
    }).eq('id', session.user.id);

    if (error) {
      alert("Errore database: " + error.message);
    } else {
      router.push("/discovery");
    }
    setLoading(false);
  };

  return (
    <main style={styles.container}>
      <div style={styles.glassCard}>
        <h1 style={styles.title}>Crea il tuo Profilo</h1>
        <p style={styles.subtitle}>Inserisci i tuoi dati per trovare persone affini.</p>
        
        <form onSubmit={handleSave} style={styles.form}>
          <input 
            style={styles.input} 
            placeholder="Nome" 
            value={formData.firstName} 
            onChange={e => setFormData({...formData, firstName: e.target.value})} 
            required 
          />
          
          <input 
            type="date" 
            style={styles.input} 
            value={formData.birthDate} 
            onChange={e => setFormData({...formData, birthDate: e.target.value})} 
            required 
          />

          <select 
            style={styles.input} 
            value={formData.city} 
            onChange={e => setFormData({...formData, city: e.target.value})} 
            required
          >
            <option value="">Seleziona Provincia...</option>
            {PROVINCE_ITALIANE.map(p => <option key={p} value={p}>{p}</option>)}
          </select>

          <div style={styles.dnaContainer}>
            <p style={styles.label}>🧬 Il tuo DNA (Interessi)</p>
            <div style={styles.scrollArea}>
              {Object.entries(DNA_CATALOG).map(([cat, tags]) => (
                <div key={cat} style={{ marginBottom: '15px' }}>
                  <h4 style={styles.catTitle}>{cat}</h4>
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

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? "Sincronizzazione..." : "Salva e Continua"}
          </button>
        </form>
      </div>
    </main>
  );
}

const styles = {
  container: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5', padding: '20px', fontFamily: 'sans-serif' },
  glassCard: { background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', borderRadius: '30px', padding: '40px', width: '100%', maxWidth: '450px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #fff', display: 'flex', flexDirection: 'column', maxHeight: '90vh' },
  title: { fontSize: '24px', fontWeight: '800', margin: '0 0 10px 0', color: '#1a1a1a' },
  subtitle: { fontSize: '14px', color: '#666', marginBottom: '30px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto' },
  input: { padding: '14px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '16px', outline: 'none', background: '#fff' },
  dnaContainer: { marginTop: '10px' },
  label: { fontWeight: '700', fontSize: '14px', marginBottom: '10px', display: 'block' },
  scrollArea: { maxHeight: '250px', overflowY: 'auto', paddingRight: '10px' },
  catTitle: { fontSize: '12px', textTransform: 'uppercase', color: '#999', margin: '15px 0 8px 0' },
  tagGrid: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  tagInactive: { padding: '8px 12px', borderRadius: '10px', border: '1px solid #eee', background: '#fff', fontSize: '13px', cursor: 'pointer' },
  tagActive: { padding: '8px 12px', borderRadius: '10px', border: '1px solid #0070f3', background: '#0070f3', color: '#fff', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold' },
  btn: { padding: '16px', borderRadius: '12px', border: 'none', background: '#1a1a1a', color: '#fff', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '20px' }
};
