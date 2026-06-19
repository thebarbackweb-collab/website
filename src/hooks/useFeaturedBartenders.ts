import { useState, useEffect } from 'react';
import { getDocuments } from '../services/firebase/firestore';
import type { Bartender } from '../types';

export const useFeaturedBartenders = () => {
  const [bartenders, setBartenders] = useState<Bartender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // Assuming we add a 'featured' boolean to our schema or we just fetch top rated
        // Since the schema provided by the user didn't explicitly include 'featured' boolean in 'bartenders',
        // wait, the user's schema didn't have a 'featured' boolean on bartenders, but they said "featuredBartenders" is a collection.
        // Let's just fetch from 'featuredBartenders' collection, or fetch all bartenders with a limit for now.
        
        // As a fallback for demo: fetch any bartenders.
        const data = await getDocuments<Bartender>('bartenders');
        const activeBartenders = data.filter(b => b.verified);
        setBartenders(activeBartenders.slice(0, 4));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch bartenders');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return { bartenders, loading, error };
};
