import React, { useState, useEffect } from 'react';
import { Award, ShieldCheck, Building2, MapPin, Phone, Mail } from 'lucide-react';
import { db } from '../databaseAdapter';

export const Footer = ({
  setIsAdminModalOpen,
  navigateTo,
  openQuoteModalFor,
  isAdminLoggedIn
}: any) => {
  const [footerClickCount, setFooterClickCount] = useState(0);
  const [contact, setContact] = useState<any>({});
  const [navbar, setNavbar] = useState<any>({});

  useEffect(() => {
    db.doc('cms_general', 'contact').onSnapshot(setContact);
    db.doc('cms_general', 'navbar').onSnapshot(setNavbar);
  }, []);

  const handleLogoClick = () => {
    const newCount = footerClickCount + 1;
    setFooterClickCount(newCount);
    if (newCount >= 5) {
      setIsAdminModalOpen(true);
      setFooterClickCount(0);
    }
  };

  return (
    <footer className="bg-[#1F2933] text-gray-400 pt-16 pb-10">
      <div className="container mx-auto px-6 lg:px-12">
        
        <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-16 pb-12 border-b border-gray-800">
          <div className="bg-gray-800/50 border border-gray-700 px-6 py-3 rounded-full flex items-center gap-3">
            <Award className="text-[#F5B800] w-5 h-5" />
            <span className="text-sm font-bold text-white tracking-widest">TRAD/DSCC/023844/2023</span>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 px-6 py-3 rounded-full flex items-center gap-3">
            <ShieldCheck className="text-[#F5B800] w-5 h-5" />
            <span className="text-sm font-bold text-white tracking-widest">TIN: 181681718533</span>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 px-6 py-3 rounded-full flex items-center gap-3">
            <Building2 className="text-[#F5B800] w-5 h-5" />
            <span className="text-sm font-bold text-white tracking-widest">Registered Company</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
          <div className="md:col-span-5 lg:col-span-4">
            <div className="flex items-center gap-3 mb-6 cursor-pointer select-none group" onClick={handleLogoClick}>
              {navbar?.logoImage ? (
                <img src={navbar.logoImage} alt={navbar?.siteName || "Logo"} className="h-12 w-auto object-contain" />
              ) : (
                <ShieldCheck className="text-[#F5B800] w-8 h-8 group-hover:rotate-12 transition-transform" />
              )}
              <span className="text-2xl font-heading font-bold text-white tracking-tight">{navbar?.siteName || "ABS Tech."}</span>
            </div>
            <p className="leading-relaxed font-medium whitespace-pre-line">{contact?.footerText || "Technology Dependent Bangladesh is our vision. Excellence in maintenance and deployment."}</p>
          </div>

          <div className="md:col-span-7 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-12 lg:gap-8">
            <div>
              <h4 className="text-[#F5B800] font-heading font-bold mb-6 tracking-widest uppercase text-sm">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start"><MapPin className="text-[#F5B800] w-5 h-5 flex-shrink-0" /> <span className="text-sm font-medium whitespace-pre-line">{contact?.address || "Corporate: Banasree, Dhaka 1219\nHubs: Dhaka, Khulna, Chattogram"}</span></li>
                <li className="flex gap-3 items-center"><Phone className="text-[#F5B800] w-5 h-5" /> <span className="text-sm font-medium">{contact?.phone || "+880 1718604464"}</span></li>
                <li className="flex gap-3 items-center"><Mail className="text-[#F5B800] w-5 h-5" /> <span className="text-sm font-medium">{contact?.email || "absultrabd@gmail.com"}</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#F5B800] font-heading font-bold mb-6 tracking-widest uppercase text-sm">Quick Links</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li><button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">Home Page</button></li>
                <li><button onClick={() => navigateTo('categories')} className="hover:text-white transition-colors">Product Catalog</button></li>
                <li><button onClick={() => openQuoteModalFor('')} className="hover:text-white transition-colors">Request Quotation</button></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-semibold text-gray-600 tracking-wider">&copy; {new Date().getFullYear()} ABS Technologies. All rights reserved.</p>
          <p className="text-xs font-semibold text-gray-600 tracking-wider flex items-center gap-2">
            Engineering with Confidence.
            {isAdminLoggedIn && <span className="bg-red-500 text-white px-2 py-0.5 rounded-md text-[10px] uppercase font-bold ml-2">Admin Active</span>}
          </p>
        </div>
      </div>
    </footer>
  );
};
