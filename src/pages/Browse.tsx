import React, { useState, useEffect } from 'react';
import { MapPin, Filter } from 'lucide-react';
import Layout from '../components/layout/Layout';
import BartenderCard from '../components/ui/BartenderCard';
import Button from '../components/ui/Button';
import BannerCarousel from '../components/ui/BannerCarousel';

import { useNavigate } from 'react-router-dom';
import { getDocuments } from '../services/firebase/firestore';
import type { Bartender } from '../types';

const Browse: React.FC = () => {
  const navigate = useNavigate();
  const [bartenders, setBartenders] = useState<Bartender[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [cityFilter, setCityFilter] = useState('');
  const [occasionFilter] = useState('');

  useEffect(() => {
    // Basic fetch - in a real app with more data, we would use Firestore queries
    // based on the selected filters.
    const fetchBartenders = async () => {
      setLoading(true);
      try {
        const data = await getDocuments<Bartender>('bartenders');
        
        // Hide banned/unverified bartenders
        let filtered = data.filter(b => b.verified);
        
        if (cityFilter) {
          filtered = filtered.filter(b => b.city.toLowerCase().includes(cityFilter.trim().toLowerCase()));
        }

        if (occasionFilter) {
          const occFilter = occasionFilter.trim().toLowerCase();
          filtered = filtered.filter(b => 
            b.specializations?.some(s => s.toLowerCase().includes(occFilter)) ||
            b.bio?.toLowerCase().includes(occFilter)
          );
        }
        
        setBartenders(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBartenders();
  }, [cityFilter, occasionFilter]);

  return (
    <Layout>
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
          <BannerCarousel />
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
            <Button size="lg" variant="primary" onClick={() => navigate('/partner')}>
              Become a Partner
            </Button>
          </div>

          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '2rem' }}>
            Find Professional Bartenders
          </h1>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
          <div className="glass" style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 1rem', borderRadius: '8px', flex: 1, minWidth: '200px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <MapPin size={20} className="text-gold" style={{ marginRight: '0.5rem' }} />
            <select style={{ background: 'transparent', border: 'none', color: 'var(--color-text)', width: '100%', outline: 'none', appearance: 'none' }}>
              <option value="">Select State</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Maharashtra">Maharashtra</option>
            </select>
          </div>

          <div className="glass" style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 1rem', borderRadius: '8px', flex: 1, minWidth: '200px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <MapPin size={20} className="text-gold" style={{ marginRight: '0.5rem' }} />
            <input 
              type="text" 
              placeholder="Search by City..." 
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--color-text)', width: '100%', outline: 'none' }}
            />
          </div>

          <Button variant="outline"><Filter size={20} style={{ marginRight: '0.5rem' }} /> Filters</Button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading bartenders...</div>
        ) : bartenders.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {bartenders.map(b => (
              <BartenderCard key={b.id} bartender={b} />
            ))}
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No bartenders found</h3>
            <p style={{ color: 'var(--color-text-muted)' }}>Try adjusting your search criteria or checking back later.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Browse;
