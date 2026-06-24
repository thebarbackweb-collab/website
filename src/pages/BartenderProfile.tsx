import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Award, CheckCircle } from 'lucide-react';
import { getBartenderBySlug } from '../services/firebase/bartenders';
import { getDocuments, createDocument, updateDocument } from '../services/firebase/firestore';
import { where } from 'firebase/firestore';
import type { Bartender, Review } from '../types';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import styles from './BartenderProfile.module.css';

const BartenderProfile: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [bartender, setBartender] = useState<Bartender | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, text: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchBartender = async () => {
      if (!slug) return;
      try {
        const data = await getBartenderBySlug(slug);
        setBartender(data);
        
        if (data) {
          const fetchedReviews = await getDocuments<Review>('reviews', [where('bartenderId', '==', data.id)]);
          setReviews(fetchedReviews.sort((a, b) => b.createdAt - a.createdAt));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBartender();
  }, [slug]);

  if (loading) {
    return <Layout><div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>Loading profile...</div></Layout>;
  }

  if (!bartender) {
    return (
      <Layout>
        <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
          <h2>Bartender Not Found</h2>
          <Button onClick={() => navigate('/browse')} style={{ marginTop: '1rem' }}>Browse Bartenders</Button>
        </div>
      </Layout>
    );
  }


  const handleBookingStart = () => {
    // Navigate to booking flow and pass bartender info
    // For now, navigate to a placeholder booking route
    navigate(`/book/${bartender.id}`);
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.text) return;
    setSubmittingReview(true);

    try {
      const reviewId = Date.now().toString();
      const reviewData: Review = {
        id: reviewId,
        bartenderId: bartender.id,
        customerId: 'guest_' + Math.floor(Math.random() * 10000), // Simple guest ID since no auth
        customerName: newReview.name,
        rating: newReview.rating,
        review: newReview.text,
        createdAt: Date.now()
      };

      await createDocument('reviews', reviewId, reviewData);
      
      // Update local reviews
      const updatedReviews = [reviewData, ...reviews];
      setReviews(updatedReviews);
      
      // Update bartender average rating
      const newAvgRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
      await updateDocument('bartenders', bartender.id, { rating: newAvgRating });
      setBartender({ ...bartender, rating: newAvgRating });

      // Reset form
      setShowReviewForm(false);
      setNewReview({ name: '', rating: 5, text: '' });
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <Layout>
      {/* Dynamic SEO Title - In a real app use React Helmet */}
      <title>THEBARBACK | {bartender.name}</title>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <img src={bartender.coverImage || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80'} alt="Cover" className={styles.coverImage} />
        <div className={styles.heroOverlay}>
          <div className="container">
            <div className={styles.profileContainer}>
              <img src={bartender.profileImage || 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&q=80'} alt={bartender.name} className={styles.avatar} />
              <div className={styles.headerInfo}>
                <div className={styles.nameRow}>
                  <h1 className={styles.name}>{bartender.name}</h1>
                  {bartender.verified && <CheckCircle className="text-gold" size={24} />}
                </div>
                <div className={styles.metaRow}>
                  <div className={styles.metaItem}>
                    <Star className="text-gold" size={18} fill="currentColor" />
                    <span>{bartender.rating > 0 ? bartender.rating.toFixed(1) : '4.5'} Stars</span>
                  </div>
                  <div className={styles.metaItem}>
                    <MapPin className="text-gold" size={18} />
                    <span>{bartender.city}, {bartender.state}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <Award className="text-gold" size={18} />
                    <span>{bartender.experience} Years Experience</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className={styles.contentGrid}>
          {/* Left Column: Details */}
          <div>
            {/* About Section */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>About</h2>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '1.5rem', whiteSpace: 'pre-wrap' }}>
                {bartender.bio}
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>Languages</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {bartender.languages?.map(lang => <Badge key={lang} variant="outline">{lang}</Badge>) || <span style={{color: 'var(--color-text-muted)'}}>Not specified</span>}
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>Specializations</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {bartender.specializations?.map(spec => <Badge key={spec} variant="outline">{spec}</Badge>) || <span style={{color: 'var(--color-text-muted)'}}>Not specified</span>}
                  </div>
                </div>
                {bartender.signatureCocktails && bartender.signatureCocktails.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '1rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>Signature Cocktails</h3>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {bartender.signatureCocktails.map(cocktail => <Badge key={cocktail} variant="outline">{cocktail}</Badge>)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Gallery Section */}
            {bartender.galleryImages && bartender.galleryImages.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Gallery</h2>
                <div className={styles.masonry}>
                  {bartender.galleryImages.map((img, idx) => (
                    <img key={idx} src={img} alt={`Gallery ${idx}`} className={styles.galleryImage} />
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className={styles.section}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', margin: 0 }}>Customer Reviews ({reviews.length})</h2>
                <Button size="sm" variant="outline" onClick={() => setShowReviewForm(!showReviewForm)}>
                  {showReviewForm ? 'Cancel' : 'Rate this Bartender'}
                </Button>
              </div>

              {showReviewForm && (
                <div style={{ background: 'var(--color-bg-elevated)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid var(--color-border)' }}>
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', color: 'var(--color-text)' }}>Write a Review</h3>
                  <form onSubmit={submitReview} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <input 
                        type="text" 
                        placeholder="Your Name" 
                        value={newReview.name}
                        onChange={e => setNewReview({...newReview, name: e.target.value})}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'white' }}
                        required
                      />
                    </div>
                    <div>
                      <select 
                        value={newReview.rating}
                        onChange={e => setNewReview({...newReview, rating: Number(e.target.value)})}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'white' }}
                      >
                        <option value={5}>5 Stars - Excellent</option>
                        <option value={4}>4 Stars - Very Good</option>
                        <option value={3}>3 Stars - Average</option>
                        <option value={2}>2 Stars - Poor</option>
                        <option value={1}>1 Star - Terrible</option>
                      </select>
                    </div>
                    <div>
                      <textarea 
                        placeholder="Share details of your experience..." 
                        value={newReview.text}
                        onChange={e => setNewReview({...newReview, text: e.target.value})}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'white', minHeight: '100px', resize: 'vertical' }}
                        required
                      />
                    </div>
                    <Button type="submit" disabled={submittingReview}>
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </Button>
                  </form>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {reviews.length === 0 ? (
                  <p style={{ color: 'var(--color-text-muted)' }}>No reviews yet. Be the first to review {bartender.name}!</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} style={{ padding: '1.5rem', background: 'var(--color-bg)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#000' }}>
                          {(review.customerName || review.customerId).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text)' }}>{review.customerName || 'Guest User'}</h4>
                          <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} fill={i < review.rating ? "var(--color-primary)" : "none"} color={i < review.rating ? "var(--color-primary)" : "var(--color-text-muted)"} />
                            ))}
                          </div>
                        </div>
                        <span style={{ marginLeft: 'auto', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', fontStyle: 'italic', margin: 0, whiteSpace: 'pre-wrap' }}>
                        "{review.review}"
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Booking Card */}
          <div>
            <div className={styles.stickySidebar}>
              <div className={styles.bookingCard}>
                <div className={styles.bookingPrice}>
                  Starting from ₹5,000
                </div>
                <div className={styles.bookingLabel}>for a full-day service. Contact to discuss your event and get a quote.</div>
                
                <Button size="lg" style={{ width: '100%', marginBottom: '1rem' }} onClick={handleBookingStart}>
                  Book / Enquire Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className={styles.mobileCta}>
        <Button size="lg" style={{ width: '100%' }} onClick={handleBookingStart}>Book / Enquire Now</Button>
      </div>

    </Layout>
  );
};

export default BartenderProfile;
