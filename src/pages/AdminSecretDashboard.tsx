import React, { useState, useEffect } from 'react';
import { db, storage } from '../databaseAdapter';
import { 
  LayoutDashboard, LayoutTemplate, Navigation, Boxes, Layers, Box, Users, Image as ImageIcon,
  Mail, Settings, Lock, UploadCloud, Plus, Edit2, Trash2, Check, X, ArrowLeft, Copy, LogOut, Link
} from 'lucide-react';
import { IconPicker } from '../components/IconPicker';
import { ImageUploader } from '../components/ImageUploader';
import { ProductListManager } from '../components/ProductListManager';
import { businessServices, defaultCategoriesData, clients } from '../data';

// === SUB-COMPONENTS ===

const useSyncStatus = () => {
  const [status, setStatus] = useState<'idle' | 'saving' | 'success'>('idle');
  return {
    status,
    start: () => setStatus('saving'),
    end: () => {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };
};

const SyncMessage = ({ status }: { status: 'idle' | 'saving' | 'success' }) => {
  if (status === 'success') {
    return <div className="text-green-600 font-medium text-sm flex items-center justify-center mt-2"><Check className="w-4 h-4 mr-1" /> Sync completed successfully!</div>;
  }
  return null;
};

const HeroEditor = () => {
  const [data, setData] = useState<any>({});
  const sync = useSyncStatus();

  useEffect(() => {
    return db.doc('cms_general', 'hero').onSnapshot(setData);
  }, []);

  const handleSave = async (e: any) => {
    e.preventDefault();
    sync.start();
    try {
      await db.doc('cms_general', 'hero').set({
        title: e.target.title.value,
        subtitle: e.target.subtitle.value,
        bgImage: e.target.bgImage.value,
        btnText: e.target.btnText.value,
        btnLink: e.target.btnLink.value,
      });
      sync.end();
    } catch (err: any) {
      alert("Failed to save: " + err.message);
      sync.end();
    }
  };

  return (
    <div className="max-w-2xl animate-in fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Hero Section Editor</h2>
      <form key={data ? JSON.stringify(data) : 'form'} onSubmit={handleSave} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
          <textarea name="title" defaultValue={data.title} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none" rows={2}></textarea>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Subtitle</label>
          <textarea name="subtitle" defaultValue={data.subtitle} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none" rows={3}></textarea>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Background Image</label>
          <ImageUploader name="bgImage" defaultValue={data.bgImage} onChange={(val: string) => setData({...data, bgImage: val})} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Button Text</label>
            <input name="btnText" type="text" defaultValue={data.btnText} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Button Link</label>
            <input name="btnLink" type="text" defaultValue={data.btnLink} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none" />
          </div>
        </div>
        <button type="submit" disabled={sync.status === 'saving'} className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 flex justify-center items-center">
          {sync.status === 'saving' ? 'Saving...' : <><Check className="w-5 h-5 mr-2" /> Save Hero Section</>}
        </button>
        <SyncMessage status={sync.status} />
      </form>
    </div>
  );
};

const NavbarEditor = () => {
  const [data, setData] = useState<any>({});
  const sync = useSyncStatus();

  useEffect(() => {
    return db.doc('cms_general', 'navbar').onSnapshot(setData);
  }, []);

  const handleSave = async (e: any) => {
    e.preventDefault();
    sync.start();
    try {
      await db.doc('cms_general', 'navbar').set({
        siteName: e.target.siteName.value,
        logoImage: e.target.logoImage.value,
      });
      sync.end();
    } catch (err: any) {
      alert("Failed to save: " + err.message);
      sync.end();
     }
  };

  return (
    <div className="max-w-2xl animate-in fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Navbar & Logo</h2>
      <form key={data ? JSON.stringify(data) : 'form'} onSubmit={handleSave} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Website Name</label>
          <input name="siteName" type="text" defaultValue={data.siteName} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Logo Image (Optional)</label>
          <ImageUploader name="logoImage" defaultValue={data.logoImage} onChange={(val: string) => setData({...data, logoImage: val})} />
          <p className="text-xs text-gray-500 mt-2">Leave blank to use text-based logo.</p>
        </div>
        <button type="submit" disabled={sync.status === 'saving'} className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 flex justify-center items-center">
          {sync.status === 'saving' ? 'Saving...' : <><Check className="w-5 h-5 mr-2" /> Save Navbar</>}
        </button>
        <SyncMessage status={sync.status} />
      </form>
    </div>
  );
};

const GenericListManager = ({ collection, title, fields }: any) => {
  const [dbItems, setDbItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const sync = useSyncStatus();

  useEffect(() => {
    return db.collection(collection).onSnapshot(setDbItems);
  }, [collection]);

  const items = React.useMemo(() => {
      if (collection === 'cms_categories') {
          return defaultCategoriesData.map(cat => ({...cat, ...(dbItems.find(c => c.id === cat.id)||{})}))
                .concat(dbItems.filter(d => !defaultCategoriesData.some(c => c.id === d.id)));
      } else if (collection === 'cms_services') {
          const defServices = businessServices.map((s,i) => ({...s, id: `default_svc_${i}`}));
          return defServices.map(s => ({...s, ...(dbItems.find((si: any) => si.id === s.id)||{})}))
                           .concat(dbItems.filter(d => !defServices.some(s => s.id === d.id)));
      } else if (collection === 'cms_clients') {
          const defClients = clients.map((c,i) => ({...c, id: `default_client_${i}`}));
          return defClients.map(c => ({...c, ...(dbItems.find((ci: any) => ci.id === c.id)||{})}))
                           .concat(dbItems.filter(d => !defClients.some(c => c.id === d.id)));
      }
      return dbItems;
  }, [dbItems, collection]);

  const handleSave = async (e: any) => {
    e.preventDefault();
    sync.start();
    const data: any = {};
    fields.forEach((f: any) => data[f.key] = e.target[f.key].value);
    
    try {
      if (editing && editing.id) {
        await db.doc(collection, editing.id).set(data);
      } else {
        await db.collection(collection).add(data);
      }
      sync.end();
      setEditing(null);
    } catch (err: any) {
      alert("Failed to save: " + err.message);
      sync.end();
    }
  };

  const deleteItem = async (id: string) => {
    if (window.confirm("Are you sure?")) await db.collection(collection).delete(id);
  };

  return (
    <div className="animate-in fade-in max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {!editing && (
          <button onClick={() => setEditing({})} className="bg-black text-white px-4 py-2 rounded-lg font-medium flex items-center shadow shadow-black/10 hover:bg-gray-800 transition">
            <Plus className="w-4 h-4 mr-2" /> Add New
          </button>
        )}
      </div>

      {editing ? (
        <form key={editing.id || 'new'} onSubmit={handleSave} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 space-y-4">
          <div className="flex justify-between items-center mb-4 pb-2 border-b">
            <h3 className="font-bold text-lg">{editing.id ? 'Edit Item' : 'New Item'}</h3>
            <button type="button" onClick={() => setEditing(null)} className="text-gray-500 hover:text-red-500"><X className="w-5 h-5"/></button>
          </div>
          {fields.map((f: any) => (
            <div key={f.key}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea name={f.key} defaultValue={editing[f.key]} required={f.required} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none" rows={3}></textarea>
              ) : f.type === 'icon' ? (
                <>
                   <input type="hidden" name={f.key} value={editing[f.key] || 'ShieldCheck'} id={`icon-input-${f.key}`} />
                   <IconPicker 
                      value={editing[f.key] || 'ShieldCheck'} 
                      onChange={(val) => {
                         const el = document.getElementById(`icon-input-${f.key}`) as HTMLInputElement;
                         if (el) el.value = val;
                         setEditing({...editing, [f.key]: val})
                      }} 
                   />
                </>
              ) : f.type === 'image' ? (
                 <ImageUploader 
                    name={f.key} 
                    defaultValue={editing[f.key]} 
                    onChange={(val: string) => setEditing({...editing, [f.key]: val})} 
                 />
              ) : (
                <input name={f.key} type={f.type || 'text'} defaultValue={editing[f.key]} required={f.required} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none" />
              )}
            </div>
          ))}
          <div className="pt-4">
            <button type="submit" disabled={sync.status === 'saving'} className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 flex justify-center items-center">
              {sync.status === 'saving' ? 'Saving...' : 'Save Item'}
            </button>
            <SyncMessage status={sync.status} />
          </div>
        </form>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, idx) => (
          <div key={item.id || idx} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col group relative">
             {/* If there's an image field, show it as a cover */}
             {fields.find((f:any) => f.type === 'image') && item[fields.find((f:any) => f.type === 'image').key] && (
                <div className="h-40 w-full bg-gray-100 overflow-hidden">
                  <img src={item[fields.find((f:any) => f.type === 'image').key]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
             )}
             
             <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                   <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                      {item[fields[0].key]} 
                   </h3>
                   {fields.find((f:any) => f.type === 'icon') && item[fields.find((f:any) => f.type === 'icon').key] && (
                      <span className="bg-gray-100 p-1.5 rounded-lg text-gray-600 block shrink-0 ml-2">
                         <span className="text-xs font-mono">{item[fields.find((f:any) => f.type === 'icon').key]}</span>
                      </span>
                   )}
                </div>

                <div className="space-y-2 mb-4 flex-1">
                   {fields.slice(1).map((f:any) => {
                      if (f.type === 'image' || f.type === 'icon') return null; // Already handled
                      if (!item[f.key]) return null;
                      return (
                         <div key={f.key}>
                            <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">{f.label}</span>
                            <span className="text-sm text-gray-600 line-clamp-2" title={item[f.key]}>{item[f.key]}</span>
                         </div>
                      );
                   })}
                </div>

                <div className="flex gap-2 mt-auto pt-4 border-t border-gray-50">
                  <button onClick={() => setEditing(item)} className="flex-1 bg-white border border-gray-200 hover:border-black text-gray-700 hover:text-black hover:bg-gray-50 px-3 py-2 rounded-lg font-medium transition flex items-center justify-center text-sm shadow-sm"><Edit2 className="w-4 h-4 mr-2"/> Edit</button>
                  <button onClick={() => deleteItem(item.id)} className="flex-1 bg-white border border-red-100 hover:border-red-600 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg font-medium transition flex items-center justify-center text-sm shadow-sm"><Trash2 className="w-4 h-4 mr-2"/> Delete</button>
                </div>
             </div>
          </div>
        ))}
        {items.length === 0 && <div className="col-span-full py-12 bg-white rounded-xl border border-gray-200 text-center text-gray-400">No items found. Click 'Add New' to create one.</div>}
      </div>
    </div>
  );
};

const LeadsManager = () => {
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    return db.collection('quotes').onSnapshot((data) => setLeads(data.sort((a,b) => b.id - a.id))); // rough sort by id which is timestamp
  }, []);

  return (
    <div className="animate-in fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Quote Requests (Leads)</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
            <tr>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Phone</th>
              <th className="px-6 py-4 font-semibold">Service</th>
              <th className="px-6 py-4 font-semibold">Message/Area</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leads.map(lead => (
              <tr key={lead.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-gray-500">{new Date(lead.createdAt || parseInt(lead.id) || Date.now()).toLocaleDateString()}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{lead.name}</td>
                <td className="px-6 py-4 text-gray-500">{lead.phone || lead.number}</td>
                <td className="px-6 py-4"><span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-semibold">{lead.service}</span></td>
                <td className="px-6 py-4 text-gray-500 max-w-[200px] truncate" title={lead.message || lead.address}>{lead.message || lead.address}</td>
              </tr>
            ))}
            {leads.length === 0 && <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No incoming quotes yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const MediaManager = () => {
  const [media, setMedia] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    return storage.onMediaSnapshot((data) => {
      setMedia(data.sort((a,b) => b.id - a.id));
    });
  }, []);

  const handleUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    await storage.uploadFile(file);
    setUploading(false);
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('URL Copied to clipboard!');
  };

  return (
    <div className="animate-in fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Media Manager</h2>
        <label className="bg-black text-white px-4 py-2 rounded-lg font-medium flex items-center shadow cursor-pointer hover:bg-gray-800 transition">
          <UploadCloud className="w-4 h-4 mr-2" /> 
          {uploading ? 'Uploading...' : 'Upload Image'}
          <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {media.map(m => (
          <div key={m.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group">
            <div className="h-32 bg-gray-100 relative">
               <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <button onClick={() => copyUrl(m.url)} className="bg-white text-black p-2 rounded-full font-bold text-xs flex items-center shadow-lg hover:bg-gray-100">
                    <Copy className="w-4 h-4 mr-1" /> Copy Link
                 </button>
               </div>
            </div>
            <div className="p-3 truncate text-xs text-gray-500 font-medium" title={m.name}>{m.name}</div>
          </div>
        ))}
        {media.length === 0 && <div className="col-span-full py-12 text-center text-gray-400">No media uploaded. Try uploading an image.</div>}
      </div>
    </div>
  );
};

const SettingsEditor = () => {
  const [data, setData] = useState<any>({});
  const sync = useSyncStatus();

  useEffect(() => {
    return db.doc('cms_general', 'cloudinary').onSnapshot(setData);
  }, []);

  const handleSave = async (e: any) => {
    e.preventDefault();
    sync.start();
    try {
      await db.doc('cms_general', 'cloudinary').set({
        cloudName: e.target.cloudName.value,
        uploadPreset: e.target.uploadPreset.value,
      });
      sync.end();
    } catch (err: any) {
      alert("Failed to save settings. If using Supabase, please disable RLS for 'cms_general' or update policies: " + err.message);
      sync.end();
    }
  };

  const seedDemoData = async () => {
    if (!window.confirm("This will load demo products, services, and categories into your database. Are you sure?")) return;
    
    // Dynamically import the mock data array
    const { defaultCategoriesData, businessServices } = await import('../data');
    
    // Seed Services
    for (const s of businessServices) {
       await db.collection('cms_services').add({ title: s.title, iconName: s.iconName, desc: s.desc });
    }

    // Seed Categories and Products
    for (const cat of defaultCategoriesData) {
       const catObj: any = { title: cat.title, desc: cat.desc, image: cat.image };
       const newCat = await db.collection('cms_categories').add(catObj) as any;
       
       if (cat.items && newCat && newCat.id) {
          for (const item of cat.items) {
             const itemObj = { categoryId: newCat.id, name: item.name, desc: item.desc };
             await db.collection('cms_products').add(itemObj);
          }
       }
    }
    
    alert("Demo data loaded successfully!");
  };

  return (
    <div className="max-w-2xl animate-in fade-in space-y-6">
      <div>
         <h2 className="text-2xl font-bold text-gray-900 mb-6">Cloudinary Integration Settings</h2>
         <form key={data ? JSON.stringify(data) : 'form'} onSubmit={handleSave} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-800 mb-4">
             <strong>Important:</strong> Enter your Cloudinary credentials here to enable global image uploading directly to your Cloudinary storage. Make sure your upload preset is set to 'unsigned'.
           </div>
           <div>
             <label className="block text-sm font-semibold text-gray-700 mb-2">Cloudinary Cloud Name</label>
             <input name="cloudName" type="text" defaultValue={data.cloudName} placeholder="e.g., dxxxxxxxx" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none" required />
           </div>
           <div>
             <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Preset (Unsigned)</label>
             <input name="uploadPreset" type="text" defaultValue={data.uploadPreset} placeholder="e.g., my_preset" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none" required />
           </div>
           <button type="submit" disabled={sync.status === 'saving'} className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 flex justify-center items-center">
             {sync.status === 'saving' ? 'Saving...' : <><Check className="w-5 h-5 mr-2" /> Save Cloudinary Credentials</>}
           </button>
           <SyncMessage status={sync.status} />
         </form>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
         <h3 className="font-bold text-lg mb-2">System Initializer</h3>
         <p className="text-sm text-gray-500 mb-4">If your database is empty, you can load the default sample data (services, categories, products) with one click.</p>
         <button onClick={seedDemoData} className="w-full border-2 border-dashed border-gray-300 text-gray-600 hover:border-black hover:text-black font-semibold py-3 rounded-lg transition flex justify-center items-center">
            Load Sample Data
         </button>
      </div>
    </div>
  );
};

const ContactEditor = () => {
  const [data, setData] = useState<any>({});
  const sync = useSyncStatus();

  useEffect(() => {
    return db.doc('cms_general', 'contact').onSnapshot(setData);
  }, []);

  const handleSave = async (e: any) => {
    e.preventDefault();
    sync.start();
    try {
      await db.doc('cms_general', 'contact').set({
        phone: e.target.phone.value,
        email: e.target.email.value,
        address: e.target.address.value,
        footerText: e.target.footerText.value,
      });
      sync.end();
    } catch (err: any) {
      alert("Failed to save: " + err.message);
      sync.end();
    }
  };

  return (
    <div className="max-w-2xl animate-in fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact & Footer</h2>
      <form key={data ? JSON.stringify(data) : 'form'} onSubmit={handleSave} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
          <input name="phone" type="text" defaultValue={data.phone} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
          <input name="email" type="email" defaultValue={data.email} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Headquarters Address</label>
          <textarea name="address" defaultValue={data.address} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none" rows={2}></textarea>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Footer About Text</label>
          <textarea name="footerText" defaultValue={data.footerText} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none" rows={3}></textarea>
        </div>
        <button type="submit" disabled={sync.status === 'saving'} className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 flex justify-center items-center">
          {sync.status === 'saving' ? 'Saving...' : <><Check className="w-5 h-5 mr-2" /> Save Contact Info</>}
        </button>
        <SyncMessage status={sync.status} />
      </form>
    </div>
  );
};


// === MAIN APPLICATION SHELL ===

export const AdminSecretDashboard = () => {
  const [auth, setAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState('overview');

  useEffect(() => {
    import('../supabaseClient').then(({ supabase }) => {
       if (supabase) {
          supabase.auth.getSession().then(({ data: { session } }) => {
             if (session) setAuth(true);
          });
          
          supabase.auth.onAuthStateChange((_event, session) => {
             if (session) setAuth(true);
             else setAuth(false);
          });
       }
    });
  }, []);

  // Basic Password Gate
  if (!auth) {
    return (
      <div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center font-['Inter',sans-serif] px-4">
         <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-sm w-full">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-xl mb-6 shadow-sm"><Lock className="w-6 h-6" /></div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
            <p className="text-gray-500 text-sm mb-6">Please enter your credentials to access the site data builder.</p>
            {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}
            <form onSubmit={async (e: any) => {
               e.preventDefault();
               setLoading(true);
               setError('');
               
               try {
                 const { supabase } = await import('../supabaseClient');
                 if (!supabase) {
                    throw new Error("Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.");
                 }
                 const { data, error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                 });
                 
                 if (signInError) throw signInError;
                 
                 if (data.session) {
                    setAuth(true);
                 }
               } catch (err: any) {
                 setError(err.message || 'An error occurred during login.');
               } finally {
                 setLoading(false);
               }
            }}>
               <div className="space-y-4 mb-6">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                   <input type="email" name="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@example.com" required className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black outline-none" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                   <input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black outline-none" />
                 </div>
               </div>
               <button type="submit" disabled={loading} className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition disabled:opacity-50">
                  {loading ? 'Signing in...' : 'Sign In'}
               </button>
            </form>
         </div>
      </div>
    )
  }

  const navGroups = [
    {
      title: 'Site Configuration',
      items: [
        { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
        { id: 'navbar', icon: Navigation, label: 'Navbar & Logo' },
        { id: 'hero', icon: LayoutTemplate, label: 'Hero Section' },
        { id: 'contact', icon: Mail, label: 'Contact & Footer' },
      ]
    },
    {
      title: 'Content Management',
      items: [
        { id: 'services', icon: Boxes, label: 'Services' },
        { id: 'categories', icon: Layers, label: 'Categories' },
        { id: 'products', icon: Box, label: 'Products' },
      ]
    },
    {
      title: 'Business & Media',
      items: [
        { id: 'clients', icon: Users, label: 'Clients & Partners' },
        { id: 'leads', icon: Users, label: 'Quote Requests' },
        { id: 'media', icon: ImageIcon, label: 'Media Manager' },
      ]
    },
    {
      title: 'System',
      items: [
        { id: 'settings', icon: Settings, label: 'Settings' },
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-[#F9FAFB] font-['Inter',sans-serif] text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col z-10 shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
           <div className="w-8 h-8 bg-black rounded-lg text-white flex items-center justify-center mr-3"><Lock className="w-4 h-4"/></div>
           <span className="font-bold tracking-tight text-lg">Site Builder</span>
        </div>
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
           {navGroups.map((group, idx) => (
             <div key={idx}>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-3">{group.title}</h3>
                <div className="space-y-1">
                  {group.items.map(item => (
                    <button 
                       key={item.id} 
                       onClick={() => setView(item.id)}
                       className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${view === item.id ? 'bg-black text-white shadow-md' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                    >
                       <item.icon className={`w-4 h-4 mr-3 ${view === item.id ? 'text-white' : 'text-gray-400'}`} />
                       {item.label}
                    </button>
                  ))}
                </div>
             </div>
           ))}
        </div>
        <div className="p-4 border-t border-gray-100 space-y-2">
           <button onClick={() => window.location.href = '/'} className="w-full flex items-center justify-center px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">
              <ArrowLeft className="w-4 h-4 mr-2" /> Exit to Website
           </button>
           <button 
              onClick={async () => {
                 const { supabase } = await import('../supabaseClient');
                 if (supabase) await supabase.auth.signOut();
                 setAuth(false);
              }} 
              className="w-full flex items-center justify-center px-3 py-2.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition"
           >
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
           </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-12 relative">
         <div className="absolute top-0 right-0 p-8 opacity-5 -z-10 pointer-events-none">
            <LayoutDashboard className="w-64 h-64" />
         </div>

         {view === 'overview' && (
            <div className="animate-in fade-in">
               <h1 className="text-3xl font-extrabold tracking-tight mb-2">Welcome back, Admin</h1>
               <p className="text-gray-500 mb-8">Manage your completely dynamic site content from this centralized dashboard.</p>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                     <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4"><Users className="w-6 h-6"/></div>
                     <div className="text-xl font-bold">Manage Leads</div>
                     <p className="text-sm text-gray-500 mt-1">Review your incoming quote requests.</p>
                     <button onClick={() => setView('leads')} className="mt-4 text-sm font-semibold text-blue-600 hover:underline">Go to Leads &rarr;</button>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                     <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4"><LayoutTemplate className="w-6 h-6"/></div>
                     <div className="text-xl font-bold">Edit Homepage</div>
                     <p className="text-sm text-gray-500 mt-1">Update hero titles and backgrounds.</p>
                     <button onClick={() => setView('hero')} className="mt-4 text-sm font-semibold text-purple-600 hover:underline">Go to Hero Editor &rarr;</button>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                     <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4"><Box className="w-6 h-6"/></div>
                     <div className="text-xl font-bold">Product Catalog</div>
                     <p className="text-sm text-gray-500 mt-1">Add or remove categories and products.</p>
                     <button onClick={() => setView('products')} className="mt-4 text-sm font-semibold text-emerald-600 hover:underline">Go to Products &rarr;</button>
                  </div>
                  
                  {/* QUICK SHARE WIDGET */}
                  <div className="bg-gradient-to-br from-gray-900 to-black text-white p-6 rounded-2xl shadow-xl col-span-1 md:col-span-3 flex flex-col md:flex-row items-center justify-between gap-6">
                     <div>
                        <div className="text-xl font-bold flex items-center gap-2"><Link className="w-5 h-5 text-[#F5B800]"/> Quick Share Form</div>
                        <p className="text-sm text-gray-400 mt-1">Don't remember the link? Copy the direct Quote Form link to easily send to your customers.</p>
                     </div>
                     <div className="flex gap-3 w-full md:w-auto">
                        <button onClick={() => {
                           navigator.clipboard.writeText(window.location.origin + '/quote');
                           alert('Form Link copied to clipboard! You can now paste it anywhere.');
                        }} className="flex-1 md:flex-none bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition flex items-center justify-center gap-2">
                           <Copy className="w-4 h-4"/> Copy Link
                        </button>
                        <button onClick={() => {
                           const msg = encodeURIComponent(`Hi! Please submit your requirements using our quick form here: ${window.location.origin}/quote`);
                           window.open(`https://wa.me/?text=${msg}`, '_blank');
                        }} className="flex-1 md:flex-none bg-[#25D366] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#1da851] transition flex items-center justify-center gap-2">
                           WhatsApp
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}
         {view === 'hero' && <HeroEditor />}
         {view === 'navbar' && <NavbarEditor />}
         {view === 'services' && (
            <GenericListManager 
               collection="cms_services" 
               title="Services Management" 
               fields={[
                  { key: 'title', label: 'Service Name', required: true },
                  { key: 'iconName', label: 'Service Icon', type: 'icon', required: true },
                  { key: 'desc', label: 'Description', type: 'textarea', required: true }
               ]} 
            />
         )}
         {view === 'categories' && (
            <GenericListManager 
               collection="cms_categories" 
               title="Product Categories" 
               fields={[
                  { key: 'title', label: 'Category Title', required: true },
                  { key: 'image', label: 'Cover Image', type: 'image', required: true },
                  { key: 'desc', label: 'Description', type: 'textarea', required: true }
               ]} 
            />
         )}
         {view === 'products' && (
            <ProductListManager />
         )}
         {view === 'clients' && (
            <GenericListManager 
               collection="cms_clients" 
               title="Clients & Partners" 
               fields={[
                  { key: 'name', label: 'Company Name', required: true },
                  { key: 'logo', label: 'Company Logo', type: 'image', required: true },
                  { key: 'works', label: 'Services Provided', required: true }
               ]} 
            />
         )}
         {view === 'leads' && <LeadsManager />}
         {view === 'media' && <MediaManager />}
         {view === 'contact' && <ContactEditor />}
         {view === 'settings' && <SettingsEditor />}
      </main>
    </div>
  );
};
