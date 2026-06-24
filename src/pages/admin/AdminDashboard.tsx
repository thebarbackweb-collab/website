import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import BartenderManager from '../../components/admin/BartenderManager';
import EquipmentManager from '../../components/admin/EquipmentManager';
import BannerManager from '../../components/admin/BannerManager';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'bartenders' | 'equipments' | 'banners'>('bartenders');

  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth');
    if (isAuth !== 'true') {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin');
  };

  return (
    <Layout>
      <div className="container" style={{ padding: '6rem 1.5rem', minHeight: '80vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>Log Out</Button>
        </div>

        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem', paddingBottom: '0.5rem' }}>
          <button 
            onClick={() => setActiveTab('bartenders')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: activeTab === 'bartenders' ? 'var(--color-primary)' : 'white',
              fontWeight: activeTab === 'bartenders' ? 600 : 400,
              cursor: 'pointer',
              fontSize: '1.125rem',
              padding: '0.5rem 1rem'
            }}
          >
            Manage Bartenders
          </button>
          <button 
            onClick={() => setActiveTab('equipments')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: activeTab === 'equipments' ? 'var(--color-primary)' : 'white',
              fontWeight: activeTab === 'equipments' ? 600 : 400,
              cursor: 'pointer',
              fontSize: '1.125rem',
              padding: '0.5rem 1rem'
            }}
          >
            Rental Equipments
          </button>
          <button 
            onClick={() => setActiveTab('banners')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: activeTab === 'banners' ? 'var(--color-primary)' : 'white',
              fontWeight: activeTab === 'banners' ? 600 : 400,
              cursor: 'pointer',
              fontSize: '1.125rem',
              padding: '0.5rem 1rem'
            }}
          >
            Manage Banners
          </button>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          {activeTab === 'bartenders' && <BartenderManager />}
          {activeTab === 'equipments' && <EquipmentManager />}
          {activeTab === 'banners' && <BannerManager />}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
