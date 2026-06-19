import React from 'react';
import Layout from '../components/layout/Layout';
import { ShieldCheck, Star, Users, MapPin } from 'lucide-react';

const About: React.FC = () => {
  return (
    <Layout>
      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem', maxWidth: '800px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', marginBottom: '1.5rem', textAlign: 'center', color: 'var(--color-primary)' }}>
          About THEBARBACK
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', textAlign: 'center', marginBottom: '4rem', lineHeight: 1.6 }}>
          Bangalore's Premier Bartending & Event Experience Marketplace.
        </p>

        <div className="glass-panel" style={{ padding: '3rem', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>Our Story</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', lineHeight: 1.8 }}>
            Born in the vibrant city of Bangalore, THEBARBACK was created to bridge the gap between hosts looking for exceptional beverage experiences and highly skilled mixologists looking for their next stage. 
          </p>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
            Whether it's an intimate house party, a grand corporate event, or a luxury wedding, we provide verified, professional bartenders and top-of-the-line rental equipment to elevate your celebration.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
            <ShieldCheck size={40} className="text-gold" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Verified Professionals</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Every bartender on our platform goes through a strict vetting process.</p>
          </div>
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
            <Star size={40} className="text-gold" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Premium Service</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>We guarantee a touch of luxury and high-end service for all your events.</p>
          </div>
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
            <MapPin size={40} className="text-gold" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Bangalore Exclusive</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Currently exclusively serving Bangalore, ensuring hyper-local quality control.</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', background: 'var(--color-bg)' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>Join the Network</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
            Are you a skilled bartender or mixologist in Bangalore? Join our growing community.
          </p>
          <a href="/partner" style={{ display: 'inline-block', background: 'var(--color-primary)', color: '#000', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>
            Become a Partner
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default About;
