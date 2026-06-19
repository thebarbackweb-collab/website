import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Award, CheckCircle } from 'lucide-react';
import { getBartenderBySlug } from '../services/firebase/bartenders';
import type { Bartender } from '../types';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import styles from './BartenderProfile.module.css';

const BartenderProfile: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [bartender, setBartender] = useState<Bartender | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBartender = async () => {
      if (!slug) return;
      try {
        const data = await getBartenderBySlug(slug);
        setBartender(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBartender();
  }, [slug]);

  if (loading) {
    return <Layout><div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>Loading profile...</div></Layout>;
  }

  if (!bartender) {
    return (
      <Layout>
        <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
          <h2>Bartender Not Found</h2>
          <Button onClick={() => navigate('/browse')} style={{ marginTop: '1rem' }}>Browse Bartenders</Button>
        </div>
      </Layout>
    );
  }

  const getStartingPrice = () => {
    if (!bartender.pricing || Object.keys(bartender.pricing).length === 0) return 'Custom';
    const prices = Object.values(bartender.pricing).map((p: any) => typeof p.price === 'number' ? p.price : 0).filter(p => p > 0);
    if (prices.length === 0) return 'Custom';
    return `₹${Math.min(...prices).toLocaleString('en-IN')}`;
  };

  const handleBookingStart = () => {
    // Navigate to booking flow and pass bartender info
    // For now, navigate to a placeholder booking route
    navigate(`/book/${bartender.id}`);
  };

  return (
    <Layout>
      {/* Dynamic SEO Title - In a real app use React Helmet */}
      <title>THEBARBACK | {bartender.name}</title>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <img src={bartender.coverImage || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80'} alt="Cover" className={styles.coverImage} />
        <div className={styles.heroOverlay}>
          <div className="container">
            <div className={styles.profileContainer}>
              <img src={bartender.profileImage || 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&q=80'} alt={bartender.name} className={styles.avatar} />
              <div className={styles.headerInfo}>
                <div className={styles.nameRow}>
                  <h1 className={styles.name}>{bartender.name}</h1>
                  {bartender.verified && <CheckCircle className="text-gold" size={24} />}
                </div>
                <div className={styles.metaRow}>
                  <div className={styles.metaItem}>
                    <Star className="text-gold" size={18} fill="currentColor" />
                    <span>{bartender.rating > 0 ? bartender.rating.toFixed(1) : '4.5'} Stars</span>
                  </div>
                  <div className={styles.metaItem}>
                    <MapPin className="text-gold" size={18} />
                    <span>{bartender.city}, {bartender.state}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <Award className="text-gold" size={18} />
                    <span>{bartender.experience} Years Experience</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className={styles.contentGrid}>
          {/* Left Column: Details */}
          <div>
            {/* About Section */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>About</h2>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '1.5rem', whiteSpace: 'pre-wrap' }}>
                {bartender.bio}
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', color: 'white', marginBottom: '0.5rem' }}>Languages</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {bartender.languages?.map(lang => <Badge key={lang} variant="outline">{lang}</Badge>) || <span style={{color: 'var(--color-text-muted)'}}>Not specified</span>}
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', color: 'white', marginBottom: '0.5rem' }}>Specializations</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {bartender.specializations?.map(spec => <Badge key={spec} variant="outline">{spec}</Badge>) || <span style={{color: 'var(--color-text-muted)'}}>Not specified</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery Section */}
            {bartender.galleryImages && bartender.galleryImages.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Gallery</h2>
                <div className={styles.masonry}>
                  {bartender.galleryImages.map((img, idx) => (
                    <img key={idx} src={img} alt={`Gallery ${idx}`} className={styles.galleryImage} />
                  ))}
                </div>
              </div>
            )}


          </div>

          {/* Right Column: Sticky Booking Card */}
          <div>
            <div className={styles.stickySidebar}>
              <div className={styles.bookingCard}>
                <div className={styles.bookingPrice}>
                  Starting from {getStartingPrice()}
                </div>
                <div className={styles.bookingLabel}>Contact this bartender to discuss your event and get a quote.</div>
                
                <Button size="lg" style={{ width: '100%', marginBottom: '1rem' }} onClick={handleBookingStart}>
                  Book / Enquire Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className={styles.mobileCta}>
        <Button size="lg" style={{ width: '100%' }} onClick={handleBookingStart}>Book / Enquire Now</Button>
      </div>

    </Layout>
  );
};

export default BartenderProfile;
