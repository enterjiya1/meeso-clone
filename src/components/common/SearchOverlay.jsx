import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { PRODUCTS } from '../../data/products';

export const SearchOverlay = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const quickTags = ['Yellow Kurti', 'Rayon Slub', 'Maroon Anarkali', 'Pink Bandhani', 'Chikankari', 'Cotton'];

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase().trim();
    const matched = PRODUCTS.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        (p.highlights && Object.values(p.highlights).some((v) => String(v).toLowerCase().includes(q)))
      );
    });
    setResults(matched);
  }, [query]);

  const handleSelect = (productId) => {
    onClose();
    navigate(`/product/${productId}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-start items-center p-2 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-gray-100 flex items-center gap-2.5">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search kurtis by color, fabric, style..."
            className="w-full text-xs sm:text-sm font-medium outline-none text-gray-900 placeholder:text-gray-400"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-bold text-gray-500 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>

        {/* Results / Quick Tags */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {results.length > 0 ? (
            <div className="divide-y divide-gray-50">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Matching Kurtis ({results.length})
              </span>
              {results.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelect(p.id)}
                  className="w-full py-2.5 px-2 flex items-center gap-3 hover:bg-gray-50 rounded-xl text-left transition-colors group"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-11 h-13 object-cover rounded-lg border shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate group-hover:text-[#931b6e]">
                      {p.name}
                    </p>
                    <p className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
                      <strong className="text-gray-950">₹{p.price}</strong>
                      <span>•</span>
                      <span className="text-emerald-700 font-semibold">{p.discount}% off</span>
                      <span>•</span>
                      <span>{p.category}</span>
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#931b6e] shrink-0" />
                </button>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="py-8 text-center text-xs text-gray-500 space-y-1">
              <p className="font-semibold text-gray-800">No kurtis found for "{query}"</p>
              <p className="text-gray-400">Try searching for yellow, rayon, anarkali, or cotton.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-[11px] font-bold text-gray-500">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Popular Searches</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {quickTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-fuchsia-50 hover:text-[#931b6e] text-xs text-gray-700 font-medium transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
