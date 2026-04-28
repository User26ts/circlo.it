"use client";
import Link from 'next/link';

export default function Home() {
  return (
    <main style={styles.container}>
      <div style={styles.aurora}></div>
      
      <div style={styles.glassCard}>
        <h1 style={styles.logoText}>circlo<span style={{color: '#00d1ff'}}>.</span></h1>
        <p style={styles.tagline}>Incontra persone che ti somigliano davvero.</p>

        <div style={styles.buttonContainer}>
          {/* Punta a mode=login */}
          <Link href="/auth?mode=login" style={styles.blueButton}>
            <span style={styles.glossHighlight}></span>
            ACCEDI
          </Link>

          {/* Punta a mode=signup */}
          <Link href="/auth?mode=signup" style={styles.whiteButton}>
            <span style={styles.whiteGlossHighlight}></span>
            REGISTRATI
          </Link>
        </div>
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
    // Colore "nebbia" più equilibrato
    background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)',
    fontFamily: '"Segoe UI", system-ui, sans-serif',
    overflow: 'hidden',
    position: 'relative',
  },
  aurora: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle at 10% 10%, rgba(186,230,253,0.3) 0%, transparent 50%), radial-gradient(circle at 90% 90%, rgba(203,213,225,0.4) 0%, transparent 50%)',
    filter: 'blur(80px)',
  },
  glassCard: {
    zIndex: 2,
    background: 'rgba(255, 255, 255, 0.45)',
    backdropFilter: 'blur(25px) saturate(140%)',
    borderRadius: '40px',
    padding: '60px 45px',
    textAlign: 'center',
    width: '90%',
    maxWidth: '400px',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
  },
  logoText: { fontSize: '3rem', fontWeight: '800', color: '#334155', margin: '0 0 10px 0' },
  tagline: { fontSize: '0.95rem', color: '#64748b', marginBottom: '45px' },
  buttonContainer: { display: 'flex', flexDirection: 'column', gap: '15px' },
  blueButton: {
    position: 'relative', padding: '16px', background: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)',
    color: 'white', textDecoration: 'none', borderRadius: '100px', fontSize: '0.9rem', fontWeight: '700',
    overflow: 'hidden', boxShadow: '0 8px 20px rgba(37, 99, 235, 0.2)', textAlign: 'center'
  },
  whiteButton: {
    position: 'relative', padding: '16px', background: 'white', color: '#334155',
    textDecoration: 'none', borderRadius: '100px', fontSize: '0.9rem', fontWeight: '700',
    overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.05)', textAlign: 'center', border: '1px solid #e2e8f0'
  },
  glossHighlight: {
    position: 'absolute', top: '2px', left: '10%', width: '80%', height: '35%',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)', borderRadius: '100px'
  },
  whiteGlossHighlight: {
    position: 'absolute', top: '2px', left: '10%', width: '80%', height: '35%',
    background: 'linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0) 100%)', borderRadius: '100px'
  }
};
