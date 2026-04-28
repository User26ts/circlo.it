"use client";
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #050814 0%, #1e1b4b 50%, #050814 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      color: 'white',
      textAlign: 'center',
      padding: '20px',
      overflow: 'hidden'
    }}>
      {/* Effetto luce soffusa sullo sfondo */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        background: '#3b82f6',
        filter: 'blur(120px)',
        opacity: 0.15,
        borderRadius: '50%',
        top: '20%',
        left: '10%',
        zIndex: 0
      }}></div>

      <div style={{ zIndex: 1, maxWidth: '800px' }}>
        <h1 style={{ 
          fontSize: '4rem', 
          fontWeight: '800', 
          letterSpacing: '-2px',
          marginBottom: '20px',
          background: 'linear-gradient(to right, #fff, #3b82f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          CIRCLO
        </h1>
        
        <p style={{ 
          fontSize: '1.2rem', 
          lineHeight: '1.6', 
          opacity: 0.8,
          marginBottom: '40px',
          fontStyle: 'italic',
          fontWeight: '300'
        }}>
          "Le connessioni autentiche non sbocciano tra le apparenze,<br/> 
          ma nel riverbero delle proprie affinità."
        </p>

        <Link href="/auth" style={{
          padding: '16px 40px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '100px',
          color: 'white',
          textDecoration: 'none',
          fontSize: '1rem',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
        }}>
          Inizia il viaggio
        </Link>
      </div>
    </div>
  );
}
