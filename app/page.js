"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// --- CONFIGURAZIONE DIRETTA (Inserisci i tuoi dati qui) ---
const SUPABASE_URL = "INCOLLA_QUI_IL_TUO_URL";
const SUPABASE_ANON_KEY = "INCOLLA_QUI_LA_TUA_ANON_KEY";
// -----------------------------------------------------------

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
      
      // Naviga verso l'onboarding se il login ha successo
      router.push("/onboarding"); 
    } catch (err) {
      setError(err.message || "Errore di connessione");
    } finally {
      setLoading(false);
    }
  };

  // Stili Inline per l'atmosfera Lattiginosa/Dreamcore
  const styles = {
    main: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      // Sfondo: un gradiente molto morbido, quasi impercettibile, tra bianco avorio e azzurro etereo
      background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '20px',
      overflow: 'hidden',
      position: 'relative'
    },
    // Effetto "Anestesia": cerchi sfocati che fluttuano sullo sfondo
    blob1: {
      position: 'absolute',
      width: '600px',
      height: '600px',
      background: 'rgba(212, 230, 252, 0.4)', // Azzurro chiarissimo nebuloso
      filter: 'blur(100px)',
      borderRadius: '50%',
      top: '-10%',
      left: '-10%',
      zIndex: 0
    },
    blob2: {
      position: 'absolute',
      width: '500px',
      height: '500px',
      background: 'rgba(255, 240, 245, 0.5)', // Rosa cipria chiarissimo nebuloso
      filter: 'blur(100px)',
      borderRadius: '50%',
      bottom: '10%',
      right: '-5%',
      zIndex: 0
    },
    glassCard: {
      width: '100%',
      maxWidth: '420px',
      // Lattiginoso: bianco quasi opaco ma con trasparenza e sfocatura
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      padding: '50px 40px',
      borderRadius: '30px',
      // Shadow molto morbida, eterea
      boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      textAlign: 'center',
      zIndex: 1,
      position: 'relative'
    },
    title: {
      fontSize: '28px',
      marginBottom: '35px',
      fontWeight: '300',
      color: '#4a4e69', // Un grigio-viola molto morbido
      letterSpacing: '-0.5px'
    },
    input: {
      width: '100%',
      padding: '16px',
      marginBottom: '15px',
      borderRadius: '15px',
      // Input "affogato" nella card: bianco leggermente più trasparente
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      border: '1px solid rgba(0, 0, 0, 0.05)',
      color: '#4a4e69',
      fontSize: '16px',
      boxSizing: 'border-box',
      outline: 'none',
      transition: 'all 0.3s ease',
    },
    button: {
      width: '100%',
      padding: '16px',
      // Colore etereo: un blu polvere pastello
      backgroundColor: '#a2c2e8',
      color: 'white',
      border: 'none',
      borderRadius: '15px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      marginTop: '10px',
      marginBottom: '25px',
      transition: 'all 0.3s ease',
      boxShadow: '0 5px 15px rgba(162, 194, 232, 0.3)',
    },
    switchText: {
      fontSize: '14px',
      color: '#9ba1b7',
      cursor: 'pointer',
      fontWeight: '300',
      textDecoration: 'underline'
    },
    error: {
      color: '#ff8a8a',
      fontSize: '14px',
      marginBottom: '15px',
      backgroundColor: 'rgba(255, 138, 138, 0.1)',
      padding: '10px',
      borderRadius: '10px'
    }
  };

  return (
    <main style={styles.main}>
      {/* Sfondo Liminale */}
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>

      {/* Card Lattiginosa */}
      <div style={styles.glassCard}>
        <h1 style={styles.title}>
          {mode === "login" ? "Entra nel Circlo" : "Inizia il viaggio"}
        </h1>

        <input
          type="email"
          placeholder="La tua email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          // Effetto focus dinamico
          onFocus={(e) => {
            e.target.style.borderColor = 'rgba(162, 194, 232, 0.5)';
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(0, 0, 0, 0.05)';
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
          }}
        />

        <input
          type="password"
          placeholder="La tua password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          onFocus={(e) => {
            e.target.style.borderColor = 'rgba(162, 194, 232, 0.5)';
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(0, 0, 0, 0.05)';
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
          }}
        />

        {error && (
          <div style={styles.error}>{error}</div>
        )}

        <button
          onClick={handleAuth}
          disabled={loading}
          style={styles.button}
          // Effetto hover/click disinvolto
          onMouseOver={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = '#b0cfe8';
              e.target.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseOut={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = '#a2c2e8';
              e.target.style.transform = 'translateY(0)';
            }
          }}
          onMouseDown={(e) => {
            if (!loading) e.target.style.transform = 'translateY(1px) scale(0.99)';
          }}
          onMouseUp={(e) => {
            if (!loading) e.target.style.transform = 'translateY(-1px) scale(1)';
          }}
        >
          {loading ? "Sospensione..." : (mode === "login" ? "Entra" : "Registrati")}
        </button>

        <p
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          style={styles.switchText}
          onMouseOver={(e) => e.target.style.color = '#7a819b'}
          onMouseOut={(e) => e.target.style.color = '#9ba1b7'}
        >
          {mode === "login" ? "Non hai un account? Crealo" : "Hai già un profilo? Accedi"}
        </p>
      </div>
    </main>
  );
}
