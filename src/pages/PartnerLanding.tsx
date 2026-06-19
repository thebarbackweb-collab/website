import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { ShieldCheck, UserCheck, CreditCard, Camera } from 'lucide-react';

const PartnerLanding: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Hero Section */}
      <section style={{ padding: '6rem 1.5rem', textAlign: 'center', background: 'var(--color-bg-elevated)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(212, 175, 55, 0.1)', color: 'var(--color-primary)', padding: '0.5rem 1rem', borderRadius: '50px', fontWeight: 600, fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            <ShieldCheck size={18} /> Join the Elite Hospitality Team
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3.5rem', color: 'var(--color-primary)', marginBottom: '1.5rem', lineHeight: 1.2 }}>
            Become a THEBARBACK Partner
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', marginBottom: '3rem', lineHeight: 1.6 }}>
            Join our platform of premium hospitality professionals in Bangalore. Follow this detailed guide to complete your onboarding today.
          </p>
          <Button size="lg" onClick={() => navigate('/partner/apply')} style={{ fontSize: '1.25rem', padding: '1rem 3rem' }}>
            Apply Now
          </Button>
        </div>
      </section>

      {/* Steps Section */}
      <section className="container" style={{ padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
          
          {/* Step 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-block', background: 'rgba(0,0,0,0.05)', color: 'var(--color-text)', padding: '0.5rem 1rem', borderRadius: '50px', fontWeight: 600, fontSize: '0.875rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Step 01
              </div>
              <h3 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontWeight: 900 }}>Account Creation</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem', lineHeight: 1.6 }}>
                To start your journey, you first need to create a verified account on THEBARBACK. 
                Fill in your basic details to set up your professional profile.
              </p>
            </div>
            <div className="glass-panel" style={{ padding: '3rem', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(212, 175, 55, 0.05)' }}>
              <UserCheck size={100} className="text-gold" />
            </div>
          </div>

          {/* Step 2 & 3 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div style={{ order: 1 }}>
              <div style={{ display: 'inline-block', background: 'rgba(0,0,0,0.05)', color: 'var(--color-text)', padding: '0.5rem 1rem', borderRadius: '50px', fontWeight: 600, fontSize: '0.875rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Step 02 & 03
              </div>
              <h3 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontWeight: 900 }}>Verification</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                Fill in your professional expertise, experience, and service locations. To complete your verification, you will need to upload your professional documents.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '6rem 1.5rem', background: 'var(--color-primary)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '2rem', color: '#000' }}>Ready to grow with us?</h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '3rem', color: 'rgba(0,0,0,0.8)' }}>
            Join Bangalore's most exclusive bartending network. Professionalism is just a step away.
          </p>
          <Button size="lg" onClick={() => navigate('/partner/apply')} style={{ background: '#000', color: 'var(--color-primary)', fontSize: '1.25rem', padding: '1.5rem 3rem' }}>
            Get Started Now
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default PartnerLanding;
