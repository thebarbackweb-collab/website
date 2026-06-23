import React from 'react';
import { MapPin, Star, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Bartender } from '../../types';
import Button from './Button';
import Badge from './Badge';
import styles from './BartenderCard.module.css';

interface BartenderCardProps {
  bartender: Bartender;
}

const BartenderCard: React.FC<BartenderCardProps> = ({ bartender }) => {
  const navigate = useNavigate();

  const renderAvailabilityDot = () => {
    switch (bartender.availability) {
      case 'available':
        return <div className={`${styles.dot} ${styles.dotAvailable}`}></div>;
      case 'busy':
        return <div className={`${styles.dot} ${styles.dotBusy}`}></div>;
      case 'partially available':
        return <div className={`${styles.dot} ${styles.dotPartially}`}></div>;
      default:
        return null;
    }
  };


  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img 
          src={bartender.profileImage || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800'} 
          alt={bartender.name} 
          className={styles.image} 
        />
        
        <div className={styles.badgeContainer}>
          {bartender.verified && (
            <Badge variant="gold">Verified</Badge>
          )}
        </div>

        <div className={styles.availabilityBadge}>
          {renderAvailabilityDot()}
          <span style={{ textTransform: 'capitalize' }}>{bartender.availability}</span>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.name}>{bartender.name}</h3>
          <div className={styles.ratingContainer}>
            <Star size={16} fill="currentColor" />
            <span>{bartender.rating > 0 ? bartender.rating.toFixed(1) : '4.5'}</span>
          </div>
        </div>

        <div className={styles.location}>
          <MapPin size={14} />
          <span>{bartender.city}, {bartender.state}</span>
        </div>

        <div className={styles.experience}>
          <Award size={16} className="text-gold" />
          <span>{bartender.experience} Years Experience</span>
        </div>

        <div className={styles.footer}>
          <div>
            <div className={styles.priceLabel} style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>Starting from ₹5,000 for a full-day service</div>
          </div>
          <Button size="sm" onClick={() => navigate(`/bartender/${bartender.city.toLowerCase()}/${bartender.slug}`)}>
            View Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BartenderCard;
