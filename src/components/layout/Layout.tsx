import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import AgeVerificationModal from '../ui/AgeVerificationModal';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, paddingTop: '80px' }}>
        {children}
      </main>
      <Footer />
      <AgeVerificationModal />
    </div>
  );
};

export default Layout;
