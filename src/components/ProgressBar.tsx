import { cn } from '@/lib/utils';
import { useI18n } from '@/contexts/i18nContext';

type ProgressBarProps = {
  totalDays: number;
  limit?: number;
  warningThreshold?: number;
};

export default function ProgressBar({ totalDays, limit = 183, warningThreshold = 150 }: ProgressBarProps) {
  const { t } = useI18n();
  const percentage = Math.min((totalDays / limit) * 100, 100);
  const status = totalDays > limit ? 'destructive' : totalDays > warningThreshold ? 'warning' : 'safe';

  return (
    <div className="double-shell">
      <div className="double-shell-core space-y-5 p-5">
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{t('progressTitle')}</p>
            <p className="flex items-baseline gap-2 text-4xl font-light font-serif">
              <span
                className={cn(
                  status === 'safe' && 'text-primary',
                  status === 'warning' && 'text-amber-500',
                  status === 'destructive' && 'text-red-500',
                )}
              >
                {totalDays}
              </span>
              <span className="text-sm font-normal uppercase tracking-[0.18em] text-muted-foreground">
                / {limit} {t('days')}
              </span>
            </p>
          </div>
          <div
            className={cn(
              'rounded-full border px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em]',
              status === 'safe' && 'border-primary/20 bg-primary/10 text-primary',
              status === 'warning' && 'border-amber-500/20 bg-amber-500/10 text-amber-500',
              status === 'destructive' && 'border-red-500/20 bg-red-500/10 text-red-500',
            )}
          >
            {status === 'safe' ? t('progressSafe') : status === 'warning' ? t('progressWarning') : t('progressOver')}
          </div>
        </div>

        <div className="relative h-2.5 overflow-hidden rounded-full border border-white/8 bg-white/[0.04]">
          <div
            className={cn(
              'relative h-full rounded-full transition-all duration-700 ease-out',
              status === 'safe' && 'bg-[linear-gradient(90deg,rgba(16,185,129,0.84),rgba(6,182,212,0.92))]',
              status === 'warning' && 'bg-[linear-gradient(90deg,rgba(251,191,36,0.82),rgba(245,158,11,0.96))]',
              status === 'destructive' && 'bg-[linear-gradient(90deg,rgba(251,113,133,0.82),rgba(239,68,68,0.95))]',
            )}
            style={{ width: `${percentage}%` }}
          >
            <div className="animate-shimmer absolute inset-0" />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{t('summaryHint')}</span>
          <span className="font-medium text-foreground">{percentage.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}
