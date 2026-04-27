import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ChevronRight, Layers, ShieldCheck } from 'lucide-react';
import { defaultCategoriesData } from '../data';
import { Icon } from '../Icons';
import { db } from '../databaseAdapter';

export const CategoriesIndexView = ({ navigateTo }: any) => {
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [navbar, setNavbar] = useState<any>({});

  useEffect(() => {
    db.collection('cms_categories').onSnapshot(setDbCategories);
    db.collection('cms_products').onSnapshot(setDbProducts);
    db.doc('cms_general', 'navbar').onSnapshot(setNavbar);
  }, []);

  const categoriesData = React.useMemo(() => {
    return defaultCategoriesData.map(cat => ({...cat, ...(dbCategories.find(c => c.id === cat.id)||{})}))
          .concat(dbCategories.filter(d => !defaultCategoriesData.some(c => c.id === d.id)));
  }, [dbCategories]);

  const getProductCount = (catId: string, items?: any[]) => {
     const dbProds = dbProducts.filter(p => p.categoryId === catId);
     const defaultCount = items ? items.length : 0;
     
     // Find how many of the dbProds are NOT overriding default ones (i.e. truly new)
     const newProdsCount = dbProds.filter(p => !p.id?.startsWith('default_prod_')).length;
     
     return defaultCount + newProdsCount;
  };

  return (
    <main className="min-h-screen bg-[#F4F6F8] font-body pb-24">
      <Helmet>
        <title>All Products & Solutions | ABS Tech Bangladesh</title>
        <meta name="description" content="Explore ABS Tech's complete IT product and security solution catalog. From CCTV and PABX to advanced networking and access control." />
      </Helmet>
      
      <nav className="bg-[#0B3D91] backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-white/10 py-4">
        <div className="container mx-auto px-6 flex justify-between items-center">
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
          <button onClick={() => navigateTo('home')} className="text-white/80 font-medium hover:text-[#F5B800] flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back Home
          </button>
        </div>
      </nav>

      <header className="bg-[#0B3D91] py-24 text-center px-6 relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-[#0B3D91] to-[#0B3D91]"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F5B800]/10 border border-[#F5B800]/20 text-[#F5B800] text-sm font-semibold mb-6 uppercase tracking-widest">
            <Layers className="w-4 h-4" /> {categoriesData.length} Total Categories
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6 leading-tight">Our Complete Product Range</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">From essential surveillance to advanced enterprise networking, discover the robust solutions we deploy nationwide.</p>
        </div>
      </header>

      <section className="container mx-auto px-6 lg:px-12 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoriesData.map((cat: any) => (
            <div key={cat.id} onClick={() => navigateTo('categoryDetail', cat)} className="bg-white rounded-[2rem] shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-1 hover:border-[#0B3D91]/20 transition-all flex flex-col group h-full cursor-pointer overflow-hidden relative">
              <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                <img src={cat.image} alt={cat.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md p-2.5 rounded-xl text-[#0B3D91] shadow-lg">
                  <Icon name={cat.iconName} className="w-6 h-6" />
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow bg-white">
                <h3 className="text-xl font-heading font-bold text-[#1F2933] mb-3 leading-tight group-hover:text-[#0B3D91] transition-colors">{cat.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">{cat.desc}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                  <span className="text-xs font-bold text-[#00A8A8] uppercase tracking-wider">{getProductCount(cat.id, cat.items)} Products</span>
                  <div className="w-8 h-8 rounded-full bg-[#F4F6F8] flex items-center justify-center text-[#1F2933] group-hover:bg-[#F5B800] transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};
