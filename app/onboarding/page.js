"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

const PROVINCE_ITALIANE = [
  "Agrigento", "Alessandria", "Ancona", "Aosta", "Arezzo", "Ascoli Piceno", "Asti", "Avellino", "Bari", "Barletta-Andria-Trani", "Belluno", "Benevento", "Bergamo", "Biella", "Bologna", "Bolzano", "Brescia", "Brindisi", "Cagliari", "Caltanissetta", "Campobasso", "Caserta", "Catania", "Catanzaro", "Chieti", "Como", "Cosenza", "Cremona", "Crotone", "Cuneo", "Enna", "Fermo", "Ferrara", "Firenze", "Foggia", "Forlì-Cesena", "Frosinone", "Genova", "Gorizia", "Grosseto", "Imperia", "Isernia", "L'Aquila", "La Spezia", "Latina", "Lecce", "Lecco", "Livorno", "Lodi", "Lucca", "Macerata", "Mantova", "Massa-Carrara", "Matera", "Messina", "Milano", "Modena", "Monza e della Brianza", "Napoli", "Novara", "Nuoro", "Oristano", "Padova", "Palermo", "Parma", "Pavia", "Perugia", "Pesaro e Urbino", "Pescara", "Piacenza", "Pisa", "Pistoia", "Pordenone", "Potenza", "Prato", "Ragusa", "Ravenna", "Reggio Calabria", "Reggio Emilia", "Rieti", "Rimini", "Roma", "Rovigo", "Salerno", "Sassari", "Savona", "Siena", "Siracusa", "Sondrio", "Sud Sardegna", "Taranto", "Teramo", "Terni", "Torino", "Trapani", "Trento", "Treviso", "Trieste", "Udine", "Varese", "Venezia", "Verbano-Cusio-Ossola", "Vercelli", "Verona", "Vibo Valentia", "Vicenza", "Viterbo"
];

const INTERESTS = ["Musica", "Tech", "Arte", "Sport", "Gaming", "Viaggi", "Cinema", "Cucina", "Letteratura", "Natura", "Fitness", "Fotografia"];

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
    const { data: { session } } = await supabase.auth.getSession();
    
    const { error } = await supabase.from('profiles').update({ 
      first_name: formData.firstName, 
      birth_date: formData.birthDate, 
      city: formData.city,
      affinity_data: { interests: formData.tags }
    }).eq('id', session.user.id);

    if (error) {
      alert("Errore nel salvataggio: " + error.message);
    } else {
      router.push("/discovery");
    }
    setLoading(false);
  };

  return (
    <main style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Benvenuto su Circlo</h1>
        <p style={styles.subtitle}>Completa il tuo profilo per trovare persone simili a te nella tua zona.</p>
        
        <form onSubmit={handleSave} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Come ti chiami?</label>
            <input style={styles.input} placeholder="Il tuo nome" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Quando sei nato/a?</label>
            <input type="date" style={styles.input} value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} required />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Provincia</label>
            <select style={styles.input} value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required>
              <option value="">Seleziona Provincia...</option>
              {PROVINCE_ITALIANE.map(prov => <option key={prov} value={prov}>{prov}</option>)}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Il tuo DNA (Scegli i tuoi interessi)</label>
            <div style={styles.tagGrid}>
              {INTERESTS.map(t => (
                <button type="button" key={t} onClick={() => toggleTag(t)} style={formData.tags.includes(t) ? styles.tagActive : styles.tagInactive}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? "Salvataggio..." : "Inizia a scoprire"}
          </button>
        </form>
      </div>
    </main>
  );
}

const styles = {
  container: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '20px', fontFamily: '-apple-system, system-ui, sans-serif' },
  card: { backgroundColor: '#fff', padding: '40px', borderRadius: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', maxWidth: '450px', width: '100%', border: '1px solid #e2e8f0', maxHeight: '90vh', overflowY: 'auto' },
  title: { fontSize: '26px', fontWeight: '900', marginBottom: '8px', color: '#0f172a' },
  subtitle: { fontSize: '15px', color: '#64748b', marginBottom: '30px', lineHeight: '1.4' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '13px', fontWeight: '700', color: '#334155' },
  input: { padding: '15px', borderRadius: '14px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', outline: 'none', fontSize: '15px', color: '#0f172a' },
  tagGrid: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  tagInactive: { padding: '8px 14px', borderRadius: '12px', border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#64748b', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: '0.2s' },
  tagActive: { padding: '8px 14px', borderRadius: '12px', border: '1px solid transparent', backgroundColor: '#3b82f6', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: '0.2s' },
  btn: { padding: '16px', borderRadius: '14px', border: 'none', backgroundColor: '#0f172a', color: '#fff', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '10px' }
};
