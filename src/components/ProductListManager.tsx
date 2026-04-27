import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { db } from '../databaseAdapter';

import { defaultCategoriesData } from '../data';

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

export const ProductListManager = () => {
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const sync = useSyncStatus();

  useEffect(() => {
    const unsub1 = db.collection('cms_products').onSnapshot(setDbProducts);
    const unsub2 = db.collection('cms_categories').onSnapshot(setDbCategories);
    return () => { unsub1(); unsub2(); };
  }, []);

  const categories = React.useMemo(() => {
      return defaultCategoriesData.map(cat => ({...cat, ...(dbCategories.find(c => c.id === cat.id)||{})}))
            .concat(dbCategories.filter(d => !defaultCategoriesData.some(c => c.id === d.id)));
  }, [dbCategories]);

  const products = React.useMemo(() => {
     const defaultProducts = defaultCategoriesData.flatMap(cat => 
        (cat.items || []).map((p, i) => ({
             ...p,
             id: `default_prod_${cat.id}_${i}`,
             categoryId: cat.id
        }))
     );
     return defaultProducts.map(p => ({...p, ...(dbProducts.find(dp => dp.id === p.id) || {})}))
           .concat(dbProducts.filter(dp => !defaultProducts.some(p => p.id === dp.id)));
  }, [dbProducts, dbCategories]);

  const handleSave = async (e: any) => {
    e.preventDefault();
    sync.start();
    const data = {
      name: e.target.name.value,
      categoryId: e.target.categoryId.value,
      price: e.target.price.value,
      desc: e.target.desc.value,
      image: e.target.image?.value || ''
    };
    
    try {
      if (editing && editing.id) {
        await db.doc('cms_products', editing.id).set(data);
      } else {
        await db.collection('cms_products').add(data);
      }
      sync.end();
      setEditing(null);
    } catch (err: any) {
      alert("Failed to save: " + err.message);
      sync.end();
    }
  };

  const deleteItem = async (id: string) => {
    if (window.confirm("Are you sure?")) await db.collection('cms_products').delete(id);
  };

  // Group products by category
  const groupedProducts: Record<string, any[]> = {};
  categories.forEach(c => groupedProducts[c.id] = []);
  groupedProducts['Uncategorized'] = [];

  products.forEach(p => {
    if (groupedProducts[p.categoryId]) {
      groupedProducts[p.categoryId].push(p);
    } else {
      groupedProducts['Uncategorized'].push(p);
    }
  });

  return (
    <div className="animate-in fade-in max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Product Inventory</h2>
        {!editing && (
          <button onClick={() => setEditing({})} className="bg-black text-white px-4 py-2 rounded-lg font-medium flex items-center shadow shadow-black/10 hover:bg-gray-800 transition">
            <Plus className="w-4 h-4 mr-2" /> Add New Product
          </button>
        )}
      </div>

      {editing ? (
        <form key={editing.id || 'new'} onSubmit={handleSave} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 space-y-4">
          <div className="flex justify-between items-center mb-4 pb-2 border-b">
            <h3 className="font-bold text-lg">{editing.id ? 'Edit Product' : 'New Product'}</h3>
            <button type="button" onClick={() => setEditing(null)} className="text-gray-500 hover:text-red-500"><X className="w-5 h-5"/></button>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name</label>
            <input name="name" type="text" defaultValue={editing.name} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
            <select name="categoryId" defaultValue={editing.categoryId} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none bg-white">
               <option value="" disabled>Select a Category...</option>
               {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
               ))}
            </select>
          </div>

          <div>
             <label className="block text-sm font-semibold text-gray-700 mb-1">Price</label>
             <input name="price" type="text" defaultValue={editing.price} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none" />
          </div>

          <div>
             <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
             <textarea name="desc" defaultValue={editing.desc} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"></textarea>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={sync.status === 'saving'} className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 flex justify-center items-center">
               {sync.status === 'saving' ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      ) : null}

      <div className="space-y-8">
         {categories.map(cat => {
            const catProducts = groupedProducts[cat.id];
            if (!catProducts || catProducts.length === 0) return null;
            return (
               <div key={cat.id} className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                  <h3 className="text-lg font-bold text-black border-b pb-2 mb-4 flex items-center">
                     {cat.title} <span className="ml-2 text-xs bg-gray-200 text-gray-700 py-0.5 px-2 rounded-full">{catProducts.length}</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {catProducts.map(p => (
                        <div key={p.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                           <h4 className="font-bold text-gray-900">{p.name}</h4>
                           {p.price && <span className="text-sm text-green-600 font-semibold mb-2">{p.price}</span>}
                           <p className="text-sm text-gray-500 line-clamp-2 mt-1 mb-4 flex-1">{p.desc}</p>
                           
                           <div className="flex gap-2 mt-auto pt-4 border-t border-gray-50">
                             <button onClick={() => setEditing(p)} className="flex-1 bg-white border border-gray-200 hover:border-black text-gray-700 hover:text-black hover:bg-gray-50 px-3 py-1.5 rounded-lg font-medium transition flex items-center justify-center text-sm shadow-sm"><Edit2 className="w-3 h-3 mr-2"/> Edit</button>
                             <button onClick={() => deleteItem(p.id)} className="flex-1 bg-white border border-red-100 hover:border-red-600 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg font-medium transition flex items-center justify-center text-sm shadow-sm"><Trash2 className="w-3 h-3 mr-2"/> Delete</button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )
         })}

         {groupedProducts['Uncategorized']?.length > 0 && (
            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
               <h3 className="text-lg font-bold text-black border-b pb-2 mb-4 flex items-center">
                  Uncategorized <span className="ml-2 text-xs bg-red-100 text-red-700 py-0.5 px-2 rounded-full">{groupedProducts['Uncategorized'].length}</span>
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedProducts['Uncategorized'].map(p => (
                     <div key={p.id} className="bg-white p-4 rounded-xl border border-red-200 shadow-sm flex flex-col">
                        <h4 className="font-bold text-gray-900">{p.name}</h4>
                        <div className="flex gap-2 mt-auto pt-4 border-t border-gray-50">
                          <button onClick={() => setEditing(p)} className="flex-1 bg-white border border-gray-200 hover:border-black text-gray-700 hover:text-black hover:bg-gray-50 px-3 py-1.5 rounded-lg font-medium transition flex items-center justify-center text-sm shadow-sm"><Edit2 className="w-3 h-3 mr-2"/> Edit</button>
                          <button onClick={() => deleteItem(p.id)} className="flex-1 bg-white border border-red-100 hover:border-red-600 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg font-medium transition flex items-center justify-center text-sm shadow-sm"><Trash2 className="w-3 h-3 mr-2"/> Delete</button>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         )}
         {products.length === 0 && <div className="py-12 bg-white rounded-xl border border-gray-200 text-center text-gray-400">No products found.</div>}
      </div>
    </div>
  );
};
