import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, LogIn, ArrowRight } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { loginUser, resetPassword } from '../services/firebase/auth';
import { getUserByPhone } from '../services/firebase/users';
import { getBartenderByUserId } from '../services/firebase/bartenders';
import styles from './BartenderPortal.module.css';

type PortalView = 'options' | 'login' | 'forgot-password';

const BartenderPortal: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<PortalView>('options');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Look up user by phone number to get their email
      const userDoc = await getUserByPhone(formData.phone);
      
      if (!userDoc) {
        throw new Error("Invalid mobile number or password.");
      }

      // Check if banned
      const bartenderDoc = await getBartenderByUserId(userDoc.uid);
      if (bartenderDoc && bartenderDoc.verified === false) {
        setError("YOUR ACCOUNT HAS BEEN BANNED BY THE ADMIN. Please contact support.");
        setLoading(false);
        return;
      }

      // 2. Log in using the mapped email and provided password
      await loginUser(userDoc.email, formData.password);
      
      // 3. Redirect to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError("Invalid mobile number or password.");
      } else {
        setError(err.message || "Login failed. Check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone) {
      setError("Please enter your registered mobile number.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const userDoc = await getUserByPhone(formData.phone);
      if (!userDoc) {
        throw new Error("No account found with this mobile number.");
      }

      await resetPassword(userDoc.email);
      setSuccessMsg(`A password reset link has been sent to your registered email (${userDoc.email.replace(/(.{2})(.*)(?=@)/, '$1***')}). Kindly also check your spam/junk folder.`);
    } catch (err: any) {
      setError(err.message || "Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'rgba(0,0,0,0.5)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: 'white',
    outline: 'none',
    fontFamily: 'inherit'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.875rem',
    color: 'var(--color-text-muted)'
  };

  return (
    <Layout>
      <div className="container" style={{ padding: '6rem 1.5rem', maxWidth: '800px', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', marginBottom: '1rem' }}>Bartender Portal</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Join India's most exclusive bartending network or manage your bookings.</p>
        </div>

        {view === 'options' && (
          <div className={styles.optionsGrid}>
            {/* New Bartender Card */}
            <div className={`glass-panel ${styles.optionCard}`} onClick={() => navigate('/partner')}>
              <div className={styles.iconWrapper}>
                <UserPlus size={40} className="text-gold" />
              </div>
              <h2 className={styles.optionTitle}>New Bartender</h2>
              <p className={styles.optionDesc}>Register to become a partner, set up your profile, and start getting premium bookings.</p>
              <div className={styles.optionLink}>
                Register Now <ArrowRight size={16} />
              </div>
            </div>

            {/* Existing Bartender Card */}
            <div className={`glass-panel ${styles.optionCard}`} onClick={() => setView('login')}>
              <div className={styles.iconWrapper}>
                <LogIn size={40} className="text-gold" />
              </div>
              <h2 className={styles.optionTitle}>Existing Bartender</h2>
              <p className={styles.optionDesc}>Log in to manage your profile, view incoming inquiries, and update your gallery.</p>
              <div className={styles.optionLink}>
                Log In <ArrowRight size={16} />
              </div>
            </div>
          </div>
        )}

        {view === 'login' && (
          <div className="glass-panel" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem 2rem', width: '100%' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>Welcome Back</h2>
            
            {error && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Mobile Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  required
                  placeholder="Enter registered mobile number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={inputStyle}
                />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Password</label>
                  <button 
                    type="button" 
                    onClick={() => { setView('forgot-password'); setError(null); setSuccessMsg(null); }}
                    style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <input 
                  type="password" 
                  name="password"
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  style={inputStyle}
                />
              </div>
              
              <Button type="submit" size="lg" style={{ marginTop: '0.5rem' }} disabled={loading}>
                {loading ? 'Logging in...' : 'Login to Dashboard'}
              </Button>
              
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button type="button" onClick={() => setView('options')} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '0.875rem', textDecoration: 'underline' }}>
                  Back to options
                </button>
              </div>
            </form>
          </div>
        )}

        {view === 'forgot-password' && (
          <div className="glass-panel" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem 2rem', width: '100%' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', textAlign: 'center' }}>Reset Password</h2>
            <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', marginBottom: '2rem', fontSize: '0.875rem' }}>
              Enter your registered mobile number and we'll send a password reset link to your associated email.
            </p>
            
            {error && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}

            {successMsg && (
              <div style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                {successMsg}
              </div>
            )}

            <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Mobile Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  required
                  placeholder="Enter registered mobile number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={inputStyle}
                />
              </div>
              
              <Button type="submit" size="lg" style={{ marginTop: '0.5rem' }} disabled={loading}>
                {loading ? 'Sending Link...' : 'Send Reset Link'}
              </Button>
              
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button type="button" onClick={() => { setView('login'); setError(null); setSuccessMsg(null); }} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '0.875rem', textDecoration: 'underline' }}>
                  Back to Login
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default BartenderPortal;
