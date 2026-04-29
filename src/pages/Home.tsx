import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  CheckCircle2, ChevronRight, MessageCircle, Phone, PhoneCall, MapPin 
} from 'lucide-react';
import { getCmsHero, getCmsCategories, subscribeToStore } from '../store';
import { 
  businessServices, workSteps, infraList, commitmentList, teamDepts, clients, defaultCategoriesData 
} from '../data';
import { Icon } from '../Icons';
import { db } from '../databaseAdapter';

export const HomeView = ({ navigateTo, openQuoteModalFor }: any) => {
  const [dbHero, setDbHero] = useState<any>({});
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [dbServices, setDbServices] = useState<any[]>([]);
  const [dbClients, setDbClients] = useState<any[]>([]);

  useEffect(() => {
    db.doc('cms_general', 'hero').onSnapshot(setDbHero);
    db.collection('cms_categories').onSnapshot(setDbCategories);
    db.collection('cms_services').onSnapshot(setDbServices);
    db.collection('cms_clients').onSnapshot(setDbClients);
  }, []);

  const categoriesData = React.useMemo(() => {
    return defaultCategoriesData.map(cat => ({...cat, ...(dbCategories.find(c => c.id === cat.id)||{})}))
          .concat(dbCategories.filter(d => !defaultCategoriesData.some(c => c.id === d.id)));
  }, [dbCategories]);

  const servicesList = React.useMemo(() => {
    const defServices = businessServices.map((s,i) => ({...s, id: `default_svc_${i}`}));
    return defServices.map(s => ({...s, ...(dbServices.find(si => si.id === s.id)||{})}))
                     .concat(dbServices.filter(d => !defServices.some(s => s.id === d.id)));
  }, [dbServices]);

  const clientsList = React.useMemo(() => {
    const defClients = clients.map((c,i) => ({...c, id: `default_client_${i}`}));
    return defClients.map(c => ({...c, ...(dbClients.find(d => d.id === c.id)||{})}))
                    .concat(dbClients.filter(d => !defClients.some(c => c.id === d.id)));
  }, [dbClients]);

  const heroData = {
    title: dbHero?.title || "Secure Your \nInfrastructure.",
    subtitle: dbHero?.subtitle || "High-standard tech maintenance, security systems, and infrastructure management across Bangladesh. Peace of mind, engineered.",
    bgImage: dbHero?.bgImage || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=2000&q=80"
  };

  return (
    <main>
      <Helmet>
        <title>ABS Tech | IT Infrastructure & Security Services in Bangladesh</title>
        <meta name="description" content="Leading provider of high-standard tech maintenance, security systems, networking, and IT infrastructure management across Dhaka, Chittagong, Khulna, and all over Bangladesh." />
        <meta name="keywords" content="IT infrastructure Bangladesh, security systems Dhaka, access control Bangladesh, tech maintenance, ABS Tech" />
        <meta property="og:title" content="ABS Tech | IT Infrastructure & Security Services in Bangladesh" />
        <meta property="og:description" content="Leading provider of high-standard tech maintenance, security systems, and IT infrastructure management across Bangladesh." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={window.location.origin} />
      </Helmet>

      {/* DYNAMIC HERO SECTION */}
      <section className="relative min-h-[100dvh] flex items-center py-28 md:py-32 overflow-hidden bg-[#0B3D91]">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{backgroundImage: `url('${heroData.bgImage}')`}}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D91] via-[#0B3D91]/80 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#00A8A8]/20 via-transparent to-transparent"></div>
        <div className="container mx-auto px-6 lg:px-12 relative z-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00A8A8]/20 border border-[#00A8A8]/50 text-[#F5B800] text-sm font-semibold mb-8 backdrop-blur-sm">
              <CheckCircle2 className="w-4 h-4 text-[#F5B800]" /> TRAD/DSCC/023844/2023 Certified
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-white mb-8 leading-[1.05] tracking-tight whitespace-pre-line">
              {heroData.title.split('Infrastructure.').map((part: string, i: number, arr: any[]) => (
                <React.Fragment key={i}>
                  {part}
                  {i < arr.length - 1 && <span className="text-[#F5B800]">Infrastructure.</span>}
                </React.Fragment>
              ))}
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl leading-relaxed font-medium">
              {heroData.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => openQuoteModalFor('')} className="bg-[#F5B800] text-[#1F2933] px-8 py-4 rounded-full font-bold hover:bg-white hover:text-[#0B3D91] transition-all shadow-lg shadow-black/20 text-center">
                Contact Sales
              </button>
              <button onClick={() => navigateTo('categories')} className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full font-bold backdrop-blur-sm transition-all text-center">
                View Product Catalog
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ADVANCED COMPANY STATS SECTION */}
      <section className="relative z-30 -mt-16 container mx-auto px-6 lg:px-12">
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row justify-between gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {[
            { label: "Total Employees", value: "23" },
            { label: "Offices", value: "3" },
            { label: "Support", value: "24/7" },
            { label: "Coverage", value: "All BD" }
          ].map((stat, i) => (
            <div key={i} className="flex-1 text-center pt-8 md:pt-0">
              <div className="text-4xl md:text-5xl font-heading font-bold text-[#0B3D91] mb-2">{stat.value}</div>
              <div className="text-gray-400 text-sm font-semibold uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* OUR SERVICES */}
      <section className="py-24 bg-[#F4F6F8]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-heading font-bold text-[#0B3D91] mb-4">Our Services</h2>
            <p className="text-slate-500 text-lg">Delivering specialized engineering, integration, and technical maintenance services tailored to your organizational needs.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessServices.map((service, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 hover:border-[#0B3D91]/20 transition-all flex flex-col group cursor-pointer" onClick={() => navigateTo('categories')}>
                <div className="bg-blue-50 text-[#0B3D91] w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#F5B800] group-hover:text-[#1F2933] transition-colors">
                  <Icon name={service.iconName} className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-heading font-bold text-[#1F2933] mb-3 leading-tight group-hover:text-[#0B3D91] transition-colors">{service.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">{service.desc}</p>
                <div className="text-xs font-bold uppercase tracking-wider text-[#00A8A8] group-hover:text-[#0B3D91] transition-colors flex items-center gap-2 mt-auto">
                  View Details <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DYNAMIC CORE CAPABILITIES */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-heading font-bold text-[#0B3D91] mb-4">Core Capabilities</h2>
              <p className="text-slate-500 text-lg">We cover everything from physical access points to the network infrastructure running them.</p>
            </div>
            <button onClick={() => navigateTo('categories')} className="text-[#0B3D91] font-bold flex items-center gap-2 hover:translate-x-2 transition-colors group">
              Explore All {categoriesData.length} Categories <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categoriesData.slice(0, 3).map((s: any) => (
              <div key={s.id} onClick={() => navigateTo('categoryDetail', s)} className="bg-white rounded-[2rem] shadow-md border border-slate-200 hover:shadow-2xl hover:-translate-y-1 hover:border-[#0B3D91]/30 transition-all group flex flex-col cursor-pointer overflow-hidden relative">
                <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md p-3 rounded-xl text-[#0B3D91] shadow-lg">
                    <Icon name={s.iconName} className="w-6 h-6" />
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow bg-white">
                  <h3 className="text-2xl font-heading font-bold text-[#1F2933] mb-4 group-hover:text-[#0B3D91] transition-colors">{s.title}</h3>
                  <p className="text-slate-500 leading-relaxed mb-8 flex-grow">{s.desc}</p>
                  <div className="text-sm font-bold uppercase tracking-wider text-[#00A8A8] group-hover:text-[#0B3D91] transition-colors flex items-center gap-2 mt-auto">
                    View {s.items?.length || 0} Products <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="py-24 bg-[#0B3D91] relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent"></div>
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl font-heading font-bold mb-4">How We Work</h2>
            <p className="text-blue-200 text-lg">A systematic approach to guarantee flawless implementation and continuous protection.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-white/20 z-0"></div>
            
            {workSteps.map((step, i) => (
              <div key={i} className="flex flex-col text-center relative z-10 group">
                <div className="w-16 h-16 mx-auto bg-[#F5B800] text-[#0B3D91] rounded-full flex items-center justify-center mb-6 shadow-xl shadow-[#F5B800]/20 group-hover:scale-110 transition-transform">
                  <Icon name={step.iconName} className="w-8 h-8" />
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex-grow backdrop-blur-sm group-hover:bg-white/10 transition-colors">
                  <span className="text-[#F5B800] text-xs font-bold uppercase tracking-widest mb-2 block">Step 0{i+1}</span>
                  <h4 className="font-heading font-bold text-lg mb-3">{step.title}</h4>
                  <p className="text-sm text-blue-100 font-medium leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INFRASTRUCTURE & COMMITMENT */}
      <section className="py-24 bg-[#F4F6F8]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B3D91]/10 text-[#0B3D91] text-xs font-bold tracking-widest uppercase mb-6">
                Our Infrastructure
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#1F2933] mb-6">Built for Scale & Reliability</h2>
              <p className="text-slate-500 mb-10 text-lg">Our physical and technical framework is designed to provide uninterrupted support and comprehensive management nationwide.</p>
              
              <ul className="space-y-5">
                {infraList.map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-[#00A8A8] flex-shrink-0" />
                    <span className="font-bold text-[#1F2933]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-xl border border-gray-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5B800]/10 rounded-bl-[100px] -z-0"></div>
               <div className="relative z-10">
                <h2 className="text-3xl font-heading font-bold text-[#0B3D91] mb-2">Our Commitment</h2>
                <p className="text-slate-500 mb-10">We prioritize your operational security above all.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {commitmentList.map((c, i) => (
                    <div key={i} className="bg-[#F4F6F8] p-6 rounded-2xl group hover:bg-[#0B3D91] transition-colors">
                      <div className="text-[#0B3D91] mb-4 group-hover:text-[#F5B800] transition-colors">
                        <Icon name={c.iconName} className="w-8 h-8" />
                      </div>
                      <h4 className="font-bold text-[#1F2933] group-hover:text-white transition-colors">{c.title}</h4>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TEAM STRUCTURE */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-heading font-bold text-[#0B3D91] mb-4">Our Team Structure</h2>
            <p className="text-slate-500 text-lg">Our highly structured departments ensure every project phase is handled by specialized professionals.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {teamDepts.map((dept, i) => (
              <div key={i} className="flex items-center gap-4 bg-[#F4F6F8] p-5 rounded-2xl border border-transparent hover:border-[#0B3D91]/20 hover:shadow-md transition-all">
                <div className="bg-white text-[#0B3D91] w-12 h-12 rounded-xl flex items-center justify-center shadow-sm">
                  <Icon name={dept.iconName} className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-[#1F2933]">{dept.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENT PORTFOLIO */}
      <section className="py-32 bg-[#0B3D91] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=2000&q=20')] opacity-5 bg-cover bg-center"></div>
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold mb-4">Trusted Across Industries</h2>
            <p className="text-blue-200 text-lg">Deploying robust solutions for our valued partners.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {clientsList.map((c, i) => (
              <div key={c.id || i} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors backdrop-blur-sm">
                <div className="mb-5 w-14 h-14 rounded-xl overflow-hidden bg-white/10 border border-white/20">
                  <img src={c.logo} alt={`${c.name} logo`} className="w-full h-full object-cover bg-white" />
                </div>
                <h4 className="font-bold text-lg mb-1">{c.name}</h4>
                <p className="text-blue-100 text-sm font-medium">{c.works}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COVERAGE & 24/7 BANNER */}
      <section className="bg-[#1F2933] relative overflow-hidden border-b border-gray-800">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[#F5B800]/5 -skew-x-12 hidden lg:block"></div>
        <div className="container mx-auto px-6 lg:px-12 py-16 lg:py-20 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 text-[#00A8A8] font-bold uppercase tracking-widest text-sm mb-4">
                <MapPin className="w-5 h-5" /> Our Coverage
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">Serving All Over Bangladesh</h2>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <span className="bg-white/10 text-white px-5 py-2.5 rounded-full font-bold text-sm border border-white/5">Dhaka (Head Office)</span>
                <span className="bg-white/10 text-white px-5 py-2.5 rounded-full font-bold text-sm border border-white/5">Khulna Hub</span>
                <span className="bg-white/10 text-white px-5 py-2.5 rounded-full font-bold text-sm border border-white/5">Chattogram Hub</span>
              </div>
            </div>

            <div className="flex-1 bg-[#F5B800] rounded-[2rem] p-10 text-center shadow-2xl w-full">
              <h3 className="text-2xl font-heading font-bold text-[#1F2933] mb-2">24/7 Technical Support</h3>
              <p className="text-[#0B3D91] font-bold mb-8">We are always ready to assist you.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href="tel:+8801718604464" className="bg-[#0B3D91] text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#1F2933] transition-colors shadow-lg">
                  <Phone className="w-5 h-5" /> Call Now
                </a>
                <a href="https://wa.me/8801718604464" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#1DA851] transition-colors shadow-lg">
                  <MessageCircle className="w-5 h-5" /> WhatsApp
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
};
