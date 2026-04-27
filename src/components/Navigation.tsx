import React, { useState, useEffect } from 'react';
import { ShieldCheck, LayoutDashboard, Menu, X } from 'lucide-react';
import { Icon } from '../Icons';
import { db } from '../databaseAdapter';

export const Navigation = ({ 
  isScrolled, 
  mobileMenuOpen, 
  setMobileMenuOpen, 
  isAdminLoggedIn, 
  navigateTo, 
  openQuoteModalFor 
}: any) => {
  const [navbar, setNavbar] = useState<any>({});

  useEffect(() => {
    return db.doc('cms_general', 'navbar').onSnapshot(setNavbar);
  }, []);

  return (
    <>
      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[80] bg-[#0B3D91]/95 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-200 md:hidden">
          <button onClick={() => setMobileMenuOpen(false)} className="absolute top-6 right-6 text-white/70 hover:text-white p-2 bg-white/10 rounded-full"><X className="w-8 h-8" /></button>
          <div className="flex flex-col gap-8 text-center">
            <button onClick={() => navigateTo('home')} className="text-3xl font-heading font-bold text-white hover:text-[#F5B800] transition-colors">Home</button>
            <button onClick={() => navigateTo('categories')} className="text-3xl font-heading font-bold text-white hover:text-[#F5B800] transition-colors">Products</button>
            <button onClick={() => { setMobileMenuOpen(false); openQuoteModalFor(''); }} className="text-3xl font-heading font-bold text-[#F5B800] hover:text-white transition-colors">Get Quote</button>
            {isAdminLoggedIn && <button onClick={() => navigateTo('dashboard')} className="text-3xl font-heading font-bold text-blue-300 hover:text-white transition-colors mt-8">Dashboard</button>}
          </div>
        </div>
      )}

      {/* NAVIGATION */}
      <nav className={`fixed w-full z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-[#0B3D91]/95 backdrop-blur-md py-4 shadow-xl border-[#0B3D91]' : 'bg-transparent py-6 border-transparent'}`}>
        <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigateTo('home')}>
            {navbar?.logoImage ? (
              <img src={navbar.logoImage} alt={navbar?.siteName || "Logo"} className="h-10 w-auto object-contain" />
            ) : (
              <div className={`p-2 rounded-xl transition-colors bg-[#F5B800] text-[#0B3D91]`}>
                <ShieldCheck className="w-7 h-7" />
              </div>
            )}
            <span className={`text-2xl font-heading font-bold tracking-tight transition-colors text-white`}>
              {navbar?.siteName ? navbar.siteName : <>ABS<span className={`font-normal ml-1 hidden sm:inline text-blue-200`}>Tech.</span></>}
            </span>
          </div>
          
          <div className="hidden md:flex gap-10 items-center font-medium">
            <button onClick={() => navigateTo('home')} className={`transition-colors text-white hover:text-[#F5B800]`}>Home</button>
            <button onClick={() => navigateTo('categories')} className={`transition-colors text-white hover:text-[#F5B800]`}>Products</button>
            {isAdminLoggedIn && <button onClick={() => navigateTo('dashboard')} className="transition-colors text-blue-200 hover:text-white flex items-center gap-2"><LayoutDashboard className="w-4 h-4"/> Admin</button>}
            <button onClick={() => openQuoteModalFor('')} className={`px-6 py-2.5 rounded-full font-bold transition-all shadow-lg hover:-translate-y-0.5 bg-[#F5B800] text-[#1F2933] hover:bg-white hover:text-[#0B3D91] shadow-black/20`}>
              Get a Quote
            </button>
          </div>
          <button className={`md:hidden transition-colors text-white`} onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-8 h-8" />
          </button>
        </div>
      </nav>
    </>
  );
};
