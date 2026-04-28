"use client";
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#03050c', // Blu notte profondissimo
      backgroundImage: `
        radial-gradient(circle at 50% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(79, 70, 229, 0.05) 0%, transparent 40%)
      `,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: 'white',
      padding: '20px',
      textAlign: 'center'
    }}>
      
      {/* Logo o Nome Principale - Disinvolto e pulito */}
      <div style={{ marginBottom: '60px' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '300', 
          letterSpacing: '8px',
          margin: 0,
          opacity: 0.9
        }}>
          CIRCLO
        </h1>
        <div style={{ 
          width: '40px', 
          height: '1px', 
          background: 'rgba(255,255,255,0.3)', 
          margin: '20px auto' 
        }}></div>
      </div>

      {/* Bottone Centrale - Il focus principale */}
      <Link href="/auth" style={{
        padding: '18px 50px',
        backgroundColor: 'white',
        color: 'black',
        borderRadius: '100px',
        textDecoration: 'none',
        fontSize: '0.9rem',
        fontWeight: '500',
        letterSpacing: '1px',
        transition: 'all 0.4s ease',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      }}>
        ENTRA
      </Link>

      {/* La frase - Posizionata in basso, meno appariscente, quasi un pensiero */}
      <div style={{ 
        position: 'absolute', 
        bottom: '40px', 
        maxWidth: '500px',
        padding: '0 20px'
      }}>
        <p style={{ 
          fontSize: '0.85rem', 
          lineHeight: '1.8', 
          opacity: 0.4, // Molto discreta
          fontWeight: '300',
          letterSpacing: '0.5px'
        }}>
          Le connessioni autentiche non sbocciano tra le apparenze,<br/> 
          ma nel riverbero delle proprie affinità.
        </p>
      </div>

      {/* Effetto grana sottile tipico del dreamcore (opzionale, aggiunge texture) */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.02,
        zIndex: 999,
        background: 'url("https://grains.vercel.app/grain.png")'
      }}></div>

    </div>
  );
}
