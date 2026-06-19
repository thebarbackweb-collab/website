import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import BartenderCard from '../components/ui/BartenderCard';
import CityCard from '../components/ui/CityCard';
import OccasionCard from '../components/ui/OccasionCard';
import BannerCarousel from '../components/ui/BannerCarousel';
import { useFeaturedBartenders } from '../hooks/useFeaturedBartenders';
import { GlassWater, Heart, Music, Wine, Cake, Users, Home as HomeIcon, Gem, Plane } from 'lucide-react';
import styles from './Home.module.css';

const TOP_CITIES = [
  { name: 'Bangalore', slug: 'bangalore', imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&q=80' },
];

const OCCASIONS = [
  { title: 'Wedding', icon: <Heart size={24} /> },
  { title: 'Reception', icon: <Users size={24} /> },
  { title: 'Cocktail Party', icon: <GlassWater size={24} /> },
  { title: 'Bachelor Party', icon: <Wine size={24} /> },
  { title: 'Birthday Party', icon: <Cake size={24} /> },
  { title: 'Corporate Event', icon: <Users size={24} /> },
  { title: 'House Party', icon: <HomeIcon size={24} /> },
  { title: 'Private Gathering', icon: <Music size={24} /> },
  { title: 'Luxury Event', icon: <Gem size={24} /> },
  { title: 'Destination Wedding', icon: <Plane size={24} /> },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const { bartenders, loading } = useFeaturedBartenders();

  return (
    <Layout>
      {/* Parallax Hero Section */}
      <section ref={heroRef} className={styles.heroSection}>
        <motion.div 
          className={styles.heroBg}
          style={{ y: backgroundY }}
        >
          <img 
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2000" 
            alt="Premium Bartending" 
            className={styles.heroBgImage}
          />
          <div className={styles.heroOverlay}></div>
        </motion.div>

        <motion.div 
          className={styles.heroContent}
          style={{ opacity }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 className={`${styles.title} text-gradient-gold`}>
            Premium Bartending Marketplace in Bangalore
          </h1>
          <p className={styles.subtitle}>
            Book verified professional bartenders for weddings, private parties, corporate events and luxury celebrations in Bangalore.
          </p>

          {/* Banner & CTAs Moved Below Hero */}
          <div style={{ maxWidth: '800px', margin: '0 auto 3rem' }}>
            <BannerCarousel />
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              <Button size="md" onClick={() => navigate('/browse')}>
                Find Bartenders
              </Button>
              <Button size="md" variant="secondary" onClick={() => navigate('/rentals')}>
                Rent Equipments
              </Button>
              <Button size="md" variant="secondary" onClick={() => navigate('/partner')}>
                Become a Partner
              </Button>
            </div>
          </div>

          {/* Trust Stats */}
          <motion.div 
            className={styles.statsSection}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className={`glass ${styles.statCard}`}>
              <span className={styles.statValue}>1000+</span>
              <span className={styles.statLabel}>Bartenders</span>
            </div>
            <div className={`glass ${styles.statCard}`}>
              <span className={styles.statValue}>50+</span>
              <span className={styles.statLabel}>Cities</span>
            </div>
            <div className={`glass ${styles.statCard}`}>
              <span className={styles.statValue}>10k+</span>
              <span className={styles.statLabel}>Events Served</span>
            </div>
            <div className={`glass ${styles.statCard}`}>
              <span className={styles.statValue}>100%</span>
              <span className={styles.statLabel}>Verified Pros</span>
            </div>
          </motion.div>
        </motion.div>
      </section>



      {/* Featured Bartenders Section */}
      <section className="container" style={{ padding: '6rem 1.5rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>Featured Bartenders</h2>
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: '4rem' }}>
          Discover the top-rated mixologists on THEBARBACK platform.
        </p>
        
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading top bartenders...</div>
        ) : bartenders.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {bartenders.map(bartender => (
              <BartenderCard key={bartender.id} bartender={bartender} />
            ))}
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No Bartenders Yet</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Be the first to join Bangalore's premium bartending marketplace.</p>
            <Button onClick={() => navigate('/partner')}>Become a Partner</Button>
          </div>
        )}
      </section>

      {/* Cities We Serve Section */}
      <section className="container" style={{ padding: '4rem 1.5rem 6rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Cities We Serve</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>Find elite bartenders in Bangalore.</p>
          </div>
          <Button variant="ghost" onClick={() => navigate('/cities')}>View All Cities</Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {TOP_CITIES.map(city => (
            <CityCard key={city.slug} name={city.name} slug={city.slug} imageUrl={city.imageUrl} />
          ))}
        </div>
      </section>

      {/* Occasions We Cover Section */}
      <section className="container" style={{ padding: '2rem 1.5rem 6rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>Occasions We Cover</h2>
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: '4rem' }}>
          From intimate house parties to grand destination weddings, we have the perfect bartender for every event.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {OCCASIONS.map(occasion => (
            <OccasionCard key={occasion.title} title={occasion.title} icon={occasion.icon} />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container" style={{ padding: '2rem 1.5rem 6rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>How It Works</h2>
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: '4rem' }}>
          Booking a professional bartender has never been easier.
        </p>

        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>1</div>
            <h3 className={styles.stepTitle}>Find a Bartender</h3>
            <p className={styles.stepDesc}>Browse our curated list of verified professional mixologists in your city.</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>2</div>
            <h3 className={styles.stepTitle}>Send Inquiry</h3>
            <p className={styles.stepDesc}>Select a package that fits your event and send a booking request via WhatsApp.</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>3</div>
            <h3 className={styles.stepTitle}>Enjoy Your Event</h3>
            <p className={styles.stepDesc}>Relax and let our professionals craft unforgettable experiences for your guests.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className="container">
          <h2 className={styles.ctaTitle}>Are you a Professional Bartender?</h2>
          <p className={styles.ctaDesc}>
            Join Bangalore's most premium bartending marketplace. Get exclusive bookings, manage your availability, and grow your business.
          </p>
          <Button size="lg" onClick={() => navigate('/partner')}>
            Become a Partner Today
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
