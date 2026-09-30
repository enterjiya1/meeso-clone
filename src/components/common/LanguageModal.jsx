import React from 'react';
import { X, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const LanguageModal = ({ isOpen, onClose, currentLang = 'en', onSelectLang }) => {
  if (!isOpen) return null;

  const { showToast } = useToast();

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' }
  ];

  const handleSelect = (lang) => {
    onSelectLang(lang.code);
    showToast(`Language set to ${lang.native} (${lang.name})`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xs w-full p-5 shadow-2xl relative space-y-3 animate-slide-up">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <h3 className="font-bold text-sm text-gray-900">Select Language / ભાષા</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="divide-y divide-gray-50 max-h-60 overflow-y-auto">
          {languages.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => handleSelect(l)}
              className="w-full py-2.5 px-2 flex items-center justify-between text-left hover:bg-fuchsia-50/50 rounded-lg transition-colors"
            >
              <div>
                <span className="font-bold text-xs text-gray-900 block">{l.native}</span>
                <span className="text-[10px] text-gray-400">{l.name}</span>
              </div>
              {currentLang === l.code && <Check className="w-4 h-4 text-[#931b6e]" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageModal;
