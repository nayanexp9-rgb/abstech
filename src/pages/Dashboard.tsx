import React, { useState, useEffect } from 'react';
import { 
  LockKeyhole, ArrowLeft, LayoutDashboard, Edit3, LogOut, Save, Layers 
} from 'lucide-react';
import { Icon } from '../Icons';
import { getQuotes, getCmsCategories, saveCmsCategory, getCmsHero, saveCmsHero, subscribeToStore } from '../store';
import { defaultCategoriesData } from '../data';

export const DashboardView = ({ isAdminLoggedIn, navigateTo, setIsAdminLoggedIn }: any) => {
  const [activeTab, setActiveTab] = useState('leads');
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [saveStatus, setSaveStatus] = useState('');
  const [quotes, setQuotes] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any>({});
  const [dbHero, setDbHero] = useState<any>({});

  useEffect(() => {
    const updateData = () => {
      setQuotes(getQuotes());
      setDbCategories(getCmsCategories());
      setDbHero(getCmsHero());
    };
    
    updateData(); // initial load
    
    // Subscribe to changes (since we're storing locally)
    const unsubQuotes = subscribeToStore('quotes', updateData);
    const unsubCats = subscribeToStore('cms_categories', updateData);
    const unsubHero = subscribeToStore('cms_hero', updateData);

    return () => {
      unsubQuotes();
      unsubCats();
      unsubHero();
    };
  }, []);

  const categoriesData = defaultCategoriesData.map(cat => ({
    ...cat,
    ...(dbCategories[cat.id] || {})
  }));

  const heroData = {
    title: dbHero.title || "Secure Your \\nInfrastructure.",
    subtitle: dbHero.subtitle || "High-standard tech maintenance, security systems, and infrastructure management across Bangladesh. Peace of mind, engineered.",
    bgImage: dbHero.bgImage || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=2000&q=80"
  };

  const handleCategorySave = (e: any) => {
    e.preventDefault();
    setSaveStatus('Saving...');
    const formData = new FormData(e.target);
    const updatedData = {
      title: formData.get('title'),
      desc: formData.get('desc'),
      image: formData.get('image'),
    };
    try {
      saveCmsCategory(editingCategory.id, updatedData);
      setSaveStatus('Saved successfully!');
      setTimeout(() => { setSaveStatus(''); setEditingCategory(null); }, 1500);
    } catch (err) {
      setSaveStatus('Error saving data.');
    }
  };

  const handleHeroSave = (e: any) => {
    e.preventDefault();
    setSaveStatus('Saving Hero...');
    const formData = new FormData(e.target);
    const updatedData = {
      title: formData.get('title'),
      subtitle: formData.get('subtitle'),
      bgImage: formData.get('bgImage'),
    };
    try {
      saveCmsHero(updatedData);
      setSaveStatus('Hero Saved!');
      setTimeout(() => setSaveStatus(''), 1500);
    } catch (err) {
      setSaveStatus('Error saving data.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    navigateTo('home');
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F4F6F8] font-body flex items-center justify-center flex-col text-center px-6">
        <LockKeyhole className="w-20 h-20 text-slate-300 mb-6" />
        <h2 className="text-3xl font-heading font-bold text-[#0B3D91] mb-4">Access Denied</h2>
        <p className="text-slate-500 mb-8 max-w-md">You must be logged in as an administrator to view this page.</p>
        <button onClick={() => navigateTo('home')} className="bg-[#F5B800] text-[#1F2933] px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-[#dca500]">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F8] font-body flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <div className="w-full md:w-64 bg-[#0B3D91] text-white flex flex-col min-h-[auto] md:min-h-screen border-r border-white/10 shrink-0">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <span className="text-2xl font-heading font-black">ABS Admin</span>
          <button className="md:hidden text-white/50" onClick={() => navigateTo('home')}>X</button>
        </div>
        <div className="flex-grow p-4 space-y-2">
          <button onClick={() => { setActiveTab('leads'); setEditingCategory(null); }} className={`w-full text-left px-4 py-3 rounded-xl font-bold flex items-center gap-3 transition-colors ${activeTab === 'leads' ? 'bg-[#F5B800] text-[#0B3D91]' : 'hover:bg-white/10 text-white/80'}`}>
            <LayoutDashboard className="w-5 h-5" /> Lead Center
          </button>
          <button onClick={() => { setActiveTab('content'); setEditingCategory(null); }} className={`w-full text-left px-4 py-3 rounded-xl font-bold flex items-center gap-3 transition-colors ${activeTab === 'content' ? 'bg-[#F5B800] text-[#0B3D91]' : 'hover:bg-white/10 text-white/80'}`}>
            <Edit3 className="w-5 h-5" /> Site Content
          </button>
        </div>
        <div className="p-4 border-t border-white/10">
          <button onClick={handleAdminLogout} className="w-full text-left px-4 py-3 rounded-xl font-bold flex items-center gap-3 text-red-300 hover:bg-red-500/10 transition-colors">
            <LogOut className="w-5 h-5" /> Secure Logout
          </button>
        </div>
      </div>

      {/* Admin Content Area */}
      <div className="flex-grow p-6 lg:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          {activeTab === 'leads' && (
            <div className="animate-in fade-in duration-300">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-3xl font-heading font-bold text-[#0B3D91] mb-2">Quote Requests</h2>
                  <p className="text-slate-500 font-medium">Real-time incoming leads from the website.</p>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs tracking-wider font-bold">
                      <tr>
                        <th className="px-8 py-5">Date Received</th>
                        <th className="px-8 py-5">Client / Company</th>
                        <th className="px-8 py-5">Contact Details</th>
                        <th className="px-8 py-5">Requested Service</th>
                        <th className="px-8 py-5">Location</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {quotes.length === 0 ? (
                        <tr><td colSpan={5} className="px-8 py-24 text-center text-slate-400">Waiting for incoming quotes...</td></tr>
                      ) : (
                        quotes.map((q) => (
                          <tr key={q.id} className="hover:bg-blue-50/50 transition-colors">
                            <td className="px-8 py-6 text-sm text-slate-500">
                              {new Date(q.createdAt).toLocaleString('en-GB')}
                            </td>
                            <td className="px-8 py-6">
                              <div className="font-semibold text-[#1F2933]">{q.name}</div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="text-blue-600 font-medium">{q.number}</div>
                            </td>
                            <td className="px-8 py-6">
                              <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-[#0B3D91] border border-blue-100">
                                {q.service}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-sm text-slate-500 max-w-[200px] truncate" title={q.address}>
                              {q.address}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="animate-in fade-in duration-300">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-3xl font-heading font-bold text-[#0B3D91] mb-2">Content Management</h2>
                  <p className="text-slate-500 font-medium">Update website copy and images dynamically.</p>
                </div>
                {saveStatus && <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold animate-pulse">{saveStatus}</span>}
              </div>

              {!editingCategory ? (
                <div className="space-y-12">
                  {/* General Settings */}
                  <div>
                    <h3 className="text-xl font-heading font-bold text-[#1F2933] mb-6 flex items-center gap-2"><LayoutDashboard className="w-5 h-5 text-[#00A8A8]"/> Homepage Hero Section</h3>
                    <form onSubmit={handleHeroSave} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 space-y-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Main Headline</label>
                        <textarea name="title" defaultValue={heroData.title} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-gray-200 focus:border-[#0B3D91] outline-none text-[#1F2933] font-bold" rows={2}></textarea>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Subtitle / Description</label>
                        <textarea name="subtitle" defaultValue={heroData.subtitle} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-gray-200 focus:border-[#0B3D91] outline-none text-slate-600 font-medium" rows={3}></textarea>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Background Image URL</label>
                        <input name="bgImage" type="text" defaultValue={heroData.bgImage} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-gray-200 focus:border-[#0B3D91] outline-none text-slate-600 font-medium" />
                      </div>
                      <button type="submit" className="bg-[#0B3D91] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#1F2933] transition-colors">
                        <Save className="w-4 h-4" /> Save Hero Section
                      </button>
                    </form>
                  </div>

                  {/* Category List */}
                  <div>
                    <h3 className="text-xl font-heading font-bold text-[#1F2933] mb-6 flex items-center gap-2"><Layers className="w-5 h-5 text-[#00A8A8]"/> Product Categories</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categoriesData.map(cat => (
                        <div key={cat.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center group hover:border-[#0B3D91]/30 transition-colors cursor-pointer" onClick={() => setEditingCategory(cat)}>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-50 text-[#0B3D91] rounded-lg flex items-center justify-center shrink-0">
                              <Icon name={cat.iconName} className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-bold text-[#1F2933] group-hover:text-[#0B3D91] transition-colors">{cat.title}</h4>
                              <span className="text-xs text-slate-400 font-medium">{dbCategories[cat.id] ? 'Customized' : 'Default Data'}</span>
                            </div>
                          </div>
                          <Edit3 className="w-5 h-5 text-slate-300 group-hover:text-[#F5B800] transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="animate-in slide-in-from-right-4 duration-300">
                  <button onClick={() => setEditingCategory(null)} className="mb-6 text-slate-500 hover:text-[#0B3D91] font-bold flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to List
                  </button>
                  
                  <form onSubmit={handleCategorySave} className="bg-white p-8 md:p-12 rounded-[2rem] shadow-lg border border-slate-200">
                    <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
                      <div className="w-16 h-16 bg-blue-50 text-[#0B3D91] rounded-2xl flex items-center justify-center shrink-0">
                        <Icon name={editingCategory.iconName} className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-heading font-bold text-[#1F2933]">Editing: {editingCategory.title}</h3>
                        <p className="text-slate-500 text-sm">ID: {editingCategory.id}</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Display Title</label>
                        <input required name="title" type="text" defaultValue={editingCategory.title} className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-gray-200 focus:border-[#0B3D91] outline-none text-[#1F2933] font-bold text-lg" />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Short Description</label>
                        <textarea required name="desc" defaultValue={editingCategory.desc} className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-gray-200 focus:border-[#0B3D91] outline-none text-slate-600 font-medium min-h-[100px]"></textarea>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cover Image URL (Unsplash/Web Link)</label>
                        <div className="flex gap-4">
                          <input required name="image" type="text" defaultValue={editingCategory.image} className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-gray-200 focus:border-[#0B3D91] outline-none text-slate-600 font-medium font-mono text-sm" />
                          {editingCategory.image && (
                            <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                              <img src={editingCategory.image} alt="preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-8">
                        <button type="submit" className="w-full bg-[#F5B800] text-[#1F2933] py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#dca500] transition-colors text-lg shadow-lg shadow-[#F5B800]/20">
                          <Save className="w-5 h-5" /> Save Changes to Database
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
