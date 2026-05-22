import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock, Loader2, UserPlus, LogIn } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { t } = useTranslation();
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? '/';

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.email, form.password, form.firstName, form.lastName);
      }
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(mode === 'login' ? t('auth.login_error') : t('auth.register_error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen items-center justify-center bg-vw-console-bg px-4 py-16"
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-vw-console-elevated text-vw-console-gold">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="font-mono text-2xl font-bold tracking-tight text-white">
            {mode === 'login' ? t('auth.login_title') : t('auth.register_title')}
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-violet-100/45">
            <Lock className="h-3 w-3" />
            <span>AES-256 Encrypted</span>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="mb-6 grid grid-cols-2 rounded-2xl border border-white/5 bg-vw-console-raised p-1">
          <button
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex items-center justify-center gap-2 rounded-md py-2.5 font-mono text-sm font-bold transition-colors ${
              mode === 'login'
                ? 'bg-vw-console-gold text-vw-console-bg'
                : 'text-violet-100/60 hover:text-white'
            }`}
          >
            <LogIn className="h-4 w-4" />
            {t('auth.login_btn')}
          </button>
          <button
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex items-center justify-center gap-2 rounded-md py-2.5 font-mono text-sm font-bold transition-colors ${
              mode === 'register'
                ? 'bg-vw-console-gold text-vw-console-bg'
                : 'text-violet-100/60 hover:text-white'
            }`}
          >
            <UserPlus className="h-4 w-4" />
            {t('auth.register_btn')}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 rounded-[28px] border border-white/5 bg-vw-console-raised/70 p-8">
          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block font-mono text-xs font-bold text-violet-100/55">
                  {t('auth.first_name')}
                </label>
                <input
                  required
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  autoComplete="given-name"
                  className="w-full rounded-2xl border border-white/5 bg-vw-console-bg px-4 py-3 font-mono text-sm text-white focus:border-vw-console-violet focus:outline-none focus:ring-1 focus:ring-vw-console-violet"
                />
              </div>
              <div>
                <label className="mb-2 block font-mono text-xs font-bold text-violet-100/55">
                  {t('auth.last_name')}
                </label>
                <input
                  required
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  autoComplete="family-name"
                  className="w-full rounded-2xl border border-white/5 bg-vw-console-bg px-4 py-3 font-mono text-sm text-white focus:border-vw-console-violet focus:outline-none focus:ring-1 focus:ring-vw-console-violet"
                />
              </div>
            </div>
          )}

          <div>
            <label className="mb-2 block font-mono text-xs font-bold text-violet-100/55">
              {t('auth.email')}
            </label>
            <input
              required
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              placeholder="secure@example.com"
              className="w-full rounded-2xl border border-white/5 bg-vw-console-bg px-4 py-3 font-mono text-sm text-white placeholder-violet-100/25 focus:border-vw-console-violet focus:outline-none focus:ring-1 focus:ring-vw-console-violet"
            />
          </div>

          <div>
            <label className="mb-2 block font-mono text-xs font-bold text-violet-100/55">
              {t('auth.password')}
            </label>
            <input
              required
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              minLength={mode === 'register' ? 8 : undefined}
              className="w-full rounded-2xl border border-white/5 bg-vw-console-bg px-4 py-3 font-mono text-sm text-white focus:border-vw-console-violet focus:outline-none focus:ring-1 focus:ring-vw-console-violet"
            />
          </div>

          {error && (
            <p className="rounded-2xl bg-vw-signal-alert/10 px-4 py-3 font-mono text-xs text-vw-signal-alert border border-vw-signal-alert/20">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-vw-console-gold px-8 py-4 font-mono text-sm font-bold text-vw-console-bg transition-all hover:bg-vw-signal-warning disabled:cursor-not-allowed disabled:bg-vw-console-bg disabled:text-violet-100/30"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : mode === 'login' ? (
              t('auth.login_btn')
            ) : (
              t('auth.register_btn')
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
