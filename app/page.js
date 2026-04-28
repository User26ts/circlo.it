"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// --- CONFIGURAZIONE DIRETTA ---
const SUPABASE_URL = "INCOLLA_QUI_IL_TUO_URL";
const SUPABASE_ANON_KEY = "INCOLLA_QUI_LA_TUA_ANON_KEY";
// ------------------------------

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");

  const handleAuth = async () => {
    setLoading(true);
    setError("");
    try {
      let result;
      if (mode === "signup") {
        result = await supabase.auth.signUp({ email, password });
      } else {
        result = await supabase.auth.signInWithPassword({ email, password });
      }

      if (result.error) {
        setError(result.error.message);
        return;
      }
      
      // Se avevi rinominato la cartella in _onboarding, usa quello
      router.push("/onboarding"); 
    } catch (err) {
      setError(err.message || "Errore di connessione");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#050814',
      color: 'white',
      fontFamily: 'sans-serif',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: '40px',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '24px', marginBottom: '30px', fontWeight: '300' }}>
          {mode === "login" ? "Accedi a Circlo" : "Crea il tuo profilo"}
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '15px',
            borderRadius: '12px',
            backgroundColor: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'white',
            boxSizing: 'border-box'
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '15px',
            borderRadius: '12px',
            backgroundColor: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'white',
            boxSizing: 'border-box'
          }}
        />

        {error && (
          <p style={{ color: '#ff6b6b', fontSize: '14px', marginBottom: '15px' }}>{error}</p>
        )}

        <button
          onClick={handleAuth}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          {loading ? "Caricamento..." : (mode === "login" ? "Accedi" : "Registrati")}
        </button>

        <p
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          style={{ fontSize: '14px', color: '#94a3b8', cursor: 'pointer' }}
        >
          {mode === "login" ? "Non hai un account? Registrati" : "Hai già un account? Accedi"}
        </p>
      </div>
    </main>
  );
}
