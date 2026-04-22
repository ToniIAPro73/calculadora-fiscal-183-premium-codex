import { ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type SummaryCardProps = {
  title: string;
  value: string;
  hint: string;
  status?: {
    color: 'safe' | 'warning' | 'destructive';
    label: string;
  };
  percentage?: string;
};

export default function SummaryCard({ title, value, hint, status, percentage }: SummaryCardProps) {
  return (
    <Card className="rounded-[2rem] border-white/8 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_38%),transparent] shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="text-4xl font-[650] tracking-[-0.06em] text-foreground">{value}</div>
            {percentage ? <div className="text-sm text-muted-foreground">{percentage}</div> : null}
          </div>
          {status ? (
            <div
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em]',
                status.color === 'safe' && 'border-primary/20 bg-primary/10 text-primary',
                status.color === 'warning' && 'border-amber-500/20 bg-amber-500/10 text-amber-500',
                status.color === 'destructive' && 'border-red-500/20 bg-red-500/10 text-red-500',
              )}
            >
              <ArrowUpRight className="h-4 w-4" />
              {status.label}
            </div>
          ) : (
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
              <ArrowUpRight className="h-4 w-4 text-primary" />
            </div>
          )}
        </div>
        <p className="text-sm leading-7 text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}
