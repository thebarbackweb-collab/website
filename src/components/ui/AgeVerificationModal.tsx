import React, { useState, useEffect } from 'react';
import Button from './Button';

const AgeVerificationModal: React.FC = () => {
  const [isVerified, setIsVerified] = useState(true);
  const [isRejected, setIsRejected] = useState(false);

  useEffect(() => {
    const verified = sessionStorage.getItem('age_verified');
    if (!verified) {
      setIsVerified(false);
      
      // Prevent scrolling while modal is open
      document.body.style.overflow = 'hidden';
    }
  }, []);

  const handleYes = () => {
    sessionStorage.setItem('age_verified', 'true');
    setIsVerified(true);
    document.body.style.overflow = 'auto';
  };

  const handleNo = () => {
    setIsRejected(true);
  };

  if (isVerified) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(20px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '450px',
        width: '100%',
        padding: '3rem 2rem',
        textAlign: 'center',
        background: 'var(--color-bg-elevated)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        {isRejected ? (
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--color-danger)' }}>Access Denied</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>
              You must be of legal drinking age to access this website.
            </p>
          </div>
        ) : (
          <div>
            <img 
              src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=200&h=200" 
              alt="Drinks" 
              style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1.5rem', border: '2px solid var(--color-primary)' }} 
            />
            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>Age Verification</h2>
            <p style={{ fontSize: '1.25rem', marginBottom: '2rem', fontWeight: 500 }}>
              Are you above 21 years of age?
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
              <Button size="lg" onClick={handleYes} style={{ flex: 1, padding: '1rem' }}>YES</Button>
              <Button size="lg" variant="secondary" onClick={handleNo} style={{ flex: 1, padding: '1rem', background: 'transparent', border: '1px solid var(--color-text-muted)', color: 'var(--color-text)' }}>NO</Button>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600 }}>
              Drink Responsibly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgeVerificationModal;
