"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

export default function OnboardingPremium() {
  const [formData, setFormData] = useState({ firstName: "", birthDate: "", city: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSave = async (e) => {
    e.preventDefault();
    // VALIDAZIONE OBBLIGATORIA
    if (!formData.firstName || !formData.birthDate || !formData.city) {
      alert("Tutti i campi (Nome, Data di Nascita e Città) sono obbligatori per continuare!");
      return;
    }

    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    const { error } = await supabase
      .from('profiles')
      .update({ 
        first_name: formData.firstName, 
        birth_date: formData.birthDate, 
        city: formData.city.toLowerCase().trim() 
      })
      .eq('id', session.user.id);

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
        <h1 style={styles.title}>Benvenuto su Circlo 🧬</h1>
        <p style={styles.subtitle}>Completa il tuo profilo per trovare persone simili a te.</p>
        
        <form onSubmit={handleSave} style={styles.form}>
          <label style={styles.label}>Come ti chiami?</label>
          <input 
            style={styles.input} 
            placeholder="Il tuo nome" 
            value={formData.firstName}
            onChange={e => setFormData({...formData, firstName: e.target.value})}
            required
          />

          <label style={styles.label}>Quando sei nato/a?</label>
          <input 
            type="date" 
            style={styles.input} 
            value={formData.birthDate}
            onChange={e => setFormData({...formData, birthDate: e.target.value})}
            required
          />

          <label style={styles.label}>In che città vivi?</label>
          <input 
            style={styles.input} 
            placeholder="Es: Milano" 
            value={formData.city}
            onChange={e => setFormData({...formData, city: e.target.value})}
            required
          />

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? "Salvataggio..." : "Inizia a scoprire"}
          </button>
        </form>
      </div>
    </main>
  );
}

const styles = {
  container: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '20px' },
  card: { backgroundColor: '#fff', padding: '40px', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', maxWidth: '400px', width: '100%', border: '1px solid #e2e8f0' },
  title: { fontSize: '24px', fontWeight: '900', marginBottom: '10px', textAlign: 'center' },
  subtitle: { fontSize: '14px', color: '#64748b', textAlign: 'center', marginBottom: '30px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  label: { fontSize: '13px', fontWeight: 'bold', color: '#1e293b' },
  input: { padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f1f5f9', outline: 'none' },
  btn: { padding: '16px', borderRadius: '12px', border: 'none', backgroundColor: '#1e293b', color: '#fff', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }
};
