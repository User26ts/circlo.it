"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("TUO_URL", "TUA_KEY");

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Legge l'URL (?mode=signup) per impostare la pagina
  useEffect(() => {
    const m = searchParams.get("mode");
    if (m === "signup" || m === "login") setMode(m);
  }, [searchParams]);

  const handleAuth = async () => {
    setLoading(true);
    setError("");
    try {
      const { error: authError } = mode === "signup" 
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (authError) throw authError;
      router.push("/onboarding");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.main}>
      <div style={styles.glassCard}>
        <h2 style={styles.title}>{mode === "login" ? "Accedi" : "Registrati"}</h2>
        <input 
          type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} style={styles.input} 
        />
        <input 
          type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} style={styles.input} 
        />
        {error && <p style={styles.error}>{error}</p>}
        
        <button onClick={handleAuth} disabled={loading} style={styles.button}>
          <span style={styles.gloss}></span>
          {loading ? "Attendi..." : (mode === "login" ? "Entra" : "Crea account")}
        </button>

        <p onClick={() => setMode(mode === "login" ? "signup" : "login")} style={styles.switch}>
          {mode === "login" ? "Non hai un account? Registrati" : "Hai già un account? Accedi"}
        </p>
      </div>
    </main>
  );
}

// Next.js richiede Suspense per usare useSearchParams
export default function AuthPage() {
  return (
    <Suspense fallback={<div>Caricamento...</div>}>
      <AuthContent />
    </Suspense>
  );
}

const styles = {
  main: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4f8' },
  glassCard: { background: 'white', padding: '40px', borderRadius: '30px', width: '100%', maxWidth: '350px', textAlign: 'center', boxShadow: '0 15px 35px rgba(0,0,0,0.05)' },
  title: { fontWeight: '300', marginBottom: '30px', color: '#334155' },
  input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', boxSizing: 'border-box' },
  button: { 
    width: '100%', padding: '14px', background: '#2563eb', color: 'white', border: 'none', 
    borderRadius: '12px', fontWeight: '700', cursor: 'pointer', position: 'relative', overflow: 'hidden' 
  },
  gloss: { position: 'absolute', top: '2px', left: '10%', width: '80%', height: '35%', background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)', borderRadius: '10px' },
  switch: { marginTop: '20px', fontSize: '13px', color: '#64748b', cursor: 'pointer' },
  error: { color: 'red', fontSize: '12px', marginBottom: '10px' }
};
