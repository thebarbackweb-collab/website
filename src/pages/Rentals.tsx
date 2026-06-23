import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { getAllEquipments } from '../services/firebase/equipments';
import type { Equipment } from '../types';
import { Package, MessageCircle, MapPin, Calendar, Clock, Navigation } from 'lucide-react';

const Rentals: React.FC = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    duration: '',
    location: '',
    phone: '',
    state: 'Karnataka',
    city: 'Bangalore',
    pincode: ''
  });

  useEffect(() => {
    const fetchEquipments = async () => {
      setLoading(true);
      try {
        const data = await getAllEquipments();
        setEquipments(data);
      } catch (err) {
        console.error("Error fetching equipments", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipments();
  }, []);

  const handleWhatsAppRent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEquipment) return;

    const brokerNumber = '919986698096';
    const message = `Hi, I would like to rent the following equipment:\n\n*${selectedEquipment.title}*\nListed Price: ₹${selectedEquipment.price} ${selectedEquipment.pricingType}\n\n*Rental Details:*\nDate: ${formData.date}\nTime: ${formData.time}\nDuration Needed: ${formData.duration}\nDelivery Location: ${formData.location}, ${formData.city}, ${formData.state} - ${formData.pincode}\nContact: ${formData.phone}\n\nPlease confirm availability and total cost.`;
    
    const whatsappUrl = `https://wa.me/${brokerNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    setSelectedEquipment(null);
    setFormData({ date: '', time: '', duration: '', location: '', phone: '', state: 'Karnataka', city: 'Bangalore', pincode: '' });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section style={{ padding: '6rem 1.5rem 4rem', textAlign: 'center', background: 'var(--color-bg)' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '50%', marginBottom: '1.5rem' }}>
            <Package size={40} className="text-gold" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
            Ingredients & Rent Equipments
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Elevate your event with our premium selection of fresh ingredients, professional bar counters, glassware, and mixology tools.
          </p>
          <div style={{ marginTop: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)', padding: '0.5rem 1rem', borderRadius: '50px', color: 'var(--color-primary)', fontSize: '0.875rem', fontWeight: 600 }}>
            <MapPin size={16} /> Currently available only in Bangalore
          </div>
        </div>
      </section>

      {/* Equipment Grid Section */}
      <section className="container" style={{ padding: '2rem 1.5rem 6rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
            Loading rental inventory...
          </div>
        ) : equipments.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem' }}>
            {equipments.map(item => (
              <div 
                key={item.id} 
                className="glass-panel" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  overflow: 'hidden', 
                  opacity: item.status === 'rented' ? 0.6 : 1,
                  transition: 'transform 0.3s ease',
                }}
              >
                {/* Image Section */}
                <div style={{ position: 'relative', width: '100%', paddingTop: '75%' }}>
                  <img 
                    src={item.images[0]} 
                    alt={item.title} 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {item.status === 'rented' && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ background: '#ef4444', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', fontWeight: 'bold', letterSpacing: '1px' }}>
                        CURRENTLY RENTED
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, fontFamily: 'var(--font-serif)', lineHeight: 1.3 }}>{item.title}</h3>
                  </div>
                  
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: '1rem' }}>
                    ₹{item.price} <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 'normal' }}>{item.pricingType}</span>
                  </div>

                  {item.description && (
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <Button 
                      fullWidth 
                      disabled={item.status === 'rented'}
                      onClick={() => setSelectedEquipment(item)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: item.status === 'rented' ? 'rgba(0,0,0,0.05)' : 'var(--color-primary)', color: item.status === 'rented' ? 'var(--color-text-muted)' : '#000' }}
                    >
                      {item.status === 'rented' ? 'Out of Stock' : 'Rent Equipment'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <Package size={48} className="text-gold" style={{ margin: '0 auto 1.5rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No Equipment Available</h3>
            <p style={{ color: 'var(--color-text-muted)' }}>We are currently updating our rental inventory. Please check back soon for premium bar equipment rentals.</p>
          </div>
        )}
      </section>

      {/* Booking Modal */}
      {selectedEquipment && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass-panel" style={{ padding: '2.5rem', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>Rent Equipment</h3>
            <p style={{ color: 'var(--color-primary)', fontWeight: 600, marginBottom: '2rem' }}>{selectedEquipment.title}</p>
            
            <form onSubmit={handleWhatsAppRent} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}><Calendar size={16} /> Event Date</label>
                <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} min={new Date().toISOString().split('T')[0]} style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--color-bg)', border: '1px solid rgba(0,0,0,0.1)', color: 'var(--color-text)', borderRadius: '8px', outline: 'none' }} />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}><Clock size={16} /> Start Time</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxHeight: '120px', overflowY: 'auto', padding: '0.5rem', background: 'var(--color-bg)', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }}>
                  {['8 am', '9 am', '10 am', '11 am', '12 pm', '1 pm', '2 pm', '3 pm', '4 pm', '5 pm', '6 pm', '7 pm', '8 pm', '9 pm', '10 pm', '11 pm'].map(time => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, time }))}
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: '6px',
                        background: formData.time === time ? 'var(--color-primary)' : 'var(--color-bg)',
                        border: `1px solid ${formData.time === time ? 'var(--color-primary)' : 'rgba(0,0,0,0.1)'}`,
                        color: formData.time === time ? '#000' : 'var(--color-text)',
                        fontWeight: formData.time === time ? 600 : 400,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontSize: '0.875rem'
                      }}
                    >
                      {time}
                    </button>
                  ))}
                </div>
                {!formData.time && <div style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '0.5rem' }}>Please select a time</div>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Duration Needed (e.g., 4 Hours, 2 Days)</label>
                <input required type="text" placeholder="How long do you need it?" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--color-bg)', border: '1px solid rgba(0,0,0,0.1)', color: 'var(--color-text)', borderRadius: '8px', outline: 'none' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>WhatsApp Number</label>
                  <input required type="tel" pattern="[0-9]{10}" maxLength={10} placeholder="10 digit number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--color-bg)', border: '1px solid rgba(0,0,0,0.1)', color: 'var(--color-text)', borderRadius: '8px', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Pincode</label>
                  <input required type="text" pattern="[0-9]{6}" maxLength={6} placeholder="6 digit pincode" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--color-bg)', border: '1px solid rgba(0,0,0,0.1)', color: 'var(--color-text)', borderRadius: '8px', outline: 'none' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>State</label>
                  <select required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--color-bg)', border: '1px solid rgba(0,0,0,0.1)', color: 'var(--color-text)', borderRadius: '8px', outline: 'none' }}>
                    <option value="Karnataka">Karnataka</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>City</label>
                  <select required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--color-bg)', border: '1px solid rgba(0,0,0,0.1)', color: 'var(--color-text)', borderRadius: '8px', outline: 'none' }}>
                    <option value="Bangalore">Bangalore</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}><Navigation size={16} /> Delivery Location (Bangalore Only)</label>
                <textarea required placeholder="Full address for delivery..." value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--color-bg)', border: '1px solid rgba(0,0,0,0.1)', color: 'var(--color-text)', borderRadius: '8px', outline: 'none', minHeight: '80px', resize: 'vertical' }} />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <Button type="button" variant="ghost" onClick={() => setSelectedEquipment(null)} style={{ flex: 1 }}>Cancel</Button>
                <Button type="submit" size="lg" disabled={!formData.time || !formData.date || formData.phone.length !== 10 || formData.pincode.length !== 6} style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: (!formData.time || !formData.date || formData.phone.length !== 10 || formData.pincode.length !== 6) ? 'var(--color-bg)' : '#25D366', color: (!formData.time || !formData.date || formData.phone.length !== 10 || formData.pincode.length !== 6) ? 'var(--color-text-muted)' : 'white' }}>
                  <MessageCircle size={18} /> Request Quote
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Rentals;
