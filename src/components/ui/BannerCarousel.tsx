import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { getDocument } from '../../services/firebase/firestore';

const DEFAULT_BANNERS = [
  '/images/banners/banner1.png',
  '/images/banners/banner2.png',
  '/images/banners/banner3.png',
  '/images/banners/banner4.png',
  '/images/banners/banner5.png',
];

const BannerCarousel: React.FC = () => {
  const [banners, setBanners] = useState<string[]>(DEFAULT_BANNERS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const docData = await getDocument<{ images: string[] }>('settings', 'banners');
        if (docData && docData.images && docData.images.length > 0) {
          setBanners(docData.images);
        }
      } catch (err) {
        console.error('Failed to fetch banners:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000); // Auto-scroll every 5 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? banners.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  if (loading) {
    return (
      <div style={{ width: '100%', aspectRatio: '21/9', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-elevated)', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
        <Loader className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden', borderRadius: '12px', background: 'var(--color-bg-elevated)', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <div 
        style={{ 
          display: 'flex', 
          transition: 'transform 0.5s ease-in-out', 
          transform: `translateX(-${currentIndex * 100}%)`,
          aspectRatio: '21/9',
          width: '100%'
        }}
      >
        {banners.map((src, index) => (
          <img 
            key={index} 
            src={src} 
            alt={`Advertisement Banner ${index + 1}`} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', flexShrink: 0 }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1200&h=400';
            }}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button 
            onClick={handlePrev}
            style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
            aria-label="Previous Banner"
          >
            <ChevronLeft size={24} color="#0F172A" />
          </button>

          <button 
            onClick={handleNext}
            style={{ position: 'absolute', top: '50%', right: '1rem', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
            aria-label="Next Banner"
          >
            <ChevronRight size={24} color="#0F172A" />
          </button>
        </>
      )}

      {/* Indicators */}
      {banners.length > 1 && (
        <div style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.5rem' }}>
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              style={{
                width: currentIndex === index ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: currentIndex === index ? 'var(--color-primary)' : 'rgba(255,255,255,0.5)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerCarousel;
