import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import Layout from '../components/layout/Layout';
import ImageUpload from '../components/ui/ImageUpload';
import { createBartender } from '../services/firebase/bartenders';
import { registerUser } from '../services/firebase/auth';
import styles from './PartnerRegistration.module.css';

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", 
  "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", 
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal"
];

const LANGUAGES = [
  "English", "Hindi", "Bengali", "Marathi", "Telugu", "Tamil", "Gujarati", 
  "Urdu", "Kannada", "Odia", "Malayalam", "Punjabi", "Assamese", "Maithili"
];

const PartnerRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '', // For Login
    email: '',
    password: '',
    state: '',
    city: '',
    callingNumber: '',
    whatsappNumber: '',
    profileImage: '',
    bio: '',
    experience: '0', // Stored as string for slider, parsed on submit
    specialization: '',
    languages: [] as string[]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 6));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const isStepValid = () => {
    switch (step) {
      case 1: return formData.name.trim().length > 2;
      case 2: return formData.bio.trim().length >= 10 && formData.languages.length > 0;
      case 3: return formData.phone.length > 9 && formData.email.includes('@') && formData.password.length >= 6;
      case 4: return formData.state !== '' && formData.city.trim().length > 2;
      case 5: return formData.callingNumber.length > 9 && formData.whatsappNumber.length > 9;
      case 6: return formData.profileImage !== '';
      default: return false;
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(1000 + Math.random() * 9000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 6 || !isStepValid()) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Create Auth User (Email/Pass mapped with Login Phone)
      const user = await registerUser(
        formData.email,
        formData.password,
        formData.name,
        formData.phone, // Primary login phone
        'bartender'
      );

      // 2. Generate initial empty data for Bartender Document
      const slug = generateSlug(formData.name);
      const bartenderCode = Math.floor(10000 + Math.random() * 90000).toString();
      
      const defaultPricing = {
        basic: { price: 5000, hours: 4, bartenders: 1, description: 'Standard bartending service for small events.' },
        premium: { price: 10000, hours: 6, bartenders: 2, description: 'Premium service with custom cocktail menu.' },
        luxury: { price: 20000, hours: 8, bartenders: 3, description: 'Full luxury experience with flair bartending.' }
      };

      // 3. Create Bartender Document
      await createBartender({
        userId: user.uid,
        bartenderCode,
        name: formData.name,
        slug,
        email: formData.email,
        loginPhone: formData.phone,
        callingNumber: formData.callingNumber,
        city: formData.city,
        state: formData.state,
        whatsappNumber: formData.whatsappNumber,
        profileImage: formData.profileImage,
        coverImage: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80', // Default cover
        galleryImages: [], // Empty gallery
        bio: formData.bio,
        experience: parseInt(formData.experience) || 0,
        languages: formData.languages.length > 0 ? formData.languages : ['English', 'Hindi'],
        specializations: formData.specialization ? formData.specialization.split(',').map(s => s.trim()) : ['Classic Cocktails'],
        pricing: defaultPricing,
        availability: 'available',
        verified: true,
        rating: 4.5, // Default rating as requested
      });

      // 4. Redirect to Dashboard
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please login or use a different email.');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className={styles.stepContainer}>
            <h2 className={styles.stepTitle}>What's your name?</h2>
            <p className={styles.stepDesc}>This is how clients will see you on the platform.</p>
            <input 
              type="text" name="name" value={formData.name} onChange={handleInputChange}
              placeholder="e.g. Rahul Sharma" className={styles.largeInput} autoFocus
            />
          </motion.div>
        );
      case 2:
        return (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className={styles.stepContainer}>
            <h2 className={styles.stepTitle}>Your Professional Profile</h2>
            <p className={styles.stepDesc}>Tell clients about your expertise and style.</p>
            <div className={styles.inputGroup}>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', color: 'var(--color-text-muted)', marginBottom: '1rem', fontSize: '1.1rem' }}>
                  Years of Experience: <span style={{ color: 'white', fontWeight: 'bold' }}>{formData.experience}+ Years</span>
                </label>
                <input 
                  type="range" 
                  name="experience" 
                  min="0" 
                  max="20" 
                  step="1"
                  value={formData.experience} 
                  onChange={handleInputChange}
                  style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                />
              </div>

              <textarea 
                name="bio" value={formData.bio} onChange={handleInputChange}
                placeholder="Write a short professional bio... (min 10 characters)" 
                style={{ 
                  width: '100%',
                  minHeight: '120px', 
                  resize: 'vertical',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  padding: '1rem',
                  color: 'white',
                  fontFamily: 'inherit',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--color-text-muted)', marginBottom: '1rem', fontSize: '1rem' }}>
                    Languages Known
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {LANGUAGES.map(lang => {
                      const isSelected = formData.languages.includes(lang);
                      return (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              languages: isSelected 
                                ? prev.languages.filter(l => l !== lang)
                                : [...prev.languages, lang]
                            }))
                          }}
                          style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '9999px',
                            background: isSelected ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                            border: `1px solid ${isSelected ? 'var(--color-primary)' : 'rgba(255,255,255,0.2)'}`,
                            color: isSelected ? 'var(--color-primary)' : 'var(--color-text)',
                            fontSize: '0.875rem',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer'
                          }}
                        >
                          {lang}
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <label style={{ display: 'block', color: 'var(--color-text-muted)', marginBottom: '0.5rem', fontSize: '1rem' }}>
                    Specializations
                  </label>
                  <input 
                    type="text" name="specialization" value={formData.specialization} onChange={handleInputChange}
                    placeholder="e.g. Mixology, Flair (Optional)" className={styles.largeInput}
                    style={{ fontSize: '1.25rem' }}
                  />
                </div>
              </div>

            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className={styles.stepContainer}>
            <h2 className={styles.stepTitle}>Account Details</h2>
            <p className={styles.stepDesc}>We need this to secure your account.</p>
            <div className={styles.inputGroup}>
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Mobile Number (For Login)" className={styles.largeInput} />
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" className={styles.largeInput} />
              <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Create a Password" className={styles.largeInput} />
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className={styles.stepContainer}>
            <h2 className={styles.stepTitle}>Where are you located?</h2>
            <p className={styles.stepDesc}>Clients often search for bartenders by city.</p>
            <div className={styles.inputGroup}>
              <select name="state" value={formData.state} onChange={handleInputChange} className={styles.largeSelect}>
                <option value="" disabled>Select your State</option>
                {INDIAN_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="e.g. Bangalore" className={styles.largeInput} />
            </div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className={styles.stepContainer}>
            <h2 className={styles.stepTitle}>Contact Information</h2>
            <p className={styles.stepDesc}>How should clients reach out to you?</p>
            <div className={styles.inputGroup}>
              <input type="tel" name="callingNumber" value={formData.callingNumber} onChange={handleInputChange} placeholder="Calling Number" className={styles.largeInput} />
              <input type="tel" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleInputChange} placeholder="WhatsApp Number" className={styles.largeInput} />
            </div>
          </motion.div>
        );
      case 6:
        return (
          <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className={styles.stepContainer}>
            <h2 className={styles.stepTitle}>Profile Picture</h2>
            <p className={styles.stepDesc}>Upload a professional, clean headshot. (Max 5MB)</p>
            <div className={styles.uploadWrapper}>
              <ImageUpload 
                imageType="profile"
                onUploadSuccess={(url) => setFormData(prev => ({ ...prev, profileImage: url }))}
                label="Upload Profile Photo"
              />
              {formData.profileImage && (
                <div className={styles.previewContainer}>
                  <img src={formData.profileImage} alt="Profile Preview" className={styles.imagePreview} />
                  <div className={styles.successBadge}><Check size={16} /> Uploaded Successfully</div>
                </div>
              )}
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className={styles.wizardPage}>
        {/* Progress Bar */}
        <div className={styles.progressContainer}>
          <div className={styles.progressBar} style={{ width: `${(step / 6) * 100}%` }}></div>
        </div>

        <div className={styles.wizardContent}>
          {error && (
            <div className={styles.errorBanner}>{error}</div>
          )}

          <div className={styles.formContainer}>
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>
          </div>

          <div className={styles.navigationPanel}>
            {step > 1 ? (
              <button className={styles.navButton} onClick={prevStep} type="button">
                <ChevronLeft size={20} /> Back
              </button>
            ) : <div></div>}

            {step < 6 ? (
              <button 
                className={`${styles.navButton} ${styles.navButtonPrimary} ${!isStepValid() ? styles.disabled : ''}`} 
                onClick={nextStep} 
                disabled={!isStepValid()}
                type="button"
              >
                Continue <ChevronRight size={20} />
              </button>
            ) : (
              <button 
                className={`${styles.navButton} ${styles.navButtonSuccess} ${(!isStepValid() || loading) ? styles.disabled : ''}`} 
                onClick={handleSubmit} 
                disabled={!isStepValid() || loading}
                type="button"
              >
                {loading ? 'Registering...' : 'Complete Registration'} <Check size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PartnerRegistration;
