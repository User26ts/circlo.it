"use client";
import Link from 'next/link';

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(180deg, #fdfbfb 0%, #ebedee 100%)',
      fontFamily: 'Inter, system-ui, sans-serif',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Effetto Nebbia Lattiginosa */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(circle at center, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 100%)',
        pointerEvents: 'none',
        zIndex: 1
      }}></div>

      <div style={{
        zIndex: 2,
        textAlign: 'center',
        filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.5))'
      }}>
        <h1 style={{ 
          fontSize: '3.5rem', 
          fontWeight: '100', 
          letterSpacing: '15px', 
          color: '#4a5568',
          margin: '0 0 20px 0',
          opacity: 0.7
        }}>
          CIRCLO
        </h1>

        <p style={{ 
          fontSize: '0.8rem', 
          color: '#a0aec0', 
          letterSpacing: '2px',
          marginBottom: '50px',
          fontWeight: '300'
        }}>
          riverbero delle affinità
        </p>

        <Link href="/auth" style={{
          padding: '15px 45px',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          borderRadius: '50px',
          color: '#718096',
          textDecoration: 'none',
          fontSize: '0.7rem',
          letterSpacing: '3px',
          backdropFilter: 'blur(10px)',
          transition: 'opacity 0.3s'
        }}>
          ENTRA
        </Link>
      </div>
    </main>
  );
}
