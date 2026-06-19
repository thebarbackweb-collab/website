import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './OccasionCard.module.css';

interface OccasionCardProps {
  title: string;
  icon: React.ReactNode;
}

const OccasionCard: React.FC<OccasionCardProps> = ({ title, icon }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.card} onClick={() => navigate(`/browse?occasion=${encodeURIComponent(title)}`)}>
      <div className={styles.iconWrapper}>
        {icon}
      </div>
      <h3 className={styles.title}>{title}</h3>
    </div>
  );
};

export default OccasionCard;
