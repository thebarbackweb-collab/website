import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import BartenderCard from '../components/ui/BartenderCard';
import CityCard from '../components/ui/CityCard';
import OccasionCard from '../components/ui/OccasionCard';
import BannerCarousel from '../components/ui/BannerCarousel';
import ReviewCarousel from '../components/ui/ReviewCarousel';
import { useFeaturedBartenders } from '../hooks/useFeaturedBartenders';
import { Wine, Cake, Home as HomeIcon, Plane, Play, Pause, CheckCircle2 } from 'lucide-react';
import styles from './Home.module.css';

const TOP_CITIES = [
  { name: 'Bangalore', slug: 'bangalore', imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&q=80' },
];

const OCCASIONS = [
  { title: 'House Party', icon: <HomeIcon size={24} /> },
  { title: 'Bachelor Party', icon: <Wine size={24} /> },
  { title: 'Birthday Party', icon: <Cake size={24} /> },
  { title: 'Outstation Travellers Party', icon: <Plane size={24} /> },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const { bartenders, loading } = useFeaturedBartenders();

  return (
    <Layout>
      {/* Background Music Audio */}
      <audio ref={audioRef} loop>
        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
      </audio>

      {/* Music Toggle Floating Button */}
      <button 
        onClick={toggleMusic}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 999,
          background: 'var(--color-primary)',
          color: '#000',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)',
          cursor: 'pointer',
          transition: 'transform 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isPlaying ? <Pause size={28} /> : <Play size={28} style={{ marginLeft: '4px' }} />}
      </button>

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
          <h1 className={`${styles.title} text-gradient-gold`} style={{ fontSize: '3.5rem' }}>
            Hire Professional Bartender Services in Bangalore
          </h1>
          <p className={styles.subtitle} style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}>
            Looking to hire a professional bartender for your next event?{'\n'}
            We provide trained, presentable, and experienced bartenders for House Parties, Bachelor Parties, Birthday Parties, and Outstation Travellers Parties across Bangalore.{'\n\n'}
            From classic cocktails and mocktails to live bar service, we make your event smooth, stylish, and stress-free with a premium bar experience.
          </p>

          {/* Banner & CTAs Moved Below Hero */}
          <div style={{ width: '100%', margin: '0 auto 3rem' }}>
            <BannerCarousel />
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              <Button size="md" onClick={() => navigate('/browse')}>
                Find Bartenders
              </Button>

              <Button size="md" variant="secondary" onClick={() => navigate('/rentals')}>
                Ingredients & Rent Equipments
              </Button>
              <Button size="md" variant="secondary" onClick={() => navigate('/partner')}>
                Become a Partner
              </Button>
            </div>
          </div>

          {/* Trust Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'left', background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(10px)', padding: '2.5rem', borderRadius: '16px', border: '1px solid rgba(212, 175, 55, 0.2)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' }}
          >
            <h3 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: 'var(--color-primary)', textAlign: 'center', fontFamily: 'var(--font-serif)' }}>Why Choose Our Bartender Services?</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {[
                "Professionally trained bartenders",
                "Cocktail & Mocktail specialists",
                "Mobile bar setup available",
                "Hygienic and presentable staff",
                "On-time arrival and smooth service",
                "Suitable for home parties",
                "Hourly / Half-Day / Full-Day / Weekend bartender services"
              ].map((point, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '1.1rem', color: '#F8FAFC', lineHeight: '1.4' }}>
                  <CheckCircle2 size={24} className="text-gold" style={{ flexShrink: 0, marginTop: '2px' }} /> {point}
                </li>
              ))}
            </ul>
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

      {/* Customer Reviews Section */}
      <section className="container" style={{ padding: '0 1.5rem 6rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>What Our Clients Say</h2>
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: '3rem' }}>
          Real experiences from people who hired our premium bartenders.
        </p>
        
        <ReviewCarousel />
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
