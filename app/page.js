"use client";
import Link from 'next/link';

export default function Home() {
  return (
    <main style={styles.container}>
      {/* Sfondo Aurora/Lattiginoso */}
      <div style={styles.aurora}></div>
      
      <div style={styles.glassCard}>
        <h1 style={styles.logoText}>circlo<span style={{color: '#00d1ff'}}>.</span></h1>
        
        <p style={styles.tagline}>
          Incontra persone che ti somigliano davvero.
        </p>

        <div style={styles.buttonContainer}>
          {/* Bottone ACCEDI - Blu Glossy */}
          <Link href="/auth" style={styles.blueButton}>
            <span style={styles.glossHighlight}></span>
            ACCEDI
          </Link>

          {/* Bottone REGISTRATI - Bianco/Vetro */}
          <Link href="/auth" style={styles.whiteButton}>
            <span style={styles.whiteGlossHighlight}></span>
            REGISTRATI
          </Link>
        </div>
      </div>

      <div style={styles.footer}>
        Circlo 2026
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
    backgroundColor: '#ffffff',
    background: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #dbeafe 100%)',
    fontFamily: '"Segoe UI", "Meiryo", system-ui, sans-serif',
    overflow: 'hidden',
    position: 'relative',
  },
  aurora: {
    position: 'absolute',
    width: '120%',
    height: '120%',
    background: 'radial-gradient(circle at 20% 30%, rgba(186, 230, 253, 0.5) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(191, 219, 254, 0.5) 0%, transparent 40%)',
    filter: 'blur(60px)',
    zIndex: 0,
  },
  glassCard: {
    zIndex: 2,
    background: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(30px) saturate(160%)',
    WebkitBackdropFilter: 'blur(30px) saturate(160%)',
    border: '1px solid rgba(255, 255, 255, 0.7)',
    borderRadius: '50px',
    padding: '70px 50px',
    textAlign: 'center',
    width: '90%',
    maxWidth: '420px',
    boxShadow: '0 30px 60px rgba(0,0,0,0.05), inset 0 0 30px rgba(255,255,255,0.4)',
  },
  logoText: {
    fontSize: '3.2rem',
    fontWeight: '800',
    letterSpacing: '-2px',
    color: '#1e293b',
    margin: '0 0 10px 0',
  },
  tagline: {
    fontSize: '1rem',
    color: '#475569',
    marginBottom: '50px',
    fontWeight: '400',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  blueButton: {
    position: 'relative',
    padding: '16px',
    background: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '100px',
    fontSize: '0.9rem',
    fontWeight: '700',
    letterSpacing: '1px',
    overflow: 'hidden',
    boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  whiteButton: {
    position: 'relative',
    padding: '16px',
    background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
    color: '#1e293b',
    textDecoration: 'none',
    borderRadius: '100px',
    fontSize: '0.9rem',
    fontWeight: '700',
    letterSpacing: '1px',
    overflow: 'hidden',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
    border: '1px solid rgba(255,255,255,1)',
  },
  glossHighlight: {
    position: 'absolute',
    top: '2px',
    left: '10%',
    width: '80%',
    height: '40%',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%)',
    borderRadius: '100px',
    pointerEvents: 'none',
  },
  whiteGlossHighlight: {
    position: 'absolute',
    top: '2px',
    left: '10%',
    width: '80%',
    height: '40%',
    background: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
    borderRadius: '100px',
    pointerEvents: 'none',
    opacity: 0.5
  },
  footer: {
    position: 'absolute',
    bottom: '40px',
    fontSize: '0.75rem',
    color: '#94a3b8',
    fontWeight: '500',
  }
};
