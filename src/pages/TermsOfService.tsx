import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Scale, Shield } from 'lucide-react';
import Header from '@/components/Header';
import { useI18n } from '@/contexts/i18nContext';

export default function TermsOfService() {
  const { t, language } = useI18n();
  const body =
    language === 'es'
      ? {
          use: 'La calculadora es una utilidad informativa. No sustituye asesoramiento fiscal o legal profesional.',
          liability: 'El resultado depende por completo de los rangos introducidos por el usuario. La herramienta no responde por decisiones fiscales tomadas a partir del informe.',
          law: 'Estas condiciones se interpretan conforme a la normativa espanola y de consumo aplicable.',
        }
      : {
          use: 'The calculator is an informational utility. It does not replace professional tax or legal advice.',
          liability: 'Results depend entirely on user-entered ranges. The tool is not responsible for tax decisions made from the report.',
          law: 'These terms are interpreted under applicable Spanish and consumer law.',
        };

  return (
    <div className="premium-gradient min-h-screen text-foreground">
      <Helmet>
        <title>{t('termsTitle')}</title>
      </Helmet>
      <Header />
      <main className="premium-section py-10">
        <Link to="/" className="metric-chip mb-8 inline-flex">
          <ArrowLeft className="h-4 w-4" />
          {t('legalBack')}
        </Link>

        <div className="double-shell">
          <div className="double-shell-core space-y-8 p-7 sm:p-10">
            <div className="space-y-4">
              <span className="premium-eyebrow">{t('termsUpdated')}</span>
              <h1 className="text-4xl font-[650] tracking-[-0.06em] sm:text-5xl">{t('termsTitle')}</h1>
              <p className="max-w-3xl text-base leading-8 text-muted-foreground">{t('termsIntro')}</p>
            </div>

            <section className="grid gap-5 md:grid-cols-3">
              {[
                [Scale, t('legalTermsUse'), body.use],
                [AlertTriangle, t('legalTermsLiability'), body.liability],
                [Shield, t('legalTermsLaw'), body.law],
              ].map(([Icon, title, text]) => {
                const Cmp = Icon as typeof Scale;
                return (
                  <div key={title as string} className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-5">
                    <Cmp className="h-5 w-5 text-primary" />
                    <h2 className="mt-4 text-lg font-semibold">{title as string}</h2>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{text as string}</p>
                  </div>
                );
              })}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
