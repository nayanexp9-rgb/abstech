import React, { useState, useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { db } from '../databaseAdapter';
import { defaultCategoriesData } from '../data';

export const QuoteModal = ({ isQuoteModalOpen, setIsQuoteModalOpen, quotePreselect, setQuotePreselect }: any) => {
  const [formStatus, setFormStatus] = useState({ loading: false, success: false, error: null as null | string });
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const unsub1 = db.collection('cms_categories').onSnapshot(setCategories);
    const unsub2 = db.collection('cms_products').onSnapshot(setProducts);
    return () => { unsub1(); unsub2(); };
  }, []);

  const categoriesList = React.useMemo(() => {
    return defaultCategoriesData.map(cat => ({...cat, ...(categories.find(c => c.id === cat.id)||{})}))
          .concat(categories.filter(d => !defaultCategoriesData.some(c => c.id === d.id)));
  }, [categories]);

  if (!isQuoteModalOpen) return null;

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
      setTimeout(() => { setIsQuoteModalOpen(false); setFormStatus({ loading: false, success: false, error: null }); setQuotePreselect({ category: '', product: '' }); }, 2000);
    } catch (err) { setFormStatus({ loading: false, success: false, error: "Submission Failed." }); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0B3D91]/80 backdrop-blur-sm" onClick={() => setIsQuoteModalOpen(false)}></div>
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md relative z-10 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="bg-[#0B3D91] p-8 border-b border-[#0B3D91] flex justify-between items-center sticky top-0 z-20">
          <div>
            <h3 className="text-2xl font-heading font-bold text-white">Request Quote</h3>
            <p className="text-blue-200 text-sm mt-1">Our technical team will call you back.</p>
          </div>
          <button onClick={() => { setIsQuoteModalOpen(false); setQuotePreselect({category:'', product:''}); }} className="text-white/50 hover:text-white transition-colors bg-white/10 p-2 rounded-full border border-white/10"><X className="w-5 h-5" /></button>
        </div>
        
        {formStatus.success ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-10 h-10 text-[#00A8A8]" /></div>
            <h4 className="text-2xl font-heading font-bold text-[#0B3D91]">Request Sent!</h4>
            <p className="text-slate-500 mt-2">We'll be in touch shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleQuoteSubmit} className="p-8 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Name / Company</label>
              <input required name="name" type="text" className="w-full px-5 py-3.5 rounded-xl bg-[#F4F6F8] border border-gray-200 focus:border-[#0B3D91] focus:ring-4 focus:ring-[#0B3D91]/10 focus:bg-white transition-all outline-none text-[#1F2933] font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
              <input required name="number" type="tel" className="w-full px-5 py-3.5 rounded-xl bg-[#F4F6F8] border border-gray-200 focus:border-[#0B3D91] focus:ring-4 focus:ring-[#0B3D91]/10 focus:bg-white transition-all outline-none text-[#1F2933] font-medium" />
            </div>
            
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0B3D91] uppercase tracking-wider mb-2">System Category</label>
                <select required name="serviceCategory" defaultValue={quotePreselect.category} className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-[#0B3D91] transition-all outline-none text-[#1F2933] font-bold text-sm">
                  <option value="" disabled>Select a Category...</option>
                  {categoriesList.map((c: any) => <option key={c.id} value={c.title}>{c.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0B3D91] uppercase tracking-wider mb-2">Specific Component (Optional)</label>
                <input name="specificProduct" type="text" defaultValue={quotePreselect.product} placeholder="E.g., PTZ Camera" className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-[#0B3D91] transition-all outline-none text-gray-600 font-medium text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Installation Area Details</label>
              <textarea required name="address" className="w-full px-5 py-3.5 rounded-xl bg-[#F4F6F8] border border-gray-200 focus:border-[#0B3D91] focus:ring-4 focus:ring-[#0B3D91]/10 focus:bg-white transition-all outline-none text-[#1F2933] font-medium min-h-[100px] resize-none"></textarea>
            </div>
            <button type="submit" disabled={formStatus.loading} className="w-full bg-[#F5B800] text-[#1F2933] font-bold py-4 rounded-xl shadow-lg shadow-[#F5B800]/30 hover:bg-[#dca500] hover:shadow-[#F5B800]/40 hover:-translate-y-0.5 transition-all mt-4 disabled:opacity-70 disabled:hover:translate-y-0">
              {formStatus.loading ? 'Sending...' : 'Submit Inquiry'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
