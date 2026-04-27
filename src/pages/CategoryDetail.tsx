import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ChevronRight, PhoneCall, ShieldCheck } from 'lucide-react';
import { useParams, useLocation } from 'react-router-dom';
import { defaultCategoriesData } from '../data';
import { db } from '../databaseAdapter';

export const CategoryDetailView = ({ selectedCategory, navigateTo, openQuoteModalFor }: any) => {
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [navbar, setNavbar] = useState<any>({});
  const { slug } = useParams();
  const location = useLocation();

  const [cat, setCat] = useState<any>(selectedCategory || location.state?.category);

  useEffect(() => {
    db.collection('cms_products').onSnapshot(setDbProducts);
    db.doc('cms_general', 'navbar').onSnapshot(setNavbar);
    
    if (!cat && slug) {
       // if directly visited, try to find category
       db.collection('cms_categories').get().then((data: any) => {
           const found = data.find((c: any) => c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug) || 
                         defaultCategoriesData.find((c: any) => c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug);
           if (found) setCat(found);
       });
    }

    if (!cat && slug && !dbProducts.length) {
       // fallback search in default
       const found = defaultCategoriesData.find((c: any) => c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug);
       if (found) setCat(found);
    }
  }, [slug, cat]);

  if (!cat) return <div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center">Loading Category...</div>;

  const itemImages = [
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    "https://images.unsplash.com/photo-1622675363311-3e1904dc1885?w=800&q=80",
    "https://images.unsplash.com/photo-1604164448130-d1df213c64eb?w=800&q=80",
    "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=800&q=80",
    "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&q=80",
    "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&q=80",
    "https://images.unsplash.com/photo-1510511459019-5efa7ae17e17?w=800&q=80"
  ];

  const categoryProducts = React.useMemo(() => {
     // Default products for this category
     const defaultProds = (cat.items || []).map((p: any, i: number) => ({
         ...p,
         id: `default_prod_${cat.id}_${i}`,
         categoryId: cat.id
     }));
     // User added/modified products for this category
     const dbProdsForCat = dbProducts.filter((p) => p.categoryId === cat.id);
     
     // Merge them
     return defaultProds.map((p: any) => ({...p, ...(dbProdsForCat.find(dp => dp.id === p.id) || {})}))
           .concat(dbProdsForCat.filter(dp => !defaultProds.some((p: any) => p.id === dp.id)));
  }, [dbProducts, cat]);

  return (
    <article className="min-h-screen bg-[#F4F6F8] font-body pb-24">
      <Helmet>
        <title>{cat.title} | Security & IT Products in Bangladesh</title>
        <meta name="description" content={`Explore our complete range of ${cat.title} in Bangladesh. ${cat.desc}`} />
        <meta name="keywords" content={`${cat.title} Bangladesh, IT solutions Dhaka, ABS Tech products`} />
        <meta property="og:title" content={`${cat.title} | ABS Tech Bangladesh`} />
        <meta property="og:description" content={cat.desc} />
        {cat.image && <meta property="og:image" content={cat.image} />}
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
          <button onClick={() => navigateTo('categories')} className="text-white/80 font-medium hover:text-[#F5B800] flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Products
          </button>
        </div>
      </nav>

      <header className="bg-[#0B3D91] py-24 px-6 text-center lg:text-left relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-[#00A8A8]/40 via-[#0B3D91]/70 to-[#0B3D91]/90 z-10"></div>
        <img src={cat.image} alt={cat.title} className="absolute inset-0 w-full h-full object-cover z-0" />
        <div className="container mx-auto px-6 lg:px-12 relative z-20 flex flex-col lg:flex-row items-center gap-10">
          <div className="bg-white/10 p-6 rounded-[2rem] border border-white/20 backdrop-blur-md text-[#F5B800] shadow-2xl">
            {/* The icon could be fetched again, assuming string mapping not available here directly, let's keep it simple or pass the element */}
            <ShieldCheck className="w-20 h-20" /> 
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[#F5B800] text-xs font-bold tracking-widest uppercase mb-4 border border-white/10 backdrop-blur-sm">
              Category Overview
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 leading-tight drop-shadow-lg">{cat.title}</h1>
            <p className="text-blue-50 text-lg md:text-xl max-w-2xl font-medium leading-relaxed drop-shadow-md">{cat.desc}</p>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-6 lg:px-12 pt-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-heading font-bold text-[#0B3D91] mb-2">Available Solutions</h2>
            <p className="text-gray-500 font-medium">Explore specific hardware and software components.</p>
          </div>
          <span className="bg-[#0B3D91]/10 text-[#0B3D91] px-4 py-2 rounded-full text-sm font-bold">{categoryProducts.length} Items Found</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoryProducts.map((item: any, idx: number) => (
            <div key={idx} onClick={() => openQuoteModalFor(cat.title, item.name)} className="bg-white rounded-[2rem] shadow-md border border-gray-100 hover:shadow-2xl hover:-translate-y-1 hover:border-[#0B3D91]/20 transition-all flex flex-col group h-full relative overflow-hidden cursor-pointer">
              <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                <img src={item.image || itemImages[(idx + item.name.length) % itemImages.length]} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D91]/90 via-[#0B3D91]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-6 left-6 right-6 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10 flex justify-center">
                  <span className="bg-[#F5B800] text-[#1F2933] px-6 py-2.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                    Get Pricing <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow bg-white relative z-10">
                <h3 className="text-2xl font-heading font-bold text-[#0B3D91] mb-3 leading-tight group-hover:text-[#00A8A8] transition-colors">{item.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-grow font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 bg-[#0B3D91] rounded-[3rem] p-12 lg:p-16 border border-white/10 shadow-2xl text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#00A8A8]/20 via-transparent to-transparent"></div>
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">Need a complete system implementation?</h3>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto font-medium leading-relaxed">We don't just supply hardware; we provide full-scale engineering, installation, and post-sales technical support for {cat.title}.</p>
            <button onClick={() => openQuoteModalFor(cat.title)} className="bg-[#F5B800] text-[#1F2933] px-10 py-5 rounded-full font-bold text-lg hover:bg-white hover:text-[#0B3D91] hover:-translate-y-1 transition-all shadow-xl shadow-black/20 inline-flex items-center gap-3">
              Consult with an Expert <PhoneCall className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>
    </article>
  );
};
