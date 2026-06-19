import React from 'react';
import { Link } from 'react-router-dom';
import { GlassWater } from 'lucide-react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>
              <GlassWater className="text-gold" size={24} />
              THEBARBACK
            </Link>
            <p className={styles.description}>
              Bangalore's premium marketplace for hiring professional bartenders. Elevating events with exceptional cocktail experiences.
            </p>
          </div>
          
          <div>
            <h3 className={styles.sectionTitle}>For Customers</h3>
            <ul className={styles.linkList}>
              <li><Link to="/about" className={styles.link}>About Us</Link></li>
              <li><Link to="/browse" className={styles.link}>Find a Bartender</Link></li>
              <li><Link to="/cities" className={styles.link}>Cities We Serve</Link></li>
              <li><Link to="/occasions" className={styles.link}>Occasions</Link></li>
              <li><Link to="/how-it-works" className={styles.link}>How It Works</Link></li>
            </ul>
          </div>

          <div>
            <h3 className={styles.sectionTitle}>For Bartenders</h3>
            <ul className={styles.linkList}>
              <li><Link to="/partner" className={styles.link}>Become a Partner</Link></li>
              <li><Link to="/guidelines" className={styles.link}>Community Guidelines</Link></li>
              <li><Link to="/success-stories" className={styles.link}>Success Stories</Link></li>
              <li><Link to="/dashboard" className={styles.link}>Bartender Login</Link></li>
            </ul>
          </div>

          <div>
            <h3 className={styles.sectionTitle}>Support</h3>
            <ul className={styles.linkList}>
              <li><Link to="/faq" className={styles.link}>Help Center & FAQ</Link></li>
              <li><Link to="/contact" className={styles.link}>Contact Us</Link></li>
              <li><Link to="/terms" className={styles.link}>Terms of Service</Link></li>
              <li><Link to="/privacy" className={styles.link}>Privacy Policy</Link></li>
            </ul>
            <div style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              <div style={{ marginBottom: '0.25rem' }}>+91 99866 98096</div>
              <div>retailconnectindia@gmail.com</div>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.copyright}>
            &copy; {new Date().getFullYear()} THEBARBACK. All rights reserved.
          </div>
          <div className={styles.bottomLinks}>
            <Link to="/terms" className={styles.link}>Terms</Link>
            <Link to="/privacy" className={styles.link}>Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
