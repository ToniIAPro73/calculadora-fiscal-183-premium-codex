import { Globe, Moon, ShieldCheck, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '@/assets/logo-header.webp';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/contexts/i18nContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function Header() {
  const { language, setLanguage, t } = useI18n();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/10 glass">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4">
        <Link to="/" className="group flex min-w-0 items-center gap-3 sm:gap-4" aria-label="Fiscal183">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/12 bg-background shadow-xl shadow-primary/10 ring-1 ring-primary/10 transition-transform duration-300 group-hover:scale-[1.03] sm:h-14 sm:w-14">
            <img
              src={logo}
              alt=""
              className="h-full w-full object-cover"
              loading="eager"
              decoding="async"
            />
          </div>
          <div className="min-w-0 space-y-0.5">
            <div className="truncate font-serif text-xl font-light tracking-widest text-foreground sm:text-2xl">
              FISCAL<span className="font-bold text-primary">183</span>
            </div>
            <div className="hidden text-[10px] uppercase tracking-[0.22em] text-muted-foreground md:block">
              Premium residency intelligence
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="metric-chip hidden md:inline-flex">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Tax audit ready shell
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
            className="hidden rounded-full px-4 text-[11px] uppercase tracking-[0.2em] md:inline-flex"
            aria-label={t('toggleLanguage')}
          >
            <Globe className="h-4 w-4" />
            {language === 'es' ? 'English' : 'Español'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full"
            aria-label={t('toggleTheme')}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
