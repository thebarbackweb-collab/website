import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Browse from './pages/Browse';
import About from './pages/About';
import PartnerLanding from './pages/PartnerLanding';
import PartnerRegistration from './pages/PartnerRegistration';
import BartenderPortal from './pages/BartenderPortal';
import Dashboard from './pages/Dashboard';
import BartenderProfile from './pages/BartenderProfile';
import BookingFlow from './pages/BookingFlow';
import Rentals from './pages/Rentals';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import { Cities, Occasions, HowItWorks, Guidelines, SuccessStories, FAQ, Terms, Privacy, Contact } from './pages/StaticPages';
import ScrollToTop from './components/layout/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/rentals" element={<Rentals />} />
        <Route path="/bartender/:city/:slug" element={<BartenderProfile />} />
        <Route path="/book/:bartenderId" element={<BookingFlow />} />
        <Route path="/portal" element={<BartenderPortal />} />
        <Route path="/partner" element={<PartnerLanding />} />
        <Route path="/partner/apply" element={<PartnerRegistration />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        
        {/* Footer Static Pages */}
        <Route path="/cities" element={<Cities />} />
        <Route path="/occasions" element={<Occasions />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/guidelines" element={<Guidelines />} />
        <Route path="/success-stories" element={<SuccessStories />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
