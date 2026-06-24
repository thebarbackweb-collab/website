import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import ImageUpload from '../ui/ImageUpload';
import { getDocument, createDocument } from '../../services/firebase/firestore';

const BannerManager: React.FC = () => {
  const [banners, setBanners] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const docData = await getDocument<{ images: string[] }>('settings', 'banners');
        if (docData && docData.images) {
          setBanners(docData.images);
        }
      } catch (err) {
        console.error('Error fetching banners:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await createDocument('settings', 'banners', { images: banners });
      setMessage({ type: 'success', text: 'Banners saved successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      console.error('Error saving banners:', err);
      setMessage({ type: 'error', text: 'Failed to save banners. Try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleUploadSuccess = (url: string) => {
    setBanners(prev => [...prev, url]);
  };

  const removeBanner = (indexToRemove: number) => {
    setBanners(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  if (loading) {
    return <div style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem' }}>Loading banners...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', color: 'var(--color-text)' }}>Manage Advertisement Banners</h2>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {message && (
        <div style={{ 
          padding: '1rem', 
          marginBottom: '2rem', 
          borderRadius: '8px', 
          background: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: message.type === 'success' ? '#4ade80' : '#f87171',
          border: `1px solid ${message.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
        }}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {banners.map((url, index) => (
          <div key={index} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', aspectRatio: '21/9', border: '1px solid var(--color-border)' }}>
            <img src={url} alt={`Banner ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button 
              onClick={() => removeBanner(index)}
              style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                background: 'rgba(0,0,0,0.7)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#f87171'
              }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        
        {/* Upload New Banner Card */}
        <div style={{ height: '100%', minHeight: '150px' }}>
          <ImageUpload
            imageType="cover"
            label="Upload New Banner"
            subLabel="Ideal ratio 21:9"
            onUploadSuccess={handleUploadSuccess}
            isGallery={true}
          />
        </div>
      </div>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
        Note: Banners are displayed in the carousel on the Find Bartenders page. Best image ratio is 21:9 (e.g. 1200x400 pixels). Don't forget to click "Save Changes" after uploading or removing banners.
      </p>
    </div>
  );
};

export default BannerManager;
