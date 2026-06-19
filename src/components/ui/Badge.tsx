import React from 'react';

interface BadgeProps {
  variant?: 'gold' | 'success' | 'danger' | 'outline' | 'glass';
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ variant = 'gold', children, className = '' }) => {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
