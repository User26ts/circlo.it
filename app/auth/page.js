"use client";
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

// --- CONFIGURAZIONE (Inserisci i tuoi dati qui sotto) ---
const SUPABASE_URL = "INCOLLA_QUI_IL_TUO_URL"; 
const SUPABASE_ANON_KEY = "INCOLLA_QUI_LA_TUA_ANON_KEY";
// -------------------------------------------------------

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [messaggio, setMessaggio] = useState({ testo: "", tipo: "" });

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessaggio({ testo: "", tipo: "" });

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      setMessaggio({ testo: "Registrazione OK! Controlla la mail per confermare.", tipo: "success" });
    } catch (err) {
      setMessaggio({ testo: err.message, tipo: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#050814',
      color: 'white',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#0f172a',
        padding: '40px',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        border: '1px solid #1e293b'
      }}>
        <h1 style={{ color: '#3b82f6', textAlign: 'center', marginBottom: '10px' }}>CIRCLO</h1>
        <p style={{ textAlign: 'center', opacity: 0.6, marginBottom: '30px' }}>Test Connessione V3</p>

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#020617', color: 'white' }}
          />
          <input
            type="password"
            placeholder="Password (min. 6 caratteri)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#020617', color: 'white' }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#3b82f6',
              color: 'white',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '10px'
            }}
          >
            {loading ? "Caricamento..." : "REGISTRATI ORA"}
          </button>
        </form>

        {messaggio.testo && (
          <div style={{
            marginTop: '20px',
            padding: '12px',
            borderRadius: '8px',
            textAlign: 'center',
            backgroundColor: messaggio.tipo === 'error' ? '#7f1d1d' : '#064e3b',
            color: messaggio.tipo === 'error' ? '#fecaca' : '#d1fae5',
            fontSize: '14px'
          }}>
            {messaggio.testo}
          </div>
        )}
      </div>
    </div>
  );
}
