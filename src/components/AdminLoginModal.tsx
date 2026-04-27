import React, { useState } from 'react';
import { X, LockKeyhole } from 'lucide-react';

export const AdminLoginModal = ({ isAdminModalOpen, setIsAdminModalOpen, setIsAdminLoggedIn, navigateTo }: any) => {
  const [formStatus, setFormStatus] = useState({ loading: false, error: null as null | string });

  if (!isAdminModalOpen) return null;

  const handleAdminLogin = async (e: any) => {
    e.preventDefault();
    setFormStatus({ loading: true, error: null });
    const email = e.target.email.value;
    const password = e.target.password.value;
    
    try {
       const { supabase } = await import('../supabaseClient');
       if (!supabase) {
          throw new Error("Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in settings.");
       }
       
       const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
       });
       
       if (signInError) throw signInError;
       
       if (data.session) {
          setIsAdminLoggedIn(true);
          setIsAdminModalOpen(false);
          setFormStatus({ loading: false, error: null });
          window.location.href = '/admin-secret-dashboard';
       }
    } catch (err: any) {
       setFormStatus({ loading: false, error: err.message || "Failed to authenticate" });
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0B3D91]/90 backdrop-blur-md" onClick={() => setIsAdminModalOpen(false)}></div>
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm relative z-10 p-8 transform transition-all animate-in zoom-in-95 duration-200">
        <button onClick={() => setIsAdminModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-800"><X className="w-5 h-5"/></button>
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-blue-50 text-[#0B3D91] rounded-2xl mx-auto flex items-center justify-center mb-4">
            <LockKeyhole className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-heading font-bold text-[#1F2933]">Admin Access</h3>
          <p className="text-slate-500 text-sm mt-2">Sign in to manage content & leads.</p>
        </div>
        
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Admin Email</label>
            <input required name="email" type="email" placeholder="admin@example.com" className="w-full px-5 py-3.5 rounded-xl bg-[#F4F6F8] border border-gray-200 focus:border-[#0B3D91] outline-none font-medium" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
            <input required name="password" type="password" placeholder="••••••••" className="w-full px-5 py-3.5 rounded-xl bg-[#F4F6F8] border border-gray-200 focus:border-[#0B3D91] outline-none font-medium" />
          </div>
          
          {formStatus.error && <p className="text-red-500 text-xs font-bold mt-2 text-center">{formStatus.error}</p>}
          
          <button type="submit" disabled={formStatus.loading} className="w-full bg-[#0B3D91] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-black transition-all mt-4 disabled:opacity-70">
            {formStatus.loading ? 'Authenticating...' : 'Login to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};
