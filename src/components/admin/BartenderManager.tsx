import React, { useState, useEffect } from 'react';
import { getAllBartenders, updateBartender, deleteBartender } from '../../services/firebase/bartenders';
import type { Bartender } from '../../types';
import Button from '../ui/Button';
import { Trash2, UserX, UserCheck, Eye, X } from 'lucide-react';

const BartenderManager: React.FC = () => {
  const [bartenders, setBartenders] = useState<Bartender[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBartender, setSelectedBartender] = useState<Bartender | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAllBartenders();
      setBartenders(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'busy' ? 'available' : 'busy';
    try {
      await updateBartender(id, { availability: newStatus });
      loadData();
    } catch (e) {
      alert("Error updating status");
    }
  };

  const handleBan = async (id: string, currentlyVerified: boolean) => {
    try {
      await updateBartender(id, { verified: !currentlyVerified });
      loadData();
    } catch (e) {
      alert("Error updating verification");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this bartender?')) {
      try {
        await deleteBartender(id);
        loadData();
      } catch (e) {
        alert("Error deleting");
      }
    }
  };

  if (loading) return <div>Loading bartenders...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem' }}>Bartenders</h2>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '1rem' }}>Name</th>
              <th style={{ padding: '1rem' }}>City</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Verified / Banned</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bartenders.map(b => (
              <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1rem' }}>{b.name}</td>
                <td style={{ padding: '1rem' }}>{b.city}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px', 
                    fontSize: '0.75rem',
                    background: b.availability === 'available' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: b.availability === 'available' ? '#4ade80' : '#f87171'
                  }}>
                    {b.availability.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  {b.verified ? (
                    <span style={{ color: '#4ade80' }}>Active</span>
                  ) : (
                    <span style={{ color: '#f87171' }}>Banned</span>
                  )}
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <Button variant="ghost" onClick={() => setSelectedBartender(b)} style={{ padding: '0.5rem', marginRight: '0.5rem' }}>
                    <Eye size={18} />
                  </Button>
                  <Button variant="ghost" onClick={() => handleToggleStatus(b.id, b.availability)} style={{ padding: '0.5rem', marginRight: '0.5rem' }}>
                    {b.availability === 'busy' ? <UserCheck size={18} /> : <UserX size={18} />}
                  </Button>
                  <button 
                    onClick={() => handleBan(b.id, b.verified)} 
                    style={{ 
                      padding: '0.5rem 1rem', 
                      marginRight: '0.5rem', 
                      background: b.verified ? '#ef4444' : '#22c55e', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      fontWeight: 'bold', 
                      cursor: 'pointer' 
                    }}
                  >
                    {b.verified ? 'BAN ACCOUNT' : 'UNBAN'}
                  </button>
                  <button 
                    onClick={() => handleDelete(b.id)} 
                    style={{ 
                      padding: '0.5rem 1rem', 
                      background: '#991b1b', 
                      color: 'white', 
                      border: '2px solid #ef4444', 
                      borderRadius: '4px', 
                      fontWeight: 'bold', 
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <Trash2 size={16} /> DELETE
                  </button>
                </td>
              </tr>
            ))}
            {bartenders.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No bartenders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedBartender && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <button 
              onClick={() => setSelectedBartender(null)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
              <img src={selectedBartender.profileImage} alt={selectedBartender.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-primary)' }} />
              <div>
                <h3 style={{ fontSize: '1.5rem', margin: 0, fontFamily: 'var(--font-serif)' }}>{selectedBartender.name}</h3>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Code: {selectedBartender.bartenderCode}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Email Address</div>
                <div style={{ fontWeight: 500 }}>{selectedBartender.email || 'N/A'}</div>
              </div>
              <div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Login Phone</div>
                <div style={{ fontWeight: 500 }}>{selectedBartender.loginPhone || 'N/A'}</div>
              </div>
              <div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Calling Number</div>
                <div style={{ fontWeight: 500 }}>{selectedBartender.callingNumber || 'N/A'}</div>
              </div>
              <div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>WhatsApp Number</div>
                <div style={{ fontWeight: 500 }}>{selectedBartender.whatsappNumber || 'N/A'}</div>
              </div>
              <div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Location</div>
                <div style={{ fontWeight: 500 }}>{selectedBartender.city}, {selectedBartender.state}</div>
              </div>
              <div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Experience</div>
                <div style={{ fontWeight: 500 }}>{selectedBartender.experience} Years</div>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Bio</div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', fontSize: '0.875rem', lineHeight: 1.6 }}>
                {selectedBartender.bio}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default BartenderManager;
