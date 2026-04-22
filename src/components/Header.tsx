import { Globe, Moon, ShieldCheck, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/contexts/i18nContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function Header() {
  const { language, setLanguage, t } = useI18n();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/10 glass">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
            <span className="text-xl font-bold text-primary-foreground">F</span>
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl font-light tracking-widest font-serif">
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
