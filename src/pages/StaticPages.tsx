import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import Layout from '../components/layout/Layout';
import styles from './BartenderPortal.module.css'; // Reusing some base styling classes if needed

const PageWrapper: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
  <Layout>
    <div className="container" style={{ padding: '6rem 1.5rem', maxWidth: '800px', minHeight: '60vh' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', marginBottom: '2rem', textAlign: 'center' }}>{title}</h1>
      <div className="glass-panel" style={{ padding: '3rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.9)' }}>
        {children}
      </div>
    </div>
  </Layout>
);

export const Cities = () => (
  <PageWrapper title="Cities We Serve">
    <p>THEBARBACK is rapidly expanding across India. We currently have premium bartenders available in major metropolitan areas including Bangalore, Mumbai, Delhi NCR, Pune, and Hyderabad.</p>
    <p>Check back often as we are constantly bringing our premium cocktail experiences to new cities.</p>
  </PageWrapper>
);

export const Occasions = () => (
  <PageWrapper title="Occasions">
    <p>Our professional bartenders are equipped to elevate any event, including:</p>
    <ul style={{ listStyleType: 'disc', paddingLeft: '2rem', marginTop: '1rem' }}>
      <li>Weddings & Receptions</li>
      <li>Corporate Galas & Networking Events</li>
      <li>Private House Parties</li>
      <li>Birthdays & Anniversaries</li>
      <li>Pop-up Events & Brand Launches</li>
    </ul>
  </PageWrapper>
);

export const HowItWorks = () => (
  <PageWrapper title="How It Works">
    <h3>1. Browse & Select</h3>
    <p>Search for top-rated bartenders in your city based on your occasion and their specializations.</p>
    <h3 style={{ marginTop: '1.5rem' }}>2. Request a Quote</h3>
    <p>Select a package and provide your event details. The bartender will receive your inquiry and confirm their availability.</p>
    <h3 style={{ marginTop: '1.5rem' }}>3. Celebrate</h3>
    <p>Enjoy a seamless, premium cocktail experience while our professionals take care of the bar.</p>
  </PageWrapper>
);

export const Guidelines = () => (
  <PageWrapper title="Community Guidelines">
    <p>At THEBARBACK, we expect both our partners and clients to maintain a high standard of professionalism and respect.</p>
    <ul style={{ listStyleType: 'disc', paddingLeft: '2rem', marginTop: '1rem' }}>
      <li>Zero tolerance for harassment or inappropriate behavior.</li>
      <li>Commitment to responsible drinking and serving.</li>
      <li>Punctuality and clear communication are mandatory.</li>
    </ul>
  </PageWrapper>
);

export const SuccessStories = () => (
  <PageWrapper title="Success Stories">
    <p>Read about how our bartenders have transformed ordinary gatherings into unforgettable experiences.</p>
    <p style={{ marginTop: '1rem', fontStyle: 'italic', color: 'var(--color-primary)' }}>"Hiring a bartender through THEBARBACK was the best decision for our wedding. The cocktails were a massive hit!" - Priya, Bangalore</p>
  </PageWrapper>
);

export const FAQ = () => (
  <PageWrapper title="Help Center & FAQ">
    <h3 style={{ marginBottom: '0.5rem' }}>Do I need to provide the alcohol?</h3>
    <p style={{ marginBottom: '1.5rem' }}>Yes, currently clients are required to procure their own alcohol due to state licensing laws. Our bartenders bring the mixing tools and expertise.</p>
    
    <h3 style={{ marginBottom: '0.5rem' }}>How do cancellations work?</h3>
    <p style={{ marginBottom: '1.5rem' }}>Cancellations made 48 hours prior to the event are fully refunded. Later cancellations may incur a fee.</p>
  </PageWrapper>
);

export const Terms = () => (
  <PageWrapper title="Terms of Service">
    <p>By using THEBARBACK, you agree to our platform terms. We act as an intermediary marketplace connecting clients with independent professional bartenders.</p>
    <p>Users must be of legal drinking age in their respective states to use the booking services.</p>
  </PageWrapper>
);

export const Privacy = () => (
  <PageWrapper title="Privacy Policy">
    <p>Your privacy is important to us. We securely encrypt your personal data and never sell your contact information to third parties.</p>
  </PageWrapper>
);

export const Contact = () => (
  <Layout>
    <div className="container" style={{ padding: '6rem 1.5rem', maxWidth: '800px', minHeight: '60vh' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>Contact Us</h1>
      <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: '3rem' }}>We're here to help with any questions regarding bookings, partnerships, or general inquiries.</p>
      
      <div className="glass-panel" style={{ padding: '4rem 3rem', display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', textAlign: 'center' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--color-primary)' }}>
            <Phone size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Call or WhatsApp</h3>
            <a href="tel:+919986698096" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', textDecoration: 'none' }}>+91 99866 98096</a>
          </div>
        </div>

        <div style={{ width: '100px', height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--color-primary)' }}>
            <Mail size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Email Us</h3>
            <a href="mailto:retailconnectindia@gmail.com" style={{ fontSize: '1.25rem', color: 'white', textDecoration: 'none' }}>retailconnectindia@gmail.com</a>
          </div>
        </div>

      </div>
    </div>
  </Layout>
);
