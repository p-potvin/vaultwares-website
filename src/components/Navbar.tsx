import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, Globe, User, LogOut, LogIn } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-vw-console-surface/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-3 text-vw-console-gold">
            <img src="/brand/vaultwares-minimal-gold-filled.png" alt="VaultWares" className="h-9 w-9" />
            <span className="text-xl font-semibold tracking-tight text-white">
              Vault<span className="text-vw-console-gold">Wares</span>
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex md:items-center md:gap-8">
          <Link to="/store" className="font-mono text-sm font-medium text-violet-100/60 transition-colors hover:text-vw-console-gold">
            {t('nav.store')}
          </Link>
          <Link to="/blog" className="font-mono text-sm font-medium text-violet-100/60 transition-colors hover:text-vw-console-gold">
            {t('nav.intel')}
          </Link>
          <div className="flex items-center gap-4 border-l border-white/5 pl-8">
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-1 rounded-xl border border-white/5 bg-vw-console-raised px-3 py-2 font-mono text-xs font-medium text-violet-100/65 transition-colors hover:text-vw-console-gold"
            >
              <Globe className="h-4 w-4" />
              {i18n.language.toUpperCase()}
            </button>
            {user ? (
              <>
                <Link to="/account" className="flex items-center gap-1.5 font-mono text-xs font-medium text-violet-100/60 transition-colors hover:text-vw-console-gold">
                  <User className="h-4 w-4" />
                  {user.first_name}
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 font-mono text-xs font-medium text-violet-100/60 transition-colors hover:text-vw-signal-alert"
                >
                  <LogOut className="h-4 w-4" />
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <Link to="/login" className="flex items-center gap-1.5 font-mono text-xs font-medium text-violet-100/60 transition-colors hover:text-vw-console-gold">
                <LogIn className="h-4 w-4" />
                {t('nav.login')}
              </Link>
            )}
            <Link to="/cart" className="relative text-violet-100/60 transition-colors hover:text-white">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-vw-console-gold text-[10px] font-bold text-vw-console-bg">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-4 md:hidden">
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1 font-mono text-xs font-medium text-violet-100/60 transition-colors hover:text-vw-console-gold"
          >
            <Globe className="h-4 w-4" />
            {i18n.language.toUpperCase()}
          </button>
          <Link to="/cart" className="relative text-violet-100/60 transition-colors hover:text-white">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-vw-console-gold text-[10px] font-bold text-vw-console-bg">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-violet-100/60 hover:text-white"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="border-b border-white/5 bg-vw-console-surface px-4 py-4 md:hidden">
          <div className="flex flex-col space-y-4">
            <Link
              to="/store"
              onClick={() => setIsMenuOpen(false)}
              className="font-mono text-sm font-medium text-violet-100/60 hover:text-vw-console-gold"
            >
              {t('nav.store')}
            </Link>
            <Link
              to="/blog"
              onClick={() => setIsMenuOpen(false)}
              className="font-mono text-sm font-medium text-violet-100/60 hover:text-vw-console-gold"
            >
              {t('nav.intel')}
            </Link>
            {user ? (
              <>
                <Link
                  to="/account"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 font-mono text-sm font-medium text-violet-100/60 hover:text-vw-console-gold"
                >
                  <User className="h-4 w-4" />
                  {t('nav.account')}
                </Link>
                <button
                  onClick={() => { logout(); setIsMenuOpen(false); }}
                  className="flex items-center gap-2 font-mono text-sm font-medium text-violet-100/60 hover:text-vw-signal-alert text-left"
                >
                  <LogOut className="h-4 w-4" />
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 font-mono text-sm font-medium text-violet-100/60 hover:text-vw-console-gold"
              >
                <LogIn className="h-4 w-4" />
                {t('nav.login')}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
