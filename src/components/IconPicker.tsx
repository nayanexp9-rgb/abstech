import React, { useState } from 'react';
import { iconsMap } from '../Icons';
import { Search } from 'lucide-react';

export const IconPicker = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Filter keys based on search
  const iconNames = Object.keys(iconsMap).filter(name => 
    name.toLowerCase().includes(search.toLowerCase())
  );

  const CurrentIcon = iconsMap[value] || iconsMap['ShieldCheck'];

  return (
    <div className="relative z-10 w-full font-body">
      {/* Selected Value Bar */}
      <div 
        className="flex items-center px-4 py-2 border rounded-lg bg-white cursor-pointer hover:border-black transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
         <CurrentIcon className="w-5 h-5 mr-3 text-gray-700" />
         <span className="flex-1 font-medium text-gray-800">{value || 'Select an Icon...'}</span>
      </div>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute top-12 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-2xl p-2 max-h-64 overflow-y-auto z-50">
           {/* Search Input */}
           <div className="flex items-center px-3 py-2 bg-gray-50 rounded-lg mb-2 sticky top-0 z-10 border border-gray-100">
             <Search className="w-4 h-4 text-gray-400 mr-2" />
             <input 
               type="text" 
               placeholder="Search icons (e.g., Camera, Server)..." 
               className="bg-transparent border-none outline-none w-full text-sm font-medium"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
           </div>

           {/* Icon Grid */}
           <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
             {iconNames.map(name => {
               const MIcon = iconsMap[name];
               return (
                 <div 
                   key={name}
                   onClick={() => {
                     onChange(name);
                     setIsOpen(false);
                     setSearch('');
                   }}
                   className={`flex flex-col items-center justify-center p-2 rounded-lg cursor-pointer transition-colors ${value === name ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-600'}`}
                   title={name}
                 >
                    <MIcon className="w-6 h-6 mb-1" />
                    <span className="text-[10px] truncate max-w-full text-center">{name}</span>
                 </div>
               )
             })}
           </div>
           {iconNames.length === 0 && <div className="text-center py-6 text-sm font-medium text-gray-400">No icons found.</div>}
        </div>
      )}
    </div>
  );
};
