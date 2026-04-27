// Mock store using localStorage to persist data across reloads

const STORAGE_PREFIX = 'abs_tech_';

export const getStore = (key: string, defaultValue: any) => {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setStore = (key: string, value: any) => {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    listeners.get(key)?.forEach(l => l());
  } catch (error) {
    console.error('Error saving to localStorage', error);
  }
};

export const addQuote = (quote: any) => {
  const quotes = getStore('quotes', []);
  const newQuote = { ...quote, id: Date.now().toString(), createdAt: new Date().toISOString() };
  setStore('quotes', [newQuote, ...quotes]);
  return newQuote;
};

export const getQuotes = () => getStore('quotes', []);

export const getCmsCategories = () => getStore('cms_categories', {});
export const saveCmsCategory = (id: string, data: any) => {
  const cats = getCmsCategories();
  cats[id] = { ...cats[id], ...data };
  setStore('cms_categories', cats);
};

export const getCmsHero = () => getStore('cms_hero', {});
export const saveCmsHero = (data: any) => {
  setStore('cms_hero', data);
};

// Event emitter to simulate real-time updates for hooks
type Listener = () => void;
const listeners = new Map<string, Set<Listener>>();

export const subscribeToStore = (key: string, listener: Listener) => {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key)!.add(listener);
  return () => listeners.get(key)!.delete(listener);
};

export const notifyStoreInit = () => {
    // Override setStore to also notify listeners
    const originalSet = setStore;
    (window as any).__setStore = (key: string, value: any) => {
        originalSet(key, value);
        listeners.get(key)?.forEach(l => l());
    }
}
