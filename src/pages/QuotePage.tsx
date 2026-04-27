import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { db } from '../databaseAdapter';
import { defaultCategoriesData } from '../data';

export const QuotePage = ({ navigateTo }: any) => {
  const [formStatus, setFormStatus] = useState({ loading: false, success: false, error: null as null | string });
  const [categories, setCategories] = useState<any[]>([]);
  const [navbar, setNavbar] = useState<any>({});

  useEffect(() => {
    const unsub1 = db.collection('cms_categories').onSnapshot(setCategories);
    const unsub2 = db.doc('cms_general', 'navbar').onSnapshot(setNavbar);
    return () => { unsub1(); unsub2(); };
  }, []);

  const categoriesList = React.useMemo(() => {
    return defaultCategoriesData.map(cat => ({...cat, ...(categories.find(c => c.id === cat.id)||{})}))
          .concat(categories.filter(d => !defaultCategoriesData.some(c => c.id === d.id)));
  }, [categories]);

  const handleQuoteSubmit = async (e: any) => {
    e.preventDefault();
    setFormStatus({ loading: true, success: false, error: null });
    const formData = new FormData(e.target);
    
    const categoryVal = formData.get('serviceCategory');
    const specificProd = formData.get('specificProduct');
    const fullServiceString = specificProd ? `${categoryVal} - ${specificProd}` : categoryVal;

    const quoteData = {
      name: formData.get('name'),
      phone: formData.get('number'),
      message: formData.get('address'),
      service: fullServiceString
    };
    try {
      await db.collection('quotes').add(quoteData);
      setFormStatus({ loading: false, success: true, error: null });
    } catch (err) { setFormStatus({ loading: false, success: false, error: "Submission Failed." }); }
  };

  return (
    <main className="min-h-screen bg-[#F4F6F8] flex flex-col">
      <Helmet>
        <title>{navbar?.siteName ? `${navbar.siteName} | Request Quote` : "Request Quote"}</title>
      </Helmet>

      {/* Simplified Navbar for the standalone page */}
      <nav className="bg-[#0B3D91] py-4 px-6 md:px-12 flex items-center justify-between shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('home')}>
          {navbar?.logoImage ? (
            <img src={navbar.logoImage} alt={navbar?.siteName || "Logo"} className="h-8 w-auto object-contain" />
          ) : (
            <div className="bg-transparent p-1 rounded-xl">
              <ShieldCheck className="text-[#F5B800] w-7 h-7" />
            </div>
          )}
          <span className="text-white text-xl font-heading font-black tracking-tight">{navbar?.siteName || "ABS Tech."}</span>
        </div>
        <button onClick={() => navigateTo('home')} className="text-white/80 font-medium hover:text-[#F5B800] flex items-center gap-2 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6 py-12">
        <div className="bg-white rounded-[2rem] shadow-xl w-full max-w-lg overflow-hidden border border-gray-100">
          <div className="bg-[#0B3D91] p-8 md:p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5B800]/10 rounded-bl-[100px] -z-0"></div>
            <div className="relative z-10">
              <h1 className="text-3xl font-heading font-bold text-white mb-2">Request a Quote</h1>
              <p className="text-blue-200 text-sm md:text-base">Provide your requirements and our technical team will contact you shortly.</p>
            </div>
          </div>
          
          {formStatus.success ? (
            <div className="p-12 text-center">
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-[#00A8A8]" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-[#0B3D91] mb-2">Request Sent Successfully!</h2>
              <p className="text-slate-500 mb-8">Thank you for reaching out. We will review your requirements and get back to you soon.</p>
              <button onClick={() => navigateTo('home')} className="bg-[#F4F6F8] text-[#1F2933] px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                Return to Homepage
              </button>
            </div>
          ) : (
            <form onSubmit={handleQuoteSubmit} className="p-8 md:p-10 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Name / Company</label>
                <input required name="name" type="text" placeholder="Your name or company" className="w-full px-5 py-3.5 rounded-xl bg-[#F4F6F8] border border-gray-200 focus:border-[#0B3D91] focus:ring-4 focus:ring-[#0B3D91]/10 focus:bg-white transition-all outline-none text-[#1F2933] font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                <input required name="number" type="tel" placeholder="e.g. 01700000000" className="w-full px-5 py-3.5 rounded-xl bg-[#F4F6F8] border border-gray-200 focus:border-[#0B3D91] focus:ring-4 focus:ring-[#0B3D91]/10 focus:bg-white transition-all outline-none text-[#1F2933] font-medium" />
              </div>
              
              <div className="p-5 bg-blue-50/50 rounded-xl border border-blue-100/50 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#0B3D91] uppercase tracking-wider mb-2">System Category</label>
                  <select required name="serviceCategory" defaultValue="" className="w-full px-4 py-3.5 rounded-lg bg-white border border-gray-200 focus:border-[#0B3D91] transition-all outline-none text-[#1F2933] font-bold text-sm cursor-pointer">
                    <option value="" disabled>Select a Service Category...</option>
                    {categoriesList.map((c: any) => <option key={c.id} value={c.title}>{c.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0B3D91] uppercase tracking-wider mb-2">Specific Component <span className="text-blue-400 font-normal">(Optional)</span></label>
                  <input name="specificProduct" type="text" placeholder="E.g., PTZ Camera or Router" className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-[#0B3D91] transition-all outline-none text-gray-600 font-medium text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Details / Installation Area</label>
                <textarea required name="address" placeholder="Tell us about your requirements, address, or any specific instructions..." className="w-full px-5 py-3.5 rounded-xl bg-[#F4F6F8] border border-gray-200 focus:border-[#0B3D91] focus:ring-4 focus:ring-[#0B3D91]/10 focus:bg-white transition-all outline-none text-[#1F2933] font-medium min-h-[120px] resize-none"></textarea>
              </div>
              <button type="submit" disabled={formStatus.loading} className="w-full bg-[#F5B800] text-[#1F2933] font-bold py-4 rounded-xl shadow-lg shadow-[#F5B800]/30 hover:bg-[#dca500] hover:shadow-[#F5B800]/40 hover:-translate-y-0.5 transition-all mt-4 disabled:opacity-70 disabled:hover:translate-y-0 text-lg">
                {formStatus.loading ? 'Submitting Request...' : 'Submit Inquiry'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
