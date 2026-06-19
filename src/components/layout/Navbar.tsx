import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, GlassWater } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { auth } from '../../services/firebase/config';
import Button from '../ui/Button';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/';
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className="container">
        <div className={styles.nav}>
          <Link to="/" className={styles.logo}>
            <GlassWater className="text-gold" size={28} />
            THEBARBACK
          </Link>

          <nav className={styles.desktopMenu}>
            {!user ? (
              <>
                <Link to="/" className={styles.navLink}>Home</Link>
                <Link to="/about" className={styles.navLink}>About Us</Link>
                <Link to="/browse" className={styles.navLink}>Find Bartenders</Link>
                <Link to="/rentals" className={styles.navLink}>Rent Equipments</Link>
                <Link to="/cities" className={styles.navLink}>Cities</Link>
                <Link to="/occasions" className={styles.navLink}>Occasions</Link>
              </>
            ) : (
              <Link to="/dashboard" className={styles.navLink}>Dashboard</Link>
            )}
          </nav>

          <div className={styles.actions}>
            <div className={styles.desktopActions}>
              {!user ? (
                  <Button variant="primary" onClick={() => window.location.href = '/portal'}>
                    Bartender Login
                  </Button>
              ) : (
                <Button variant="outline" onClick={handleLogout}>Log Out</Button>
              )}
            </div>
            
            <button 
              className={styles.mobileMenuBtn}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={styles.mobileMenu}
          >
            {!user ? (
              <>
                <Link to="/" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>Home</Link>
                <Link to="/about" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>About Us</Link>
                <Link to="/browse" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>Find Bartenders</Link>
                <Link to="/rentals" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>Rent Equipments</Link>
                <Link to="/cities" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>Cities</Link>
                <Link to="/occasions" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>Occasions</Link>
                <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', margin: '1rem 0' }}></div>
                <Button variant="primary" fullWidth style={{ marginTop: '0.5rem' }} onClick={() => window.location.href = '/portal'}>
                  Bartender Login
                </Button>
              </>
            ) : (
              <>
                <Link to="/dashboard" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', margin: '1rem 0' }}></div>
                <Button variant="outline" fullWidth onClick={handleLogout}>Log Out</Button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
