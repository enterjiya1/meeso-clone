import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { PRODUCTS } from '../../data/products';

export const SearchBar = ({ isMobile = false, onCloseMobile = null }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);

  // Popular search tags
  const popularSearches = ['Yellow Kurti', 'Rayon Slub', 'Anarkali Set', 'Banarasi Saree', 'Sharara', 'Chikankari'];

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const q = query.toLowerCase().trim();
    const matches = PRODUCTS.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.color.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(q))) ||
        (p.highlights && Object.values(p.highlights).some((v) => String(v).toLowerCase().includes(q)))
      );
    }).slice(0, 5);

    setSuggestions(matches);
  }, [query]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsOpen(false);
    if (onCloseMobile) onCloseMobile();
    navigate(`/products?search=${encodeURIComponent(query.trim())}`);
  };

  const handleSelectProduct = (productId) => {
    setIsOpen(false);
    if (onCloseMobile) onCloseMobile();
    navigate(`/product/${productId}`);
  };

  const handleQuickTagClick = (tag) => {
    setQuery(tag);
    setIsOpen(false);
    if (onCloseMobile) onCloseMobile();
    navigate(`/products?search=${encodeURIComponent(tag)}`);
  };

  return (
    <div ref={searchContainerRef} className="relative w-full">
      <form onSubmit={handleSearchSubmit} className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search by kurti, saree, yellow, rayon, fabric..."
          className="w-full pl-10 pr-10 py-2 md:py-2.5 text-sm bg-gray-50 md:bg-gray-100 hover:bg-gray-50 focus:bg-white text-gray-900 border border-gray-200 focus:border-brand-500 rounded-full outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-brand-100"
          aria-label="Search products"
        />
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
            }}
            className="p-1 text-gray-400 hover:text-gray-600 absolute right-3 top-1/2 -translate-y-1/2"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </form>

      {/* Live Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 overflow-hidden animate-fade-in">
          {suggestions.length > 0 ? (
            <div>
              <div className="px-4 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Matching Products
              </div>
              <div className="divide-y divide-gray-50 mt-1">
                {suggestions.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSelectProduct(product.id)}
                    className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 text-left transition-colors group"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-10 h-12 object-cover rounded-md shrink-0 border border-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate group-hover:text-brand-700">
                        {product.name}
                      </p>
                      <p className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
                        <span className="font-medium text-gray-900">₹{product.price}</span>
                        <span>•</span>
                        <span>{product.fabric}</span>
                        <span>•</span>
                        <span className="capitalize">{product.color}</span>
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-600 shrink-0" />
                  </button>
                ))}
              </div>

              <div className="p-2.5 bg-gray-50 border-t border-gray-100 mt-2 text-center">
                <button
                  onClick={handleSearchSubmit}
                  className="text-xs font-semibold text-brand-700 hover:text-brand-900 inline-flex items-center gap-1"
                >
                  View all results for "{query}" <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : query.trim() ? (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              <p className="font-medium text-gray-700">No matching products found</p>
              <p className="text-xs text-gray-400 mt-1">Try searching by color, fabric or category</p>
            </div>
          ) : (
            <div className="px-4 py-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Popular Searches
              </div>
              <div className="flex flex-wrap gap-1.5">
                {popularSearches.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleQuickTagClick(tag)}
                    className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-brand-50 hover:text-brand-700 rounded-full text-gray-700 font-medium transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
