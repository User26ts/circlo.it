"use client";
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000000', // Nero assoluto per profondità
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, system-ui, sans-serif',
      color: 'white',
      padding: '20px',
    }}>
      
      {/* Container Centrale */}
      <div style={{
        textAlign: 'center',
        width: '100%',
        maxWidth: '400px',
      }}>
        {/* Logo Originale */}
        <h1 style={{ 
          fontSize: '3.5rem', 
          fontWeight: '900', 
          letterSpacing: '-1.5px',
          marginBottom: '8px',
          color: '#ffffff'
        }}>
          circlo.
        </h1>
        
        {/* Sottotitolo discreto */}
        <p style={{ 
          fontSize: '1.1rem', 
          opacity: 0.5,
          fontWeight: '400',
          marginBottom: '60px'
        }}>
          Affinità, non apparenze.
        </p>

        {/* Bottone OG - Pulito e diretto */}
        <Link href="/auth" style={{
          display: 'block',
          width: '100%',
          padding: '20px',
          backgroundColor: '#3b82f6', // Il blu elettrico originale
          color: 'white',
          borderRadius: '16px',
          textDecoration: 'none',
          fontSize: '1.1rem',
          fontWeight: '600',
          transition: 'transform 0.2s ease',
          boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
        }}>
          Entra nel cerchio
        </Link>
      </div>

      {/* La frase "Filosofica" - Posizionata in basso come nota a margine */}
      <div style={{ 
        position: 'absolute', 
        bottom: '50px', 
        width: '100%',
        textAlign: 'center',
        padding: '0 30px',
      }}>
        <p style={{ 
          fontSize: '0.85rem', 
          lineHeight: '1.6', 
          opacity: 0.3, // Molto sottile
          maxWidth: '450px',
          margin: '0 auto',
          fontWeight: '300'
        }}>
          Le connessioni autentiche non sbocciano tra le apparenze, ma nel riverbero delle proprie affinità.
        </p>
      </div>
    </div>
  );
}
