import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ExternalLink, FileDown, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import DateRangeSelector from '@/components/DateRangeSelector';
import Header from '@/components/Header';
import ProgressBar from '@/components/ProgressBar';
import RangeList from '@/components/RangeList';
import SummaryCard from '@/components/SummaryCard';
import UserDetailsModal, { type ReportUserData } from '@/components/UserDetailsModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useI18n } from '@/contexts/i18nContext';
import { recordClientError } from '@/lib/clientTelemetry';
import { createCheckoutSession } from '@/lib/checkout';
import { calculateFiscalSummary } from '@/lib/fiscalSummary';
import type { DateRange } from '@/lib/dateRangeMerger';
import { buildExampleReportPayload } from '@/lib/reportMetadata';

export default function TaxNomadCalculator() {
  const { t, language } = useI18n();
  const [fiscalYear, setFiscalYear] = useState(() => new Date().getFullYear());
  const [ranges, setRanges] = useState<DateRange[]>([]);
  const [editingRangeIndex, setEditingRangeIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);
  const [userData, setUserData] = useState<ReportUserData>({
    name: '',
    email: '',
    documentType: 'passport',
    taxId: '',
  });
  const summary = useMemo(() => {
    try {
      return calculateFiscalSummary(ranges);
    } catch (error) {
      recordClientError('fiscal_summary_failed', error, {
        fiscalYear,
        periodCount: ranges.length,
      });
      return calculateFiscalSummary([]);
    }
  }, [fiscalYear, ranges]);
  const statusLabel =
    summary.status === 'safe' ? t('statusSafe') : summary.status === 'warning' ? t('statusWarning') : t('statusOver');

  const loadPdfModules = async () => {
    const { generateTaxReport } = await import('@/lib/generatePdf');
    return { generateTaxReport };
  };

  const handleAddRange = (range: DateRange) => {
    setRanges((current) => [...current, range]);
  };

  const handleUpdateRange = (index: number, range: DateRange) => {
    setRanges((current) => current.map((item, currentIndex) => (currentIndex === index ? range : item)));
  };

  const handleRemoveRange = (index: number) => {
    setRanges((current) => current.filter((_, currentIndex) => currentIndex !== index));
    setEditingRangeIndex((current) => {
      if (current === null) return null;
      if (current === index) return null;
      return current > index ? current - 1 : current;
    });
  };

  const handleFiscalYearChange = (year: number) => {
    setFiscalYear(year);
    setRanges([]);
    setEditingRangeIndex(null);
  };

  const handleOpenReportModal = () => {
    if (ranges.length === 0) {
      toast.error(t('reportRequiresRanges'));
      document.getElementById('range-start')?.focus();
      document.getElementById('range-start')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsModalOpen(true);
  };

  const handlePreviewSample = async () => {
    const example = buildExampleReportPayload(fiscalYear);

    try {
      const { generateTaxReport } = await loadPdfModules();
      const doc = await generateTaxReport({
        name: example.name,
        email: example.email,
        documentType: example.documentType,
        taxId: example.taxId,
        ranges: example.ranges,
        fiscalYear: example.fiscalYear,
        language,
        exampleMode: true,
      });
      window.open(doc.output('bloburl'), '_blank', 'noopener,noreferrer');
    } catch (error) {
      recordClientError('sample_pdf_generation_failed', error, {
        fiscalYear: example.fiscalYear,
        periodCount: example.ranges.length,
        language,
      });
      toast.error('Unable to generate the sample PDF preview.');
    }
  };

  const handleGeneratePdf = async () => {
    try {
      setIsStartingCheckout(true);
      const checkoutUrl = await createCheckoutSession({
        name: userData.name,
        email: userData.email,
        taxId: userData.taxId,
        documentType: userData.documentType,
        ranges,
        fiscalYear,
        language,
      });
      window.location.assign(checkoutUrl);
    } catch (error) {
      recordClientError('checkout_session_failed', error, {
        fiscalYear,
        periodCount: ranges.length,
        language,
      });
      toast.error(t('checkoutError'));
      setIsStartingCheckout(false);
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="premium-gradient min-h-screen text-foreground">
      <Helmet>
        <title>Calculadora Fiscal 183 Premium</title>
      </Helmet>

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        {t('skipToContent')}
      </a>

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="glass-orb left-[-10rem] top-[-6rem] h-[22rem] w-[22rem] bg-cyan-500/20" />
        <div className="glass-orb right-[-8rem] top-[8rem] h-[24rem] w-[24rem] bg-blue-500/15" />
        <div className="glass-orb bottom-[-10rem] left-[24%] h-[20rem] w-[20rem] bg-emerald-400/10" />
        <div className="page-noise absolute inset-0 opacity-[0.08]" />
      </div>

      <Header />
      <UserDetailsModal
        isOpen={isModalOpen}
        userData={userData}
        setUserData={setUserData}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleGeneratePdf}
        isLoading={isStartingCheckout}
      />

      <main id="main-content" className="flex-1">
        <section className="premium-section pb-12 pt-8 md:pt-14">
          <div className="grid items-start gap-8 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="space-y-8">
              <div className="space-y-5">
                <span className="premium-eyebrow">
                  <Sparkles className="mr-2 h-3.5 w-3.5 text-primary" />
                  {t('heroEyebrow')}
                </span>
                <div className="max-w-4xl space-y-5">
                  <h1 className="text-balance text-5xl font-[650] tracking-[-0.06em] text-foreground sm:text-6xl xl:text-7xl">
                    <span>{language === 'es' ? 'Domina tu ' : 'Master your '}</span>
                    <span className="hero-accent">
                      {language === 'es' ? 'Residencia.' : 'Residency.'}
                    </span>
                  </h1>
                  <p className="max-w-[62ch] text-base leading-8 text-muted-foreground sm:text-lg">
                    {t('heroSubtitle')}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: t('trackedDaysLabel'), value: `${summary.totalDays}`, tone: 'primary' },
                  { label: t('remainingDaysLabel'), value: `${summary.remainingDays}`, tone: 'secondary' },
                  { label: t('readinessLabel'), value: t('readinessValue'), tone: 'neutral' },
                ].map((item) => (
                  <div key={item.label} className="double-shell reveal-surface">
                    <div
                      className={`double-shell-core p-5 ${
                        item.tone === 'primary'
                          ? 'metric-card-primary'
                          : item.tone === 'secondary'
                            ? 'metric-card-secondary'
                            : 'metric-card-neutral'
                      }`}
                    >
                      <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">{item.label}</p>
                      <p
                        className={`mt-3 text-3xl font-[620] tracking-[-0.05em] ${
                          item.tone === 'primary'
                            ? 'text-primary'
                            : item.tone === 'secondary'
                              ? 'hero-secondary'
                              : 'text-foreground'
                        }`}
                      >
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <DateRangeSelector
                fiscalYear={fiscalYear}
                onFiscalYearChange={handleFiscalYearChange}
                ranges={ranges}
                editingRangeIndex={editingRangeIndex}
                onAddRange={handleAddRange}
                onUpdateRange={handleUpdateRange}
                onCancelEditing={() => setEditingRangeIndex(null)}
              />
              <RangeList
                ranges={summary.annotatedRanges}
                onEditRange={setEditingRangeIndex}
                onRemoveRange={handleRemoveRange}
              />

              <section className="space-y-8 pt-2">
                <div className="flex items-center gap-4">
                  <div className="section-divider" />
                  <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    {t('standardsTitle')}
                  </h3>
                  <div className="section-divider" />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="glass accent-card-primary rounded-[2rem] border-none shadow-none">
                    <CardContent className="space-y-4 p-8">
                      <h4 className="font-serif text-lg text-primary">{t('standardsCardOneTitle')}</h4>
                      <p className="text-sm leading-7 text-muted-foreground">{t('standardsCardOneBody')}</p>
                      <a
                        href="https://sede.agenciatributaria.gob.es/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-secondary transition-colors hover:text-foreground"
                      >
                        {t('officialReference')}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </CardContent>
                  </Card>

                  <Card className="glass accent-card-secondary rounded-[2rem] border-none shadow-none">
                    <CardContent className="space-y-4 p-8">
                      <h4 className="font-serif text-lg text-secondary">{t('standardsCardTwoTitle')}</h4>
                      <p className="text-sm leading-7 text-muted-foreground">{t('standardsCardTwoBody')}</p>
                    </CardContent>
                  </Card>
                </div>
              </section>
            </div>

            <aside className="space-y-8 lg:sticky lg:top-28">
              <div className="group relative">
                <div className="sidebar-glow transition-opacity duration-700 group-hover:opacity-90" />
                <Card className="relative overflow-hidden rounded-[2.5rem] border-white/5 glass shadow-none">
                  <div className="space-y-10 p-7 sm:p-8">
                    <ProgressBar totalDays={summary.totalDays} />

                    <div className="space-y-4">
                      <Button
                        onClick={handleOpenReportModal}
                        aria-disabled={ranges.length === 0}
                        className="h-[4.5rem] w-full rounded-[1.6rem] px-6 text-[11px] uppercase tracking-[0.2em] shadow-2xl disabled:opacity-70"
                      >
                        <FileDown className="h-4 w-4" />
                        {t('reportButton')}
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={handlePreviewSample}
                        className="h-14 w-full rounded-[1.35rem] text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
                      >
                        {t('previewButton')}
                      </Button>
                      <p className="text-xs leading-6 text-muted-foreground">{t('reportHint')}</p>
                    </div>

                    <div className="space-y-4">
                      <SummaryCard
                        title={t('summaryDays')}
                        value={`${summary.totalDays}`}
                        hint={t('summaryHint')}
                        percentage={`${summary.percentageUsed.toFixed(1)}%`}
                      />
                      <SummaryCard
                        title={t('summaryRemaining')}
                        value={`${summary.remainingDays}`}
                        hint={t('summaryRemainingHint')}
                      />
                      <SummaryCard
                        title={t('summaryStatus')}
                        value={statusLabel}
                        hint={t('summaryStatusHint')}
                        status={{ color: summary.status, label: statusLabel }}
                      />
                      <SummaryCard
                        title={t('summaryUniqueRanges')}
                        value={`${summary.mergedRanges.length}`}
                        hint={summary.hasOverlap ? `${summary.annotatedRanges.filter((range) => range.overlapDays > 0).length} ${t('overlapDaysLabel')}` : t('summaryHint')}
                      />
                    </div>

                    <div className="flex flex-col items-center gap-3 pt-2">
                      <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-primary">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        {t('visualAligned')}
                      </div>
                      <p className="px-4 text-center text-[11px] leading-6 text-muted-foreground">
                        {t('visualAlignedHint')}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="flex items-center justify-center gap-4 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                <Link to="/privacy-policy" className="transition-colors hover:text-foreground">
                  {t('footerPrivacy')}
                </Link>
                <span className="opacity-30">/</span>
                <Link to="/terms-of-service" className="transition-colors hover:text-foreground">
                  {t('footerTerms')}
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
