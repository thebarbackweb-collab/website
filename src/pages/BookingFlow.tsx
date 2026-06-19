import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Check, ChevronRight, ChevronLeft, Calendar, User, FileText } from 'lucide-react';
import { getBartender } from '../services/firebase/bartenders';
import { createBooking } from '../services/firebase/bookings';
import { createNotification } from '../services/firebase/notifications';
import type { Bartender } from '../types';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import styles from './BookingFlow.module.css';

const STEPS = [
  { id: 1, title: 'Event Details', icon: <Calendar size={20} /> },
  { id: 2, title: 'Contact Info', icon: <User size={20} /> },
  { id: 3, title: 'Review', icon: <FileText size={20} /> },
];

const BookingFlow: React.FC = () => {
  const { bartenderId } = useParams<{ bartenderId: string }>();
  const [bartender, setBartender] = useState<Bartender | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [currentStep, setCurrentStep] = useState(1);
  const [eventData, setEventData] = useState({
    date: '',
    time: '',
    duration: '4 Hours',
    bartenderCount: '1',
    guestCount: '',
    occasion: '',
    specialReqs: '',
  });
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    email: '',
    venue: '',
    state: 'Karnataka',
    city: 'Bangalore',
    pincode: '',
  });

  useEffect(() => {
    const fetchBartender = async () => {
      if (!bartenderId) return;
      try {
        const data = await getBartender(bartenderId);
        setBartender(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBartender();
  }, [bartenderId]);

  // Scroll to top when changing steps
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({ ...prev, [name]: value }));
  };

  const isStep1Valid = Boolean(eventData.occasion && eventData.date && eventData.guestCount && eventData.time);
  const isStep2Valid = Boolean(
    customerData.name && 
    customerData.phone.length === 10 && 
    customerData.email && 
    customerData.pincode && 
    customerData.city
  );

  const handleSubmit = async () => {
    if (!bartender) return;
    setLoading(true);
    try {
      // 1. Save Booking to Firestore
      const booking = await createBooking({
        bartenderId: bartender.id,
        customerId: customerData.email, // using email as id for guest flow
        customerName: customerData.name,
        customerPhone: customerData.phone,
        eventDate: eventData.date,
        eventTime: eventData.time,
        venue: customerData.venue,
        city: customerData.city,
        guests: eventData.guestCount,
        occasion: eventData.occasion,
        budget: 'Pending Quote', // no longer fixed
        specialRequirements: `Duration: ${eventData.duration}, Bartenders: ${eventData.bartenderCount}. ${eventData.specialReqs}`,
        status: 'pending',
      });

      // 2. Create Notification for Bartender
      await createNotification({
        userId: bartender.userId || bartender.id,
        title: 'New Booking Inquiry',
        message: `${customerData.name} requested a quote for ${eventData.occasion} on ${eventData.date}.`,
        type: 'booking',
        link: `/dashboard/bookings/${booking.id}`,
      });

      // 3. Generate WhatsApp Message & Redirect
      const message = `Hi, I would like to inquire about booking ${bartender.name} for an upcoming event.
      
*Event Details:*
Occasion: ${eventData.occasion}
Date: ${eventData.date}
Time: ${eventData.time}
Duration: ${eventData.duration}
Guests: ${eventData.guestCount}
Bartenders Needed: ${eventData.bartenderCount}

*Venue:*
${customerData.venue}, ${customerData.city}, ${customerData.state} - ${customerData.pincode}

*Contact:*
Name: ${customerData.name}
Phone: ${customerData.phone}

*Special Requirements:* ${eventData.specialReqs || 'None'}

Please let me know the availability and estimated quote.`;

      const BROKER_NUMBER = '919986698096';
      const whatsappUrl = `https://wa.me/${BROKER_NUMBER}?text=${encodeURIComponent(message)}`;
      window.location.href = whatsappUrl;

    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Something went wrong while processing your booking.");
    }
  };

  if (loading) {
    return <Layout><div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>Loading booking engine...</div></Layout>;
  }

  if (!bartender) return null;

  return (
    <Layout>
      <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '800px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
          Book {bartender.name}
        </h1>

        {/* Stepper */}
        <div className={styles.stepper}>
          {STEPS.map(step => (
            <div key={step.id} className={`${styles.step} ${currentStep === step.id ? styles.active : ''} ${currentStep > step.id ? styles.completed : ''}`}>
              <div className={styles.stepIcon}>
                {currentStep > step.id ? <Check size={20} /> : step.icon}
              </div>
              <span className={styles.stepLabel}>{step.title}</span>
            </div>
          ))}
        </div>

        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          
          {/* STEP 1: EVENT DETAILS */}
          {currentStep === 1 && (
            <div>
              <div className={styles.formGrid}>
                
                {/* 1. Occasion */}
                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label className={styles.label} style={{ fontSize: '1.25rem', color: 'var(--color-text)', fontWeight: 600 }}>Select Occasion *</label>
                  <select name="occasion" value={eventData.occasion} onChange={handleEventChange} className={styles.select}>
                    <option value="">Select...</option>
                    <option value="Inviting Guests">Inviting Guests</option>
                    <option value="House Party">House Party</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Corporate Event">Corporate Event</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Cocktail Party">Cocktail Party</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                {/* 2. Date */}
                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label className={styles.label} style={{ fontSize: '1.25rem', color: 'var(--color-text)', fontWeight: 600 }}>Select Date *</label>
                  <select name="date" value={eventData.date} onChange={handleEventChange} className={styles.select}>
                    <option value="">Select from here</option>
                    {dateOptions.map(date => (
                      <option key={date} value={date}>{date}</option>
                    ))}
                  </select>
                </div>

                {/* 3. Guests */}
                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label className={styles.label} style={{ fontSize: '1.25rem', color: 'var(--color-text)', fontWeight: 600, marginBottom: '0.25rem' }}>Number of Guests *</label>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>drinkers + non-drinkers (5+ years of age)</div>
                  <select name="guestCount" value={eventData.guestCount} onChange={handleEventChange} className={styles.select}>
                    <option value="">Select...</option>
                    <option value="1-10 people">1-10 people</option>
                    <option value="10-25 people">10-25 people</option>
                    <option value="25-50 people">25-50 people</option>
                    <option value="50-100 people">50-100 people</option>
                    <option value="100+ people">100+ people</option>
                  </select>
                </div>

                {/* 4. Total Hours */}
                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label className={styles.label} style={{ fontSize: '1.25rem', color: 'var(--color-text)', fontWeight: 600 }}>Total Hours Needed *</label>
                  <select name="duration" value={eventData.duration} onChange={handleEventChange} className={styles.select}>
                    <option value="3 Hours">3 Hours</option>
                    <option value="4 Hours">4 Hours</option>
                    <option value="5 Hours">5 Hours</option>
                    <option value="6 Hours">6 Hours</option>
                    <option value="Full Day (8+ Hours)">Full Day (8+ Hours)</option>
                  </select>
                </div>

                {/* 5. Add Bartenders */}
                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label className={styles.label} style={{ fontSize: '1.25rem', color: 'var(--color-text)', fontWeight: 600, marginBottom: '0.25rem' }}>Total Bartenders Needed *</label>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>Note: 1 Bartender is already selected by default because you are booking {bartender.name}.</div>
                  <select name="bartenderCount" value={eventData.bartenderCount} onChange={handleEventChange} className={styles.select}>
                    <option value="1">1 Bartender (Included)</option>
                    <option value="2">2 Bartenders</option>
                    <option value="3">3 Bartenders</option>
                    <option value="4">4+ Bartenders</option>
                  </select>
                </div>

                {/* 6. Arrival Time */}
                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label className={styles.label} style={{ fontSize: '1.25rem', color: 'var(--color-text)', fontWeight: 600, marginBottom: '0.25rem' }}>Select Bartender Arrival Time *</label>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>We recommend at least 1 hour before your event starts</div>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    {['8 am', '9 am', '10 am', '11 am', '12 pm', '1 pm', '2 pm', '3 pm', '4 pm', '5 pm', '6 pm', '7 pm', '8 pm', '9 pm', '10 pm', '11 pm'].map(time => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setEventData(prev => ({ ...prev, time }))}
                        style={{
                          padding: '0.75rem 1rem',
                          borderRadius: '8px',
                          background: eventData.time === time ? 'var(--color-primary)' : 'var(--color-bg)',
                          border: `1px solid ${eventData.time === time ? 'var(--color-primary)' : 'rgba(0,0,0,0.1)'}`,
                          color: eventData.time === time ? '#000' : 'var(--color-text)',
                          fontWeight: eventData.time === time ? 600 : 400,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* STEP 2: CUSTOMER INFO */}
          {currentStep === 2 && (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Contact & Venue Information</h2>
              <div className={styles.formGrid}>
                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label className={styles.label}>Full Name *</label>
                  <input type="text" name="name" value={customerData.name} onChange={handleCustomerChange} className={styles.input} />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>WhatsApp Number (10 digits) *</label>
                  <input type="tel" pattern="[0-9]{10}" maxLength={10} name="phone" value={customerData.phone} onChange={handleCustomerChange} className={styles.input} placeholder="e.g. 9876543210" />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Email Address *</label>
                  <input type="email" name="email" value={customerData.email} onChange={handleCustomerChange} className={styles.input} />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>State *</label>
                  <select name="state" value={customerData.state} onChange={handleEventChange} className={styles.select}>
                    <option value="Karnataka">Karnataka</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>City *</label>
                  <select name="city" value={customerData.city} onChange={handleEventChange} className={styles.select}>
                    <option value="Bangalore">Bangalore</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Pincode *</label>
                  <input type="text" name="pincode" pattern="[0-9]{6}" maxLength={6} value={customerData.pincode} onChange={handleCustomerChange} className={styles.input} placeholder="6 digit pincode" />
                </div>

                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label className={styles.label}>Venue Address / Name (Optional)</label>
                  <textarea name="venue" value={customerData.venue} onChange={handleCustomerChange} placeholder="e.g. Taj Hotel, or full address..." className={styles.textarea} style={{ minHeight: '80px' }}></textarea>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW */}
          {currentStep === 3 && (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Review Request</h2>
              
              <div className={styles.reviewBox}>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>Bartender</span>
                  <span className={styles.reviewValue}>{bartender.name}</span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>Event</span>
                  <span className={styles.reviewValue}>{eventData.occasion} ({eventData.guestCount} Guests)</span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>Date & Time</span>
                  <span className={styles.reviewValue}>{eventData.date} at {eventData.time}</span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>Service Scope</span>
                  <span className={styles.reviewValue}>{eventData.bartenderCount} Bartender(s) for {eventData.duration}</span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>Venue</span>
                  <span className={styles.reviewValue}>{customerData.venue || 'TBD'}, {customerData.city || bartender.city}</span>
                </div>
              </div>

              <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <Check size={24} className="text-gold" style={{ flexShrink: 0 }} />
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
                  By clicking submit, you will be redirected to WhatsApp to send these custom details directly to our booking team to get a precise quote for {bartender.name}.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className={styles.navButtons}>
            <Button variant="ghost" onClick={handlePrev} disabled={currentStep === 1} style={{ visibility: currentStep === 1 ? 'hidden' : 'visible' }}>
              <ChevronLeft size={18} style={{ marginRight: '0.5rem' }} /> Back
            </Button>
            
            {currentStep < 3 ? (
              <Button 
                onClick={handleNext}
                disabled={(currentStep === 1 && !isStep1Valid) || (currentStep === 2 && !isStep2Valid)}
              >
                Next Step <ChevronRight size={18} style={{ marginLeft: '0.5rem' }} />
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                Request Quote via WhatsApp
              </Button>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default BookingFlow;
