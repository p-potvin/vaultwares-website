import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product } from '../store/mockData';
import { MOCK_PRODUCTS } from '../store/mockData';
import ProductCard from '../components/ProductCard';
import { Filter, Search, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { apiFetch } from '../lib/apiFetch';

export default function Store() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category') || 'all';
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await apiFetch('/api/products');
        const contentType = response.headers.get('content-type') ?? '';
        if (response.ok && contentType.includes('application/json')) {
          const data = await response.json();
          setProducts(data);
        } else {
          setProducts(MOCK_PRODUCTS);
        }
      } catch (error) {
        setProducts(MOCK_PRODUCTS);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
    // Re-fetch when language changes so API returns the new locale
  }, [i18n.language]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch && product.is_active;
    });
  }, [categoryFilter, searchQuery, products]);

  const setCategory = (category: string) => {
    if (category === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-vw-console-bg text-white"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 border-b border-white/5 pb-8">
          <h1 className="mb-4 font-mono text-4xl font-bold tracking-tight text-white">
            {t('store.title')}
          </h1>
          <p className="max-w-2xl text-violet-100/55">
            {t('store.desc')}
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <Filter className="mr-2 h-5 w-5 text-violet-100/35" />
            <button
              onClick={() => setCategory('all')}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 font-mono text-sm font-medium transition-colors ${
                categoryFilter === 'all' ? 'bg-vw-console-gold text-vw-console-bg' : 'bg-vw-console-raised text-violet-100/60 hover:bg-vw-console-elevated hover:text-white'
              }`}
            >
              {t('store.filter_all').toUpperCase()}
            </button>
            <button
              onClick={() => setCategory('hardware')}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 font-mono text-sm font-medium transition-colors ${
                categoryFilter === 'hardware' ? 'bg-vw-console-gold text-vw-console-bg' : 'bg-vw-console-raised text-violet-100/60 hover:bg-vw-console-elevated hover:text-white'
              }`}
            >
              {t('store.filter_hw').toUpperCase()}
            </button>
            <button
              onClick={() => setCategory('software')}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 font-mono text-sm font-medium transition-colors ${
                categoryFilter === 'software' ? 'bg-vw-console-gold text-vw-console-bg' : 'bg-vw-console-raised text-violet-100/60 hover:bg-vw-console-elevated hover:text-white'
              }`}
            >
              {t('store.filter_sw').toUpperCase()}
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-violet-100/35" />
            </div>
            <input
              type="text"
              placeholder={t('store.search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-2xl border border-white/5 bg-vw-console-raised py-2 pl-10 pr-3 font-mono text-sm text-white placeholder-violet-100/30 focus:border-vw-console-violet focus:outline-none focus:ring-1 focus:ring-vw-console-violet"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-vw-console-gold" />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-vw-console-raised/30 py-12 text-center">
            <Search className="mb-4 h-12 w-12 text-violet-100/30" />
            <h3 className="mb-2 font-mono text-lg font-bold text-white">{t('store.no_results')}</h3>
            <p className="text-violet-100/40">{t('store.no_results_desc')}</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setCategory('all');
              }}
              className="mt-6 font-mono text-sm font-bold text-vw-console-gold hover:text-vw-signal-warning"
            >
              [ {t('store.filter_all').toUpperCase()} ]
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
