import React, { useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const DUMMY_REVIEWS = [
  {
    id: 1,
    name: 'Rahul Khanna',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150',
    rating: 5,
    comment: 'The bartender was extremely professional and made our house party a huge hit! The cocktails were top-notch.',
    event: 'House Party'
  },
  {
    id: 2,
    name: 'Priya Sharma',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
    rating: 5,
    comment: 'Booked them for my wedding reception. The service was flawless, and the staff was very presentable and hygienic.',
    event: 'Wedding Reception'
  },
  {
    id: 3,
    name: 'Vikram Singh',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
    rating: 4.5,
    comment: 'Great flair bartending! Everyone loved the mobile bar setup. Highly recommended for bachelor parties.',
    event: 'Bachelor Party'
  },
  {
    id: 4,
    name: 'Sneha Reddy',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150',
    rating: 5,
    comment: 'Very punctual and polite. The mocktails were a favorite among the kids at the birthday party.',
    event: 'Birthday Party'
  },
  {
    id: 5,
    name: 'Amit Patel',
    photo: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&q=80&w=150&h=150',
    rating: 5,
    comment: 'Hired two bartenders for our corporate offsite. Smooth service, fantastic drinks, and no hassle at all.',
    event: 'Outstation Party'
  }
];

const ReviewCarousel: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', padding: '1rem 0' }}>
      
      {/* Navigation Arrows */}
      <button 
        onClick={() => scroll('left')}
        style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'var(--color-bg-elevated)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', color: 'var(--color-primary)' }}
      >
        <ChevronLeft size={24} />
      </button>

      <button 
        onClick={() => scroll('right')}
        style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'var(--color-bg-elevated)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', color: 'var(--color-primary)' }}
      >
        <ChevronRight size={24} />
      </button>

      {/* Scrollable Container */}
      <div 
        ref={scrollContainerRef}
        style={{ 
          display: 'flex', 
          gap: '1.5rem', 
          overflowX: 'auto', 
          scrollBehavior: 'smooth', 
          padding: '1rem 3rem',
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE/Edge
        }}
        className="hide-scrollbar"
      >
        {DUMMY_REVIEWS.map((review) => (
          <div 
            key={review.id} 
            className="glass-panel"
            style={{ 
              minWidth: '320px', 
              maxWidth: '320px', 
              padding: '2rem', 
              borderRadius: '16px', 
              display: 'flex', 
              flexDirection: 'column',
              position: 'relative'
            }}
          >
            <Quote size={40} color="rgba(212, 175, 55, 0.1)" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }} />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <img 
                src={review.photo} 
                alt={review.name} 
                style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-primary)' }}
              />
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, color: '#fff' }}>{review.name}</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-primary)', margin: '0.25rem 0 0' }}>{review.event}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '4px', marginBottom: '1rem' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  size={16} 
                  fill={star <= Math.floor(review.rating) ? 'var(--color-primary)' : 'transparent'} 
                  color="var(--color-primary)" 
                />
              ))}
            </div>

            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: '1.6', flex: 1, fontStyle: 'italic' }}>
              "{review.comment}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewCarousel;
