import { useParams, Link } from 'react-router-dom';
import { Product } from '../store/mockData';
import { MOCK_PRODUCTS } from '../store/mockData';
import { useCart } from '../context/CartContext';
import { ArrowLeft, ShoppingCart, ShieldCheck, Cpu, Code, Package, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { apiFetch } from '../lib/apiFetch';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await apiFetch(`/api/products/${id}`);
        const contentType = response.headers.get('content-type') ?? '';
        if (response.ok && contentType.includes('application/json')) {
          const data = await response.json();
          setProduct(data);
        } else {
          setProduct(MOCK_PRODUCTS.find((item) => item.id === id) ?? null);
        }
      } catch (error) {
        setProduct(MOCK_PRODUCTS.find((item) => item.id === id) ?? null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
    // Re-fetch when language changes so product text is updated
  }, [id, i18n.language]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-vw-console-bg">
        <Loader2 className="h-8 w-8 animate-spin text-vw-console-gold" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-vw-console-bg text-white">
        <h1 className="mb-4 font-mono text-4xl font-bold text-vw-console-gold">404</h1>
        <p className="mb-8 text-violet-100/55">{t('product.not_found')}</p>
        <Link to="/store" className="font-mono text-sm font-bold text-vw-console-gold hover:text-vw-signal-warning">
          [ {t('product.back_to_store')} ]
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-vw-console-bg text-white"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Link to="/store" className="mb-8 inline-flex items-center gap-2 font-mono text-sm font-medium text-violet-100/55 hover:text-vw-console-gold">
          <ArrowLeft className="h-4 w-4" /> {t('product.back_to_store')}
        </Link>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Product Image */}
          <div className="overflow-hidden rounded-[28px] border border-white/5 bg-vw-console-raised/60">
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-6 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/5 bg-vw-console-raised px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-vw-console-gold">
                {product.category === 'hardware' ? <Cpu className="h-3 w-3" /> : <Code className="h-3 w-3" />}
                {product.category === 'hardware' ? t('store.filter_hw') : t('store.filter_sw')}
              </span>
              <span className="font-mono text-xs text-violet-100/40">{t('product.sku')}: {product.sku}</span>
            </div>

            <h1 className="mb-4 font-sans text-4xl font-bold text-white sm:text-5xl">
              {product.name}
            </h1>
            <p className="mb-8 font-mono text-3xl font-bold text-vw-console-gold">${product.price.toFixed(2)}</p>

            <div className="mb-8 border-y border-white/5 py-6">
              <h3 className="mb-4 font-mono text-sm font-bold text-violet-100/50">DESCRIPTION</h3>
              <p className="text-lg leading-relaxed text-violet-100/75">
                {product.description}
              </p>
            </div>

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center rounded-2xl border border-white/5 bg-vw-console-raised p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-xl font-mono text-lg font-bold text-violet-100/60 hover:bg-vw-console-elevated hover:text-white"
                >
                  -
                </button>
                <span className="flex h-10 w-16 items-center justify-center font-mono text-lg font-bold text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= product.inventory_count}
                  className="flex h-10 w-10 items-center justify-center rounded-xl font-mono text-lg font-bold text-violet-100/60 hover:bg-vw-console-elevated hover:text-white disabled:opacity-50"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.is_active || product.inventory_count === 0}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-vw-console-gold px-8 py-4 font-mono text-sm font-bold text-vw-console-bg transition-all hover:bg-vw-signal-warning disabled:cursor-not-allowed disabled:bg-vw-console-raised disabled:text-violet-100/30"
              >
                <ShoppingCart className="h-5 w-5" />
                {product.inventory_count === 0 ? t('product.out_of_stock') : t('product.add_to_cart')}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-8">
              <div className="flex items-center gap-3 text-sm text-violet-100/55">
                <ShieldCheck className="h-5 w-5 text-vw-signal-online" />
                <span>{t('footer.sec_e2e')}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-violet-100/55">
                <Package className="h-5 w-5 text-vw-signal-online" />
                <span>
                  {product.inventory_count > 0
                    ? `${product.inventory_count} ${t('product.in_stock')}`
                    : t('product.out_of_stock')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
