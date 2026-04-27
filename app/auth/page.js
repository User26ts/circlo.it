"use client";
import { createClient } from "@supabase/supabase-js";

// --- METTI QUI I DATI DEL NUOVO PROGETTO SUPABASE ---
const URL_DIRETTO = "INCOLLA_QUI_IL_NUOVO_URL";
const KEY_DIRETTA = "INCOLLA_QUI_LA_NUOVA_ANON_KEY";
// --------------------------------------------------

const supabase = createClient(URL_DIRETTO, KEY_DIRETTA);

export default function TestPage() {
  return (
    <div style={{ backgroundColor: '#050814', color: 'white', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', textAlign: 'center', padding: '20px' }}>
      <h1 style={{ color: '#3b82f6', fontSize: '2.5rem', marginBottom: '10px' }}>CIRCLO - TEST V3</h1>
      <p style={{ opacity: 0.7 }}>Se vedi questo titolo blu, Vercel sta leggendo il codice giusto!</p>
      
      <button 
        onClick={async () => {
          const { data, error } = await supabase.auth.signUp({ 
            email: 'test' + Math.floor(Math.random() * 1000) + '@test.it', 
            password: 'password123' 
          });
          if (error) alert("Errore: " + error.message);
          else alert("CONNESSO! Utente creato nel nuovo Supabase.");
        }}
        style={{ marginTop: '30px', padding: '12px 24px', backgroundColor: '#3b82f6', border: 'none', color: 'white', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}
      >
        VERIFICA CONNESSIONE SUPABASE
      </button>
    </div>
  );
}
