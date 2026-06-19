import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CityCard.module.css';

interface CityCardProps {
  name: string;
  slug: string;
  imageUrl: string;
}

const CityCard: React.FC<CityCardProps> = ({ name, slug, imageUrl }) => {
  return (
    <Link to={`/city/${slug}`} className={styles.card}>
      <img src={imageUrl} alt={`${name} Bartenders`} className={styles.image} loading="lazy" />
      <div className={styles.overlay}>
        <div className={styles.content}>
          <h3 className={styles.cityName}>{name}</h3>
        </div>
      </div>
    </Link>
  );
};

export default CityCard;
