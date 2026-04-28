"use client";
import Link from 'next/link';

export default function Home() {
  return (
    <main style={styles.container}>
      {/* Bolle ed elementi organici tipici Frutiger Aero */}
      <div style={styles.bubble1}></div>
      <div style={styles.bubble2}></div>
      <div style={styles.bubble3}></div>

      <div style={styles.glassCard}>
        <h1 style={styles.logoText}>circlo<span style={{color: '#82e9ff'}}>.</span></h1>
        
        <p style={styles.tagline}>
          Le connessioni non sbocciano tra le apparenze, <br/> 
          ma nel riverbero delle affinità.
        </p>

        {/* Bottone Glossy Frutiger Aero Style */}
        <Link href="/auth" style={styles.glossyButton}>
          <span style={styles.buttonReflex}></span>
          ENTRA
        </Link>
      </div>

      {/* Footer sottile */}
      <div style={styles.footer}>
        © 2026 Circlo Concept — Sinesia Digitale
      </div>
    </main>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // Gradiente "Aurora" Frutiger Aero
    background: 'linear-gradient(135deg, #e0f2fe 0%, #ffffff 50%, #c7d2fe 100%)',
    fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    overflow: 'hidden',
    position: 'relative',
  },
  // Bolle decorative sfumate
  bubble1: {
    position: 'absolute', top: '10%', left: '20%', width: '300px', height: '300px',
    background: 'radial-gradient(circle, rgba(130,233,255,0.4) 0%, rgba(255,255,255,0) 70%)',
    borderRadius: '50%', filter: 'blur(40px)', zIndex: 0,
  },
  bubble2: {
    position: 'absolute', bottom: '5%', right: '15%', width: '400px', height: '400px',
    background: 'radial-gradient(circle, rgba(167,139,250,0.3) 0%, rgba(255,255,255,0) 70%)',
    borderRadius: '50%', filter: 'blur(50px)', zIndex: 0,
  },
  bubble3: {
    position: 'absolute', top: '40%', right: '30%', width: '150px', height: '150px',
    background: 'rgba(255, 255, 255, 0.6)',
    borderRadius: '50%', filter: 'blur(20px)', zIndex: 0,
  },
  glassCard: {
    zIndex: 2,
    background: 'rgba(255, 255, 255, 0.4)',
    backdropFilter: 'blur(25px) saturate(150%)',
    WebkitBackdropFilter: 'blur(25px) saturate(150%)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    borderRadius: '40px',
    padding: '60px 40px',
    textAlign: 'center',
    width: '90%',
    maxWidth: '450px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.05), inset 0 0 20px rgba(255,255,255,0.5)',
  },
  logoText: {
    fontSize: '3.5rem',
    fontWeight: '800',
    letterSpacing: '-2px',
    color: '#1e293b',
    margin: '0 0 10px 0',
    textShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  tagline: {
    fontSize: '0.95rem',
    color: '#64748b',
    lineHeight: '1.6',
    marginBottom: '40px',
    fontWeight: '400',
  },
  glossyButton: {
    position: 'relative',
    display: 'inline-block',
    padding: '18px 60px',
    background: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '100px',
    fontSize: '1rem',
    fontWeight: '600',
    letterSpacing: '1px',
    overflow: 'hidden',
    boxShadow: '0 10px 25px rgba(37, 99, 235, 0.4), inset 0 -2px 5px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease',
  },
  buttonReflex: {
    position: 'absolute',
    top: '2px',
    left: '5%',
    width: '90%',
    height: '40%',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%)',
    borderRadius: '100px',
    pointerEvents: 'none',
  },
  footer: {
    position: 'absolute',
    bottom: '30px',
    fontSize: '0.7rem',
    color: '#94a3b8',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  }
};
