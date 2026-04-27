import { getStore, setStore, subscribeToStore } from './store';
import { defaultCategoriesData, businessServices, clients } from './data';
import { supabase } from './supabaseClient';


const SEED_KEY = 'cms_seeded_v1';
if (!getStore(SEED_KEY, false)) {
  setStore('cms_general_hero', {
    title: "Secure Your \\nInfrastructure.",
    subtitle: "High-standard tech maintenance, security systems, and infrastructure management across Bangladesh. Peace of mind, engineered.",
    bgImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=2000&q=80",
    btnText: "Contact Sales",
    btnLink: "/#services"
  });
  
  setStore('cms_general_navbar', {
    siteName: "ABS Tech.",
    logoImage: ""
  });
  
  setStore('cms_general_contact', {
    phone: "+880 1718604464",
    email: "absultrabd@gmail.com",
    address: "Corporate: Banasree, Dhaka 1219\nHubs: Dhaka, Khulna, Chattogram",
    footerText: "Technology Dependent Bangladesh is our vision. Excellence in maintenance and deployment."
  });

  setStore('cms_services', businessServices.map((s, i) => ({ ...s, id: 'service_'+i })));

  const cats: any[] = [];
  const prods: any[] = [];
  defaultCategoriesData.forEach((cat: any) => {
     const { items, ...catDetails } = cat;
     cats.push({ ...catDetails, id: cat.id });
     if (items) {
        items.forEach((item: any, i: number) => {
           prods.push({ ...item, categoryId: cat.id, id: `${cat.id}_prod_${i}` });
        });
     }
  });
  setStore('cms_categories', cats);
  setStore('cms_products', prods);
  setStore('cms_clients', clients.map((c, i) => ({ ...c, id: 'client_'+i })));
  
  setStore(SEED_KEY, true);
}

// A generic localized mock of Firestore and Storage that satisfies typical NoSQL API patterns
// without requiring actual Firebase auth or a live backend, saving locally to bypass preview limits.

export const db = {
  collection: (name: string) => ({
    onSnapshot: (callback: (data: any[]) => void) => {
      if (supabase) {
        supabase.from(name).select('*').order('id', { ascending: false }).then(({ data, error }) => {
           if (error) console.error("Supabase Error on select:", name, error);
           if (data) callback(data);
        });
        const channelId = `public:${name}:${Math.random().toString(36).substr(2, 9)}`;
        const channel = supabase.channel(channelId)
          .on('postgres_changes', { event: '*', schema: 'public', table: name }, () => {
             supabase.from(name).select('*').order('id', { ascending: false }).then(({ data, error }) => {
                if (error) console.error("Supabase Error on select (realtime):", name, error);
                if (data) callback(data);
             });
          })
          .subscribe();
        return () => supabase.removeChannel(channel);
      }

      callback(getStore(name, []));
      return subscribeToStore(name, () => callback(getStore(name, [])));
    },
    get: async () => {
      if (supabase) {
        const { data } = await supabase.from(name).select('*').order('id', { ascending: false });
        return data || [];
      }
      return getStore(name, []);
    },
    add: async (data: any) => {
      if (supabase) {
        const newItem = { id: Date.now().toString(), ...data };
        const { error } = await supabase.from(name).insert(newItem);
        if (error) {
           console.error(`Supabase Insert Error in ${name}:`, error);
           throw new Error(error.message);
        }
        return newItem;
      }

      const items = getStore(name, []);
      const newItem = { id: Date.now().toString(), createdAt: new Date().toISOString(), ...data };
      setStore(name, [newItem, ...items]);
      return newItem;
    },
    update: async (id: string, data: any) => {
      if (supabase) {
        await supabase.from(name).update(data).eq('id', id);
        return;
      }

      const items = getStore(name, []);
      setStore(name, items.map((i: any) => i.id === id ? { ...i, ...data } : i));
    },
    delete: async (id: string) => {
      if (supabase) {
        await supabase.from(name).delete().eq('id', id);
        return;
      }

      const items = getStore(name, []);
      setStore(name, items.filter((i: any) => i.id !== id));
    }
  }),
  doc: (collectionName: string, docId: string) => ({
    onSnapshot: (callback: (data: any) => void) => {
      if (supabase) {
        supabase.from(collectionName).select('*').eq('id', docId).maybeSingle().then(({ data }) => {
           if (data && data.data) callback(data.data);
           else if (data) callback(data); // failover if using table schema directly without 'data' jsonb
        });
        const channelId = `public:${collectionName}:${docId}:${Math.random().toString(36).substr(2, 9)}`;
        const channel = supabase.channel(channelId)
          .on('postgres_changes', { event: '*', schema: 'public', table: collectionName, filter: `id=eq.${docId}` }, (payload) => {
             const newData = payload.new as any;
             if (newData && newData.data) callback(newData.data);
             else if (newData) callback(newData);
          })
          .subscribe();
        return () => supabase.removeChannel(channel);
      }

      const key = `${collectionName}_${docId}`;
      callback(getStore(key, {}));
      return subscribeToStore(key, () => callback(getStore(key, {})));
    },
    get: async () => {
      if (supabase) {
        const { data } = await supabase.from(collectionName).select('*').eq('id', docId).maybeSingle();
        if (data && data.data) return data.data;
        return data || {};
      }

      return getStore(`${collectionName}_${docId}`, {});
    },
    set: async (data: any) => {
      if (supabase) {
        // Find existing to merge (mimicking firestore set with merge / deep update)
        const { data: existingData } = await supabase.from(collectionName).select('*').eq('id', docId).maybeSingle();
        
        let targetData = data;
        let finalRow: any = { id: docId };

        if (existingData && existingData.data !== undefined) {
          targetData = { ...existingData.data, ...data };
          finalRow.data = targetData;
        } else if (existingData) {
          finalRow = { ...existingData, ...data, id: docId };
        } else {
          // New row. Assume it needs a 'data' column if it's cms_general.
          // Otherwise, we just insert the data fields directly if it matches the table schema.
          if (collectionName === 'cms_general') {
            finalRow.data = targetData;
          } else {
            finalRow = { ...data, id: docId };
          }
        }

        const { error: upsertError } = await supabase.from(collectionName).upsert(finalRow);
        if (upsertError) {
           console.error("Supabase upsert error:", upsertError);
           throw upsertError;
        }
        return;
      }

      const key = `${collectionName}_${docId}`;
      const existing = getStore(key, {});
      setStore(key, { ...existing, ...data });
    }
  })
};

export const storage = {
  uploadFile: (file: File): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      // First try to look up real cloudinary settings
      let settings = await db.doc('cms_general', 'cloudinary').get();
      if (!settings || !settings.cloudName) {
         settings = getStore('cms_general_cloudinary', null);
      }
      if (settings && settings.cloudName && settings.uploadPreset) {
         try {
           const formData = new FormData();
           formData.append("file", file);
           formData.append("upload_preset", settings.uploadPreset);

           const response = await fetch(`https://api.cloudinary.com/v1_1/${settings.cloudName}/image/upload`, {
             method: 'POST',
             body: formData
           });
           
           if (!response.ok) throw new Error("Cloudinary upload failed");
           
           const data = await response.json();
           const url = data.secure_url;

           const media = getStore('media_files', []);
           setStore('media_files', [{ id: Date.now().toString(), url: url, name: file.name, date: new Date().toISOString() }, ...media]);
           resolve(url);
           return;
         } catch (e) {
           console.error("Cloudinary failed, falling back to local base64.", e);
         }
      }

      // Fallback base64 local storage trick
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const media = getStore('media_files', []);
        setStore('media_files', [{ id: Date.now().toString(), url: base64, name: file.name, date: new Date().toISOString() }, ...media]);
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },
  getMedia: () => getStore('media_files', []),
  onMediaSnapshot: (cb: (data: any[]) => void) => {
    cb(getStore('media_files', []));
    return subscribeToStore('media_files', () => cb(getStore('media_files', [])));
  }
};
