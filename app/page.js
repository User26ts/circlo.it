"use client";
import Link from 'next/link';

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f4f7f9', // Bianco sporco/azzurro polvere
      background: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #e0e7ff 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      color: '#7a869a',
      textAlign: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Effetto Lattiginoso / Nebuloso */}
      <div style={{
        position: 'absolute',
        width: '150%',
        height: '150%',
        background: 'url("https://www.transparenttextures.com/patterns/white-diamond.png")',
        opacity: 0.05,
        pointerEvents: 'none'
      }}></div>

      <div style={{
        zIndex: 1,
        backdropFilter: 'blur(5px)',
        padding: '40px',
        borderRadius: '40px'
      }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: '200', 
          letterSpacing: '12px', 
          marginBottom: '20px',
          color: '#4a5568',
          textShadow: '0 0 20px rgba(255,255,255,0.8)'
        }}>
          CIRCLO
        </h1>

        <p style={{ 
          fontSize: '0.9rem', 
          maxWidth: '400px', 
          lineHeight: '2', 
          fontWeight: '300',
          fontStyle: 'italic',
          marginBottom: '60px',
          opacity: 0.6
        }}>
          "Le connessioni autentiche non sbocciano tra le apparenze, ma nel riverbero delle proprie affinità."
        </p>

        <Link href="/auth" style={{
          padding: '20px 60px',
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          borderRadius: '100px',
          color: '#4a5568',
          textDecoration: 'none',
          fontSize: '0.8rem',
          letterSpacing: '2px',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.5s ease',
          boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
        }}>
          ENTRA
        </Link>
      </div>

      {/* Cerchi eterei di sfondo */}
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-5%',
        width: '400px',
        height: '400px',
        background: '#e0e7ff',
        filter: 'blur(100px)',
        borderRadius: '50%',
        opacity: 0.5,
        zIndex: 0
      }}></div>
    </main>
  );
}
