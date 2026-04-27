/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { QuoteModal } from './components/QuoteModal';
import { HomeView } from './pages/Home';
import { CategoriesIndexView } from './pages/Categories';
import { CategoryDetailView } from './pages/CategoryDetail';
import { AdminSecretDashboard } from './pages/AdminSecretDashboard';
import { QuotePage } from './pages/QuotePage';

export default function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [quotePreselect, setQuotePreselect] = useState({ category: '', product: '' });
  
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const navigateTo = (view: string, payload: any = null) => {
    if (view === 'categoryDetail' && payload) {
      setSelectedCategory(payload);
      // Let's create a URL friendly slug
      const slug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      navigate(`/category/${slug}`, { state: { category: payload }});
    } else if (view === 'categories') {
      navigate('/categories');
    } else if (view === 'home') {
      navigate('/');
    }
    
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
  };

  const openQuoteModalFor = (categoryTitle: string, productName = '') => {
    setQuotePreselect({ category: categoryTitle, product: productName });
    setIsQuoteModalOpen(true);
  };

  const isHome = location.pathname === '/';
  const isDashboard = location.pathname === '/admin-secret-dashboard';

  return (
    <div className="min-h-screen bg-[#F4F6F8] font-body text-[#1F2933] selection:bg-[#F5B800] selection:text-[#1F2933]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .font-heading { font-family: 'Outfit', sans-serif; }
        .font-body { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      {/* WHATSAPP FLOATING BUTTON */}
      <a href="https://wa.me/01718604464" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-[90] group text-decoration-none">
        <div className="bg-[#25D366] p-4 rounded-full shadow-[0_8px_30px_rgba(37,211,102,0.3)] text-white hover:scale-110 transition-transform relative flex items-center justify-center">
          <MessageCircle className="w-7 h-7" />
          <span className="absolute 0 right-0 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span></span>
        </div>
      </a>

      {isHome && (
        <Navigation 
          isScrolled={isScrolled}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          isAdminLoggedIn={isAdminLoggedIn}
          navigateTo={navigateTo}
          openQuoteModalFor={openQuoteModalFor}
        />
      )}

      <Routes>
        <Route path="/" element={<HomeView navigateTo={navigateTo} openQuoteModalFor={openQuoteModalFor} />} />
        <Route path="/categories" element={<CategoriesIndexView navigateTo={navigateTo} />} />
        <Route path="/category/:slug" element={<CategoryDetailView selectedCategory={selectedCategory} navigateTo={navigateTo} openQuoteModalFor={openQuoteModalFor} />} />
        <Route path="/admin-secret-dashboard" element={<AdminSecretDashboard />} />
        <Route path="/quote" element={<QuotePage navigateTo={navigateTo} />} />
      </Routes>

      {isHome && (
        <Footer 
          setIsAdminModalOpen={() => {
            navigate('/admin-secret-dashboard');
          }}
          navigateTo={navigateTo}
          openQuoteModalFor={openQuoteModalFor}
          isAdminLoggedIn={isAdminLoggedIn}
        />
      )}

      <QuoteModal 
        isQuoteModalOpen={isQuoteModalOpen} 
        setIsQuoteModalOpen={setIsQuoteModalOpen} 
        quotePreselect={quotePreselect} 
        setQuotePreselect={setQuotePreselect} 
      />
    </div>
  );
}
