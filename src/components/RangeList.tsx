import { format } from 'date-fns';
import { CalendarDays, Clock3, Layers3, PencilLine, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/contexts/i18nContext';
import type { AnnotatedRange } from '@/lib/dateRangeMerger';

type RangeListProps = {
  ranges: AnnotatedRange[];
  onEditRange: (index: number) => void;
  onRemoveRange: (index: number) => void;
};

export default function RangeList({ ranges, onEditRange, onRemoveRange }: RangeListProps) {
  const { t } = useI18n();

  return (
    <section className="double-shell reveal-surface">
      <div className="double-shell-core overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/8 px-6 py-5">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-primary" />
            <div>
              <h3 className="text-xl font-serif font-light">{t('rangeListTitle')}</h3>
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{t('rangeListSubtitle')}</p>
            </div>
          </div>
          <div className="metric-chip">
            <Layers3 className="h-3.5 w-3.5" />
            {ranges.length} {ranges.length === 1 ? t('day') : t('days')}
          </div>
        </div>

        <div className="grid gap-4 p-6">
          {ranges.length === 0 ? (
            <div className="rounded-[1.75rem] border border-dashed border-white/12 bg-white/[0.03] px-5 py-10 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/8 bg-white/[0.04]">
                <Clock3 className="h-6 w-6 text-primary" />
              </div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">{t('noRangesTitle')}</p>
              <p className="mx-auto mt-4 max-w-[36rem] text-sm leading-7 text-muted-foreground">{t('noRangesHint')}</p>
            </div>
          ) : (
            ranges.map((range, index) => (
              <div
                key={`${range.start.toISOString()}-${range.end.toISOString()}-${index}`}
                className="rounded-[1.75rem] border border-white/8 bg-white/[0.03] p-5 transition-all duration-300 hover:bg-white/[0.05]"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-1 flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                      <span className="text-2xl font-[800] tracking-tight text-primary">{range.days}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">
                        {range.days === 1 ? t('day') : t('days')}
                      </span>
                    </div>

                    <div className="grid flex-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('fromLabel')}</p>
                        <p className="text-lg font-semibold text-foreground">{format(range.start, 'dd MMM yyyy')}</p>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('toLabel')}</p>
                        <p className="text-lg font-semibold text-foreground">{format(range.end, 'dd MMM yyyy')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                    {range.overlapDays > 0 ? (
                      <div className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-500">
                        {range.overlapDays} {t('overlapDaysLabel')}
                      </div>
                    ) : null}
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => onEditRange(index)}
                      className="h-11 rounded-full border border-white/8 bg-white/[0.04] px-4 text-[11px] uppercase tracking-[0.18em]"
                      aria-label={`${t('editLabel')} ${format(range.start, 'yyyy-MM-dd')} ${format(range.end, 'yyyy-MM-dd')}`}
                    >
                      <PencilLine className="h-4 w-4" />
                      {t('editLabel')}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveRange(index)}
                      className="h-11 w-11 rounded-full border border-white/8 bg-white/[0.04] text-muted-foreground hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-500"
                      aria-label={`${t('removeLabel')} ${format(range.start, 'yyyy-MM-dd')} ${format(range.end, 'yyyy-MM-dd')}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
