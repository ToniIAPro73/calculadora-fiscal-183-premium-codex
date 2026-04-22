import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock, ShieldCheck, Trash2 } from 'lucide-react';
import Header from '@/components/Header';
import { useI18n } from '@/contexts/i18nContext';
import { reportOwner } from '@/lib/reportMetadata';

export default function PrivacyPolicy() {
  const { t, language } = useI18n();
  const body =
    language === 'es'
      ? {
          controller: `Responsable: ${reportOwner.name}, ${reportOwner.nif}, ${reportOwner.email}.`,
          use: 'Los rangos de fechas se procesan en el navegador para calcular permanencia. Los datos del modal se usan solo para componer el PDF descargable.',
          retention: 'No mantenemos una base de datos de informes en esta v1. Los datos introducidos viven en el estado local de la sesion del navegador mientras usas la app.',
        }
      : {
          controller: `Controller: ${reportOwner.name}, ${reportOwner.nif}, ${reportOwner.email}.`,
          use: 'Date ranges are processed in the browser to calculate presence. Modal data is used only to compose the downloadable PDF.',
          retention: 'This v1 does not maintain a report database. Entered data stays in local browser session state while you use the app.',
        };

  return (
    <div className="premium-gradient min-h-screen text-foreground">
      <Helmet>
        <title>{t('privacyTitle')}</title>
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
              <span className="premium-eyebrow">{t('privacyUpdated')}</span>
              <h1 className="text-4xl font-[650] tracking-[-0.06em] sm:text-5xl">{t('privacyTitle')}</h1>
              <p className="max-w-3xl text-base leading-8 text-muted-foreground">{t('privacyIntro')}</p>
            </div>

            <section className="grid gap-5 md:grid-cols-3">
              {[
                [Lock, t('legalDataController'), body.controller],
                [ShieldCheck, t('legalUseOfData'), body.use],
                [Trash2, t('legalRetention'), body.retention],
              ].map(([Icon, title, text]) => {
                const Cmp = Icon as typeof Lock;
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
