import { Link } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Product } from '../store/mockData';
import { MOCK_PRODUCTS } from '../store/mockData';
import ProductCard from '../components/ProductCard';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { apiFetch } from '../lib/apiFetch';
import { RelayCoreIcon, RelayDistributedIcon, UtilityBlockIcon } from '../icons/vaultwares-icons';
import { useMemo } from 'react';

export default function Home() {
  const { t, i18n } = useTranslation();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [spark, setSpark] = useState(0);

  useEffect(() => {
    apiFetch('/api/products')
      .then((r) => {
        const contentType = r.headers.get('content-type') ?? '';
        return r.ok && contentType.includes('application/json') ? r.json() : MOCK_PRODUCTS;
      })
      .then((data: Product[]) => setFeaturedProducts(data.slice(0, 3)))
      .catch(() => setFeaturedProducts(MOCK_PRODUCTS.slice(0, 3)));
  }, [i18n.language]); // Re-fetch when language changes

  useEffect(() => {
    const interval = setInterval(() => setSpark((x) => x + 1), 1200);
    return () => clearInterval(interval);
  }, []);

  const series = useMemo(() => {
    const base = 42 + ((spark % 7) - 3) * 2;
    return Array.from({ length: 36 }, (_, i) => {
      const wave = Math.sin((i / 36) * Math.PI * 2) * 12;
      const jitter = ((i * 17 + spark * 29) % 9) - 4;
      return Math.max(6, base + wave + jitter);
    });
  }, [spark]);

  const lineD = useMemo(() => {
    const w = 360;
    const h = 120;
    const max = Math.max(...series);
    const min = Math.min(...series);
    const range = Math.max(1, max - min);
    const xStep = w / (series.length - 1);
    return series
      .map((v, idx) => {
        const x = idx * xStep;
        const y = h - ((v - min) / range) * (h - 8) - 4;
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(' ');
  }, [series]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-screen flex-col bg-vw-console-bg text-white"
    >
      {/* Hero Section */}
      <section className="vw-console-shell relative flex min-h-[80vh] items-center justify-center overflow-hidden px-4 py-28 sm:px-6 lg:px-8">
        <div className="absolute inset-x-8 top-12 h-px bg-gradient-to-r from-transparent via-vw-console-violet/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-vw-signal-relay/10 blur-3xl"></div>
        <div className="absolute right-0 top-16 h-80 w-80 rounded-full bg-vw-console-violet/15 blur-3xl"></div>
        
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="text-center lg:text-left">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 flex justify-center lg:justify-start"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-vw-console-raised px-4 py-2 font-mono text-sm font-medium text-violet-100/70">
              <span className="vw-led h-2.5 w-2.5 rounded-full bg-vw-signal-online shadow-lg shadow-vw-signal-online/40" />
              <Shield className="h-4 w-4" /> {t('home.hero_tag')}
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8 font-sans text-5xl font-light tracking-tight sm:text-7xl"
          >
            {t('home.hero_title_1')} <br />
            <span className="text-vw-console-gold">
              {t('home.hero_title_2')}
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-violet-100/60 sm:text-xl lg:mx-0"
          >
            {t('home.hero_desc')}
          </motion.p>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              to="/store"
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-vw-console-gold px-8 py-4 font-mono text-sm font-bold text-vw-console-bg transition-all hover:bg-vw-signal-warning sm:w-auto"
            >
              {t('home.btn_catalog')} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/blog"
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/5 bg-vw-console-raised px-8 py-4 font-mono text-sm font-bold text-white transition-all hover:bg-vw-console-elevated sm:w-auto"
            >
              {t('home.btn_intel')}
            </Link>
          </motion.div>
          </div>

          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="vw-card p-6"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-vw-console-elevated text-violet-100">
                  <RelayDistributedIcon className="h-8 w-8 text-vw-warm-bg" />
                </div>
                <div>
                  <div className="font-mono text-sm text-white">Telemetry</div>
                  <div className="text-xs text-violet-100/45">LED-driven health + signals</div>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/5 bg-vw-console-bg/55 px-3 py-1.5">
                <span className="vw-led h-2 w-2 rounded-full bg-vw-signal-online shadow-lg shadow-vw-signal-online/35" />
                <span className="vw-led h-2 w-2 rounded-full bg-vw-signal-sync shadow-lg shadow-vw-signal-sync/35" />
                <span className="vw-led h-2 w-2 rounded-full bg-vw-signal-warning shadow-lg shadow-vw-signal-warning/35" />
                <span className="vw-led h-2 w-2 rounded-full bg-vw-signal-relay shadow-lg shadow-vw-signal-relay/35" />
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-vw-console-bg/55 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="font-mono text-xs text-violet-100/55">PACKET FLOW (SIMULATED)</div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-violet-100/55">
                  <span className="vw-led h-2 w-2 rounded-full bg-vw-signal-online" /> ok
                  <span className="vw-led h-2 w-2 rounded-full bg-vw-signal-warning" /> warn
                </div>
              </div>
              <svg viewBox="0 0 360 120" className="h-28 w-full">
                <defs>
                  <linearGradient id="vw-telemetry-gradient" x1="0" y1="0" x2="360" y2="0" gradientUnits="userSpaceOnUse">
                    <stop stopColor="var(--vault-console-violet)" />
                    <stop offset="0.55" stopColor="var(--vault-console-gold)" />
                    <stop offset="1" stopColor="var(--vault-signal-online)" />
                  </linearGradient>
                  <filter id="vw-telemetry-glow" x="-20%" y="-50%" width="140%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <path d="M 0 116 L 360 116" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
                <path d="M 0 84 L 360 84" stroke="rgba(255,255,255,0.04)" strokeWidth="2" />
                <path d="M 0 52 L 360 52" stroke="rgba(255,255,255,0.04)" strokeWidth="2" />

                <path d={lineD} stroke="url(#vw-telemetry-gradient)" strokeWidth="3" fill="none" filter="url(#vw-telemetry-glow)" />
              </svg>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { label: 'inspect', value: 92 + (spark % 5), color: 'bg-vw-signal-online' },
                { label: 'relay', value: 64 + ((spark * 3) % 19), color: 'bg-vw-signal-relay' },
                { label: 'alerts', value: 3 + (spark % 4), color: 'bg-vw-signal-warning' },
              ].map((m) => (
                <div key={m.label} className="rounded-2xl border border-white/5 bg-vw-console-bg/55 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-[11px] uppercase tracking-wide text-violet-100/55">{m.label}</div>
                    <span className={`vw-led h-2 w-2 rounded-full ${m.color}`} />
                  </div>
                  <div className="mt-1 font-mono text-lg font-semibold text-white">{m.value}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Console Preview */}
      <section className="bg-vw-console-bg py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between border-b border-white/5 pb-6">
            <div>
              <h2 className="font-mono text-2xl font-bold text-white">Console aesthetics</h2>
              <p className="mt-2 max-w-2xl text-violet-100/55">
                UI that stays readable under stress: deep contrast, soft radii, and LED signifiers for status at a glance.
              </p>
            </div>
            <div className="hidden items-center gap-3 sm:flex">
              <span className="vw-led h-2.5 w-2.5 rounded-full bg-vw-signal-online shadow-lg shadow-vw-signal-online/35" />
              <span className="vw-led h-2.5 w-2.5 rounded-full bg-vw-signal-sync shadow-lg shadow-vw-signal-sync/35" />
              <span className="vw-led h-2.5 w-2.5 rounded-full bg-vw-signal-warning shadow-lg shadow-vw-signal-warning/35" />
              <span className="vw-led h-2.5 w-2.5 rounded-full bg-vw-signal-relay shadow-lg shadow-vw-signal-relay/35" />
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            <div className="vw-card lg:col-span-7">
              <img
                src="/screenshots/home-console-brand.png"
                alt="VaultWares console preview"
                className="h-full w-full rounded-[28px] object-cover"
                loading="lazy"
              />
            </div>
            <div className="space-y-6 lg:col-span-5">
              <div className="vw-card p-6">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-vw-console-elevated text-white">
                    <RelayCoreIcon className="h-6 w-6 text-vw-warm-bg" />
                  </span>
                  <div>
                    <div className="font-mono text-sm text-white">LED semantics</div>
                    <div className="text-xs text-violet-100/45">Color communicates state, not decoration</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-violet-100/55">
                  {[
                    ['Online', 'bg-vw-signal-online', 'Operational'],
                    ['Sync', 'bg-vw-signal-sync', 'In progress'],
                    ['Warning', 'bg-vw-signal-warning', 'Degraded'],
                    ['Relay', 'bg-vw-signal-relay', 'Routing'],
                  ].map(([label, color, desc]) => (
                    <div key={label} className="flex items-center justify-between rounded-2xl border border-white/5 bg-vw-console-bg/55 px-4 py-3">
                      <div className="flex items-center gap-3 font-mono text-xs text-white">
                        <span className={`vw-led h-2.5 w-2.5 rounded-full ${color}`} />
                        {label}
                      </div>
                      <div className="text-xs text-violet-100/55">{desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="vw-card overflow-hidden">
                <img
                  src="/screenshots/store-console-brand.png"
                  alt="VaultWares store preview"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-y border-white/5 bg-vw-console-surface py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-vw-console-elevated text-violet-100">
                <RelayCoreIcon className="h-9 w-9 text-vw-warm-bg" />
              </div>
              <h3 className="mb-4 font-mono text-xl font-bold text-white">{t('home.feat_1_title')}</h3>
              <p className="text-violet-100/55">{t('home.feat_1_desc')}</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-vw-console-elevated text-violet-100">
                <UtilityBlockIcon className="h-9 w-9 text-vw-warm-bg" />
              </div>
              <h3 className="mb-4 font-mono text-xl font-bold text-white">{t('home.feat_2_title')}</h3>
              <p className="text-violet-100/55">{t('home.feat_2_desc')}</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-vw-console-elevated text-violet-100">
                <UtilityBlockIcon className="h-9 w-9 text-vw-warm-bg" />
              </div>
              <h3 className="mb-4 font-mono text-xl font-bold text-white">{t('home.feat_3_title')}</h3>
              <p className="text-violet-100/55">{t('home.feat_3_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-vw-console-bg py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-end justify-between border-b border-white/5 pb-6">
            <div>
              <h2 className="font-mono text-3xl font-bold text-white">{t('home.featured_hw')}</h2>
              <p className="mt-2 text-violet-100/55">{t('home.featured_hw_desc')}</p>
            </div>
            <Link to="/store" className="hidden font-mono text-sm font-bold text-vw-console-gold hover:text-vw-signal-warning sm:block">
              {t('home.view_all')}
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link to="/store" className="font-mono text-sm font-bold text-vw-console-gold hover:text-vw-signal-warning">
              {t('home.view_all')}
            </Link>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
