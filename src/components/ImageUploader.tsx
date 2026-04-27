import React, { useState } from 'react';
import { UploadCloud, X } from 'lucide-react';
import { storage } from '../databaseAdapter';

export const ImageUploader = ({ name, defaultValue, onChange, placeholder }: any) => {
  const [url, setUrl] = useState(defaultValue || '');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploadedUrl = await storage.uploadFile(file);
      setUrl(uploadedUrl);
      if (onChange) onChange(uploadedUrl);
    } catch (err) {
      alert("Upload failed. Make sure you have set Cloudinary settings.");
    }
    setUploading(false);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-2 bg-gray-50/50">
      <input type="hidden" name={name} value={url} id={`img-uploader-${name}`} />
      
      {url ? (
        <div className="relative rounded-md overflow-hidden bg-white border border-gray-100 flex items-center justify-between p-2">
          <div className="flex items-center space-x-3 truncate">
            <img src={url} alt="Uploaded" className="w-10 h-10 object-cover rounded shadow-sm" />
            <span className="text-xs text-gray-500 truncate" title={url}>{url}</span>
          </div>
          <button type="button" onClick={() => {
             setUrl(''); 
             if(onChange) onChange('');
          }} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
             <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-md bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer group">
           <UploadCloud className="w-6 h-6 text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" />
           <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors text-center">
              {uploading ? 'Uploading to Cloudinary...' : (placeholder || 'Click to select and upload')}
           </span>
           <span className="text-xs text-gray-400 mt-1">Direct to Cloudinary</span>
           <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
        </label>
      )}
    </div>
  );
};
