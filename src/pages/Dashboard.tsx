import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { auth } from '../services/firebase/config';
import { getBartenderByUserId, updateBartender } from '../services/firebase/bartenders';
import { deleteDocument } from '../services/firebase/firestore';
import type { Bartender } from '../types';
import Layout from '../components/layout/Layout';
import ImageUpload from '../components/ui/ImageUpload';
import Button from '../components/ui/Button';

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", 
  "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", 
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal"
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [bartender, setBartender] = useState<Bartender | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // View vs Edit Mode
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Profile Edit State
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    experience: 0,
    city: '',
    state: '',
    whatsappNumber: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Delete Account State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
      if (!user) {
        navigate('/portal');
        return;
      }
      
      try {
        let profile = await getBartenderByUserId(user.uid);
        
        if (profile) {
          // If profile is missing a bartenderCode (older accounts), patch it immediately
          if (!profile.bartenderCode) {
            const newCode = Math.floor(10000 + Math.random() * 90000).toString();
            await updateBartender(profile.id, { bartenderCode: newCode });
            profile.bartenderCode = newCode;
          }

          setBartender(profile);
          setEditForm({
            name: profile.name,
            bio: profile.bio,
            experience: profile.experience || 0,
            city: profile.city,
            state: profile.state,
            whatsappNumber: profile.whatsappNumber
          });
        }
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ 
      ...prev, 
      [name]: name === 'experience' ? parseInt(value) || 0 : value 
    }));
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bartender) return;
    
    setSavingProfile(true);
    setSaveMessage(null);
    try {
      await updateBartender(bartender.id, editForm);
      setBartender(prev => prev ? { ...prev, ...editForm } : null);
      setSaveMessage("Profile details updated successfully!");
      setIsEditingProfile(false);
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      setError("Failed to save profile details");
    } finally {
      setSavingProfile(false);
    }
  };

  // ... (Media handlers remain unchanged)
  const handleProfileImageUpdate = async (url: string) => {
    if (!bartender) return;
    try {
      await updateBartender(bartender.id, { profileImage: url });
      setBartender(prev => prev ? { ...prev, profileImage: url } : null);
    } catch (err) {
      setError("Failed to update profile image");
    }
  };

  const handleCoverImageUpdate = async (url: string) => {
    if (!bartender) return;
    try {
      await updateBartender(bartender.id, { coverImage: url });
      setBartender(prev => prev ? { ...prev, coverImage: url } : null);
    } catch (err) {
      setError("Failed to update cover image");
    }
  };

  const handleGalleryAdd = async (url: string) => {
    if (!bartender || bartender.galleryImages.length >= 10) return;
    try {
      const newGallery = [...bartender.galleryImages, url];
      await updateBartender(bartender.id, { galleryImages: newGallery });
      setBartender(prev => prev ? { ...prev, galleryImages: newGallery } : null);
    } catch (err) {
      setError("Failed to update gallery");
    }
  };

  const handleGalleryRemove = async (index: number) => {
    if (!bartender) return;
    try {
      const newGallery = bartender.galleryImages.filter((_, i) => i !== index);
      await updateBartender(bartender.id, { galleryImages: newGallery });
      setBartender(prev => prev ? { ...prev, galleryImages: newGallery } : null);
    } catch (err) {
      setError("Failed to remove gallery image");
    }
  };

  const toggleAvailability = async () => {
    if (!bartender) return;
    const newStatus = bartender.availability === 'available' ? 'busy' : 'available';
    try {
      await updateBartender(bartender.id, { availability: newStatus });
      setBartender(prev => prev ? { ...prev, availability: newStatus } : null);
    } catch (err) {
      setError("Failed to update availability status");
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) return;
    if (!auth.currentUser || !auth.currentUser.email || !bartender) return;

    setDeletingAccount(true);
    setError(null);
    try {
      // 0. Re-authenticate to ensure deleteUser won't fail
      const credential = EmailAuthProvider.credential(auth.currentUser.email, deletePassword);
      await reauthenticateWithCredential(auth.currentUser, credential);

      // 1. Delete bartender doc
      await deleteDocument('bartenders', bartender.id);
      
      // 2. Delete user doc
      await deleteDocument('users', auth.currentUser.uid);

      // 3. Delete Firebase Auth user
      await deleteUser(auth.currentUser);

      // Redirection is handled by the auth state observer in Navbar/App, but let's force it
      window.location.href = '/';
    } catch (err: any) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Incorrect password. Please try again.');
      } else {
        setError(err.message || 'Failed to delete account. Please try again.');
      }
      setDeletingAccount(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>Loading dashboard...</div>
      </Layout>
    );
  }

  if (!bartender) {
    return (
      <Layout>
        <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
          <h2>No Bartender Profile Found</h2>
          <Button onClick={() => navigate('/partner')} style={{ marginTop: '1rem' }}>Complete Registration</Button>
        </div>
      </Layout>
    );
  }

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

  const detailLabelStyle = {
    fontSize: '0.875rem',
    color: 'var(--color-text-muted)',
    marginBottom: '0.25rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em'
  };

  const detailValueStyle = {
    fontSize: '1.125rem',
    color: 'white',
    marginBottom: '1.5rem'
  };

  return (
    <Layout>
      <div className="container" style={{ padding: 'min(4rem, 5vh) 1rem', maxWidth: '1200px' }}>
        
        {/* Header & ID */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '0.5rem' }}>
              Welcome back, {bartender.name.split(' ')[0]}
            </h1>
            <p style={{ color: 'var(--color-text-muted)' }}>Manage your profile, media, and bookings.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'stretch' }}>
            {/* Availability Toggle */}
            <button 
              type="button"
              onClick={toggleAvailability}
              style={{ 
                background: bartender.availability === 'available' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                border: `1px solid ${bartender.availability === 'available' ? '#22c55e' : '#ef4444'}`, 
                padding: '0.75rem 1.5rem', 
                borderRadius: '9999px', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
                color: bartender.availability === 'available' ? '#22c55e' : '#ef4444',
                fontWeight: 600,
                fontSize: '1rem'
              }}
            >
              <div style={{ 
                width: '10px', 
                height: '10px', 
                borderRadius: '50%', 
                background: bartender.availability === 'available' ? '#22c55e' : '#ef4444',
                boxShadow: `0 0 10px ${bartender.availability === 'available' ? '#22c55e' : '#ef4444'}`
              }}></div>
              {bartender.availability === 'available' ? 'Available to Book' : 'Not Available'}
            </button>

            {/* Bartender ID */}
            <div style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid var(--color-primary)', padding: '1rem 1.5rem', borderRadius: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Your Bartender ID</div>
              <div style={{ fontFamily: 'monospace', fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>{bartender.bartenderCode}</div>
            </div>
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', gap: '2rem' }}>
          
          {/* Profile Details Card */}
          <div className="glass-panel" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
              <h2 style={{ fontSize: '1.5rem' }}>Profile Details</h2>
              {!isEditingProfile && (
                <Button variant="outline" onClick={() => setIsEditingProfile(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
            
            {saveMessage && (
              <div style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                {saveMessage}
              </div>
            )}

            {!isEditingProfile ? (
              // View Mode
              <div>
                <div style={detailLabelStyle}>Full Name</div>
                <div style={detailValueStyle}>{bartender.name}</div>

                <div style={detailLabelStyle}>Professional Bio</div>
                <div style={{ ...detailValueStyle, whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{bartender.bio || 'No bio provided yet.'}</div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
                  <div>
                    <div style={detailLabelStyle}>Location</div>
                    <div style={detailValueStyle}>{bartender.city}, {bartender.state}</div>
                  </div>
                  <div>
                    <div style={detailLabelStyle}>Experience</div>
                    <div style={detailValueStyle}>{bartender.experience} Years</div>
                  </div>
                  <div>
                    <div style={detailLabelStyle}>WhatsApp Number</div>
                    <div style={detailValueStyle}>{bartender.whatsappNumber}</div>
                  </div>
                </div>
              </div>
            ) : (
              // Edit Mode Form
              <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input type="text" name="name" value={editForm.name} onChange={handleInputChange} style={inputStyle} required />
                </div>
                
                <div>
                  <label style={labelStyle}>Professional Bio</label>
                  <textarea 
                    name="bio" 
                    value={editForm.bio} 
                    onChange={handleInputChange} 
                    style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} 
                    required 
                    placeholder="Tell clients about your style and experience..."
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>City</label>
                    <input type="text" name="city" value={editForm.city} onChange={handleInputChange} style={inputStyle} required />
                  </div>
                  <div>
                    <label style={labelStyle}>State</label>
                    <select name="state" value={editForm.state} onChange={handleInputChange} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }} required>
                      <option value="" disabled>Select State</option>
                      {INDIAN_STATES.map(st => (
                        <option key={st} value={st} style={{ background: '#0f172a', color: 'white' }}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Years of Experience</label>
                    <input type="number" name="experience" value={editForm.experience} onChange={handleInputChange} style={inputStyle} min="0" required />
                  </div>
                  <div>
                    <label style={labelStyle}>WhatsApp Number</label>
                    <input type="tel" name="whatsappNumber" value={editForm.whatsappNumber} onChange={handleInputChange} style={inputStyle} required />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <Button type="submit" size="lg" disabled={savingProfile} style={{ flex: 1 }}>
                    {savingProfile ? 'Saving...' : 'Save Profile Details'}
                  </Button>
                  <Button type="button" size="lg" variant="outline" onClick={() => {
                    setIsEditingProfile(false);
                    // Reset form to current saved state
                    setEditForm({
                      name: bartender.name,
                      bio: bartender.bio,
                      experience: bartender.experience || 0,
                      city: bartender.city,
                      state: bartender.state,
                      whatsappNumber: bartender.whatsappNumber
                    });
                  }}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {/* Account Deletion */}
            <div style={{ marginTop: '3rem', paddingTop: '1rem' }}>
              {!showDeleteConfirm ? (
                <Button 
                  type="button" 
                  onClick={() => setShowDeleteConfirm(true)} 
                  style={{ background: 'transparent', border: '1px solid var(--color-danger)', color: 'var(--color-danger)' }}
                >
                  Delete Account
                </Button>
              ) : (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-danger)', padding: '1.5rem', borderRadius: '8px' }}>
                  <p style={{ color: 'white', marginBottom: '1rem', fontWeight: 500 }}>
                    Are you absolutely sure? This action cannot be undone. All your data, media, and bookings will be permanently erased.
                  </p>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
                    Enter your password to confirm deletion:
                  </label>
                  <input 
                    type="password" 
                    value={deletePassword} 
                    onChange={(e) => setDeletePassword(e.target.value)} 
                    style={{ ...inputStyle, marginBottom: '1rem', borderColor: 'rgba(239, 68, 68, 0.5)' }} 
                    placeholder="Your Password"
                  />
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <Button 
                      type="button" 
                      disabled={!deletePassword || deletingAccount}
                      onClick={handleDeleteAccount}
                      style={{ background: 'var(--color-danger)', color: 'white', flex: 1 }}
                    >
                      {deletingAccount ? 'Deleting...' : 'Permanently Delete'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeletePassword('');
                      }}
                      style={{ flex: 1 }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Media Manager Card */}
          <div className="glass-panel" style={{ padding: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
              Manage Media
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '2rem', marginBottom: '3rem' }}>
              <div>
                <label style={labelStyle}>Profile Image</label>
                <ImageUpload 
                  imageType="profile" 
                  label="Change Profile Photo" 
                  value={bartender.profileImage}
                  onUploadSuccess={handleProfileImageUpdate}
                  onRemove={() => handleProfileImageUpdate('')}
                />
              </div>
              <div>
                <label style={labelStyle}>Cover Image</label>
                <ImageUpload 
                  imageType="cover" 
                  label="Change Cover Photo" 
                  value={bartender.coverImage}
                  onUploadSuccess={handleCoverImageUpdate}
                  onRemove={() => handleCoverImageUpdate('')}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>
                Gallery Images ({bartender.galleryImages.length}/10)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem' }}>
                {bartender.galleryImages.map((url, idx) => (
                  <div key={idx} style={{ position: 'relative', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
                    <img src={url} alt={`Gallery ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button 
                      type="button" 
                      onClick={() => handleGalleryRemove(idx)} 
                      style={{ position: 'absolute', top: '0.25rem', right: '0.25rem', background: 'rgba(239, 68, 68, 0.8)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                {bartender.galleryImages.length < 10 && (
                  <div style={{ height: '100px' }}>
                    <ImageUpload 
                      imageType="gallery" 
                      label="+" 
                      isGallery={true}
                      onUploadSuccess={handleGalleryAdd}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
