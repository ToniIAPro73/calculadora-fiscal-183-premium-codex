import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Download, ShieldCheck } from 'lucide-react';
import Header from '@/components/Header';
import { buttonVariants } from '@/components/ui/button';
import { useI18n } from '@/contexts/i18nContext';
import { cn } from '@/lib/utils';

export default function PaymentSuccess() {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const downloadUrl = sessionId ? `/api/report?session_id=${encodeURIComponent(sessionId)}` : null;

  return (
    <div className="premium-gradient min-h-screen text-foreground">
      <Helmet>
        <title>{t('paymentSuccessTitle')} · Fiscal183</title>
      </Helmet>

      <Header />

      <main className="premium-section flex min-h-[calc(100vh-5rem)] items-center py-12">
        <section className="mx-auto w-full max-w-2xl text-center">
          <div className="double-shell reveal-surface">
            <div className="double-shell-core space-y-7 p-8 sm:p-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>

              <div className="space-y-3">
                <span className="premium-eyebrow justify-center">
                  <ShieldCheck className="mr-2 h-3.5 w-3.5 text-primary" />
                  {t('paymentSuccessEyebrow')}
                </span>
                <h1 className="text-3xl font-[650] tracking-[-0.05em] text-foreground sm:text-4xl">
                  {t('paymentSuccessTitle')}
                </h1>
                <p className="mx-auto max-w-[52ch] text-sm leading-7 text-muted-foreground sm:text-base">
                  {t('paymentSuccessDescription')}
                </p>
              </div>

              {downloadUrl ? (
                <a
                  href={downloadUrl}
                  className={cn(buttonVariants(), 'h-12 rounded-full px-7 text-[11px] uppercase tracking-[0.2em]')}
                >
                  <Download className="h-4 w-4" />
                  {t('downloadPaidReport')}
                </a>
              ) : (
                <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {t('paymentMissingSession')}
                </p>
              )}

              <Link
                to="/"
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  'h-11 rounded-full px-6 text-[11px] uppercase tracking-[0.2em] text-muted-foreground',
                )}
              >
                {t('backToCalculator')}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
