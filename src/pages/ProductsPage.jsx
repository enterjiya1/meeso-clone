import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, RotateCcw, Search, Sparkles } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import ProductGrid from '../components/product/ProductGrid';
import FilterSidebar from '../components/filters/FilterSidebar';
import FilterDrawer from '../components/filters/FilterDrawer';
import SortDropdown from '../components/filters/SortDropdown';

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const querySearch = searchParams.get('search') || '';
  const queryCategory = searchParams.get('category') || 'All';

  // Local filter states
  const [selectedCategory, setSelectedCategory] = useState(queryCategory);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedFabrics, setSelectedFabrics] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('popular');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Sync URL category param if changes
  useEffect(() => {
    if (queryCategory) {
      setSelectedCategory(queryCategory);
    }
  }, [queryCategory]);

  const handleToggleColor = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleToggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleToggleFabric = (fabric) => {
    setSelectedFabrics((prev) =>
      prev.includes(fabric) ? prev.filter((f) => f !== fabric) : [...prev, fabric]
    );
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedPriceRange(null);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedFabrics([]);
    setMinRating(0);
    // Also clear query params if present
    setSearchParams({});
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'All') count++;
    if (selectedPriceRange) count++;
    if (selectedColors.length > 0) count += selectedColors.length;
    if (selectedSizes.length > 0) count += selectedSizes.length;
    if (selectedFabrics.length > 0) count += selectedFabrics.length;
    if (minRating > 0) count++;
    if (querySearch) count++;
    return count;
  }, [
    selectedCategory,
    selectedPriceRange,
    selectedColors,
    selectedSizes,
    selectedFabrics,
    minRating,
    querySearch
  ]);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];

    // Search query filter (name, category, color, fabric, highlights, tags)
    if (querySearch.trim()) {
      const q = querySearch.toLowerCase().trim();
      list = list.filter((p) => {
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.color.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q))) ||
          (p.highlights && Object.values(p.highlights).some((v) => String(v).toLowerCase().includes(q)))
        );
      });
    }

    // Category filter
    if (selectedCategory && selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Price range filter
    if (selectedPriceRange) {
      list = list.filter(
        (p) => p.price >= selectedPriceRange.min && p.price <= selectedPriceRange.max
      );
    }

    // Colors filter
    if (selectedColors.length > 0) {
      list = list.filter((p) => selectedColors.includes(p.color));
    }

    // Sizes filter
    if (selectedSizes.length > 0) {
      list = list.filter((p) =>
        p.sizes && p.sizes.some((sz) => selectedSizes.includes(sz))
      );
    }

    // Fabrics filter
    if (selectedFabrics.length > 0) {
      list = list.filter((p) => selectedFabrics.includes(p.fabric));
    }

    // Rating filter
    if (minRating > 0) {
      list = list.filter((p) => p.rating >= minRating);
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'popular':
      default:
        list.sort((a, b) => b.reviewsCount - a.reviewsCount);
        break;
    }

    return list;
  }, [
    querySearch,
    selectedCategory,
    selectedPriceRange,
    selectedColors,
    selectedSizes,
    selectedFabrics,
    minRating,
    sortBy
  ]);

  const filterProps = {
    selectedCategory,
    onSelectCategory: (cat) => {
      setSelectedCategory(cat);
      if (cat === 'All') {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('category');
        setSearchParams(newParams);
      } else {
        setSearchParams({ ...Object.fromEntries(searchParams), category: cat });
      }
    },
    selectedPriceRange,
    onSelectPriceRange: setSelectedPriceRange,
    selectedColors,
    onToggleColor: handleToggleColor,
    selectedSizes,
    onToggleSize: handleToggleSize,
    selectedFabrics,
    onToggleFabric: handleToggleFabric,
    minRating,
    onSelectMinRating: setMinRating,
    onResetFilters: handleResetFilters,
    activeFilterCount
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header & Search Notification */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              {querySearch
                ? `Search Results for "${querySearch}"`
                : selectedCategory !== 'All'
                ? `${selectedCategory} Collection`
                : 'All Ethnic Wear Collections'}
            </h1>
            <span className="text-xs font-bold bg-brand-50 text-brand-800 px-2.5 py-0.5 rounded-full">
              {filteredProducts.length} Items
            </span>
          </div>

          {querySearch && (
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-brand-700" />
              Showing products matching your search term.
              <button
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.delete('search');
                  setSearchParams(newParams);
                }}
                className="text-brand-700 font-bold hover:underline ml-1"
              >
                Clear Search
              </button>
            </p>
          )}
        </div>

        {/* Sort & Mobile Filter Trigger */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-800 font-bold text-xs rounded-xl shadow-2xs hover:bg-gray-50"
          >
            <Filter className="w-3.5 h-3.5 text-brand-700" />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>

          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      {/* Main Layout: Desktop Sidebar + Product Grid */}
      <div className="flex gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-28">
          <FilterSidebar {...filterProps} />
        </aside>

        {/* Mobile Filter Drawer */}
        <FilterDrawer
          isOpen={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          totalResults={filteredProducts.length}
          {...filterProps}
        />

        {/* Product Grid */}
        <main className="flex-1 min-w-0">
          <ProductGrid
            products={filteredProducts}
            emptyMessage={
              querySearch
                ? `No products found matching "${querySearch}". Try searching for yellow, rayon, saree, or kurti.`
                : 'No products match your selected filters. Try clearing some filters to see more results.'
            }
          />
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;
