import { useEffect, useMemo, useState } from 'react';
import { endOfYear, format, startOfYear } from 'date-fns';
import { CalendarDays, CalendarRange, PencilLine, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/contexts/i18nContext';
import {
  collectOccupiedDayKeys,
  normalizeDateRange,
  parseInputDate,
  type DateRange,
  toInputValue,
  validateDateRangeDraft,
} from '@/lib/dateRangeMerger';

type DateRangeSelectorProps = {
  fiscalYear: number;
  onFiscalYearChange: (year: number) => void;
  ranges: DateRange[];
  editingRangeIndex: number | null;
  onAddRange: (range: DateRange) => void;
  onUpdateRange: (index: number, range: DateRange) => void;
  onCancelEditing: () => void;
};

export default function DateRangeSelector({
  fiscalYear,
  onFiscalYearChange,
  ranges,
  editingRangeIndex,
  onAddRange,
  onUpdateRange,
  onCancelEditing,
}: DateRangeSelectorProps) {
  const { t } = useI18n();
  const exerciseStart = useMemo(() => startOfYear(new Date(fiscalYear, 0, 1)), [fiscalYear]);
  const exerciseEnd = useMemo(() => endOfYear(new Date(fiscalYear, 0, 1)), [fiscalYear]);
  const [fiscalYearInput, setFiscalYearInput] = useState(String(fiscalYear));
  const [startInput, setStartInput] = useState('');
  const [endInput, setEndInput] = useState('');

  const draftStart = useMemo(() => parseInputDate(startInput), [startInput]);
  const draftEnd = useMemo(() => parseInputDate(endInput), [endInput]);
  const isEditing = editingRangeIndex !== null;
  const occupiedDayKeys = useMemo(() => collectOccupiedDayKeys(ranges, editingRangeIndex ?? undefined), [ranges, editingRangeIndex]);
  const hasInput = Boolean(startInput || endInput);
  const validation = useMemo(
    () =>
      validateDateRangeDraft({
        draftStart,
        draftEnd,
        hasInput,
        exerciseStart,
        exerciseEnd,
        occupiedDayKeys,
      }),
    [draftStart, draftEnd, hasInput, exerciseStart, exerciseEnd, occupiedDayKeys],
  );

  const validationMessage = validation.code ? t(validationCodeToKey[validation.code]) : null;
  const draftDays = draftStart && draftEnd && validation.valid ? normalizeDateRange({ start: draftStart, end: draftEnd }).days : null;

  useEffect(() => {
    if (editingRangeIndex === null) {
      return;
    }
    const range = ranges[editingRangeIndex];
    if (!range) {
      return;
    }
    setStartInput(toInputValue(range.start));
    setEndInput(toInputValue(range.end));
  }, [editingRangeIndex, ranges]);

  useEffect(() => {
    setFiscalYearInput(String(fiscalYear));
  }, [fiscalYear]);

  const resetDraft = () => {
    setStartInput('');
    setEndInput('');
  };

  const handleSubmit = () => {
    if (!draftStart || !draftEnd || !validation.valid) return;
    const nextRange = normalizeDateRange({ start: draftStart, end: draftEnd });

    if (editingRangeIndex !== null) {
      onUpdateRange(editingRangeIndex, nextRange);
      onCancelEditing();
    } else {
      onAddRange(nextRange);
    }

    resetDraft();
  };

  const handleCancelEdit = () => {
    resetDraft();
    onCancelEditing();
  };

  const handleFiscalYearInputChange = (value: string) => {
    setFiscalYearInput(value);

    const nextYear = Number(value);

    if (Number.isInteger(nextYear) && nextYear >= 1900 && nextYear <= 2100 && nextYear !== fiscalYear) {
      resetDraft();
      onFiscalYearChange(nextYear);
    }
  };

  return (
    <section className="double-shell reveal-surface">
      <div className="double-shell-core space-y-8 p-6 sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <span className="premium-eyebrow">
              <Sparkles className="mr-2 h-3.5 w-3.5 text-primary" />
              {t('selectorEyebrow')}
            </span>
            <div className="space-y-3">
              <h2 className="text-2xl font-[620] tracking-[-0.05em] text-foreground sm:text-3xl">
                {t('selectorTitle')}
              </h2>
              <p className="max-w-[62ch] text-sm leading-7 text-muted-foreground sm:text-base">
                {t('selectorDescription')}
              </p>
            </div>
          </div>

          <div className="info-grid-card min-w-[15rem] space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                <CalendarDays className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{t('selectorModeLabel')}</p>
                <p className="text-lg font-medium text-foreground">{t('selectorModeValue')}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fiscal-year" className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {t('selectorFiscalYear')}
              </Label>
              <Input
                id="fiscal-year"
                type="number"
                min={1900}
                max={2100}
                value={fiscalYearInput}
                onChange={(event) => handleFiscalYearInputChange(event.target.value)}
                className="h-11 rounded-xl border-white/8 bg-white/[0.04]"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[1.75rem] border border-white/8 bg-white/[0.03] p-5">
            <div className="mb-5 flex items-center gap-3">
              <CalendarRange className="h-4 w-4 text-secondary" />
              <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">{t('selectorDraftLabel')}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2 rounded-2xl border border-white/8 bg-black/10 p-4">
                <Label htmlFor="range-start" className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{t('startDate')}</Label>
                <Input
                  id="range-start"
                  type="date"
                  min={format(exerciseStart, 'yyyy-MM-dd')}
                  max={format(exerciseEnd, 'yyyy-MM-dd')}
                  value={startInput.replace(/\//g, '-')}
                  onChange={(event) => setStartInput(event.target.value.replace(/-/g, '/'))}
                  className="h-12 rounded-xl border-white/8 bg-white/[0.04]"
                  aria-invalid={validation.code === 'missing_start' || validation.code === 'outside_exercise' || validation.code === 'invalid_order' || validation.code === 'overlap'}
                />
                <p className="text-xs text-muted-foreground">
                  {draftStart ? format(draftStart, 'dd MMM yyyy') : t('validationMissingStart')}
                </p>
              </div>
              <div className="space-y-2 rounded-2xl border border-white/8 bg-black/10 p-4">
                <Label htmlFor="range-end" className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{t('endDate')}</Label>
                <Input
                  id="range-end"
                  type="date"
                  min={format(exerciseStart, 'yyyy-MM-dd')}
                  max={format(exerciseEnd, 'yyyy-MM-dd')}
                  value={endInput.replace(/\//g, '-')}
                  onChange={(event) => setEndInput(event.target.value.replace(/-/g, '/'))}
                  className="h-12 rounded-xl border-white/8 bg-white/[0.04]"
                  aria-invalid={validation.code === 'missing_end' || validation.code === 'outside_exercise' || validation.code === 'invalid_order' || validation.code === 'overlap'}
                />
                <p className="text-xs text-muted-foreground">
                  {draftEnd ? format(draftEnd, 'dd MMM yyyy') : t('validationMissingEnd')}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-dashed border-white/12 bg-white/[0.025] p-5">
            <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
              {isEditing ? t('editingRange') : t('readyToAdd')}
            </p>
            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border border-white/8 bg-black/10 p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{t('draftDays')}</p>
                <p className="mt-3 text-3xl font-[620] tracking-[-0.05em] text-foreground">{draftDays ?? '—'}</p>
              </div>
              <p id="range-validation-message" className={`text-sm leading-7 ${validationMessage ? 'text-red-400' : 'text-muted-foreground'}`} aria-live="polite">
                {validationMessage ?? t('helperNoDraft')}
              </p>
            </div>
            <div className="mt-5 flex flex-col gap-3">
              <Button type="button" onClick={handleSubmit} disabled={!validation.valid || !draftStart || !draftEnd} className="h-12 rounded-full px-6 text-[11px] uppercase tracking-[0.2em]">
                {isEditing ? <PencilLine className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {isEditing ? t('saveChanges') : t('addRange')}
              </Button>
              {isEditing ? (
                <Button type="button" variant="ghost" onClick={handleCancelEdit} className="h-11 rounded-full text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  {t('cancelEdit')}
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const validationCodeToKey = {
  missing_start: 'validationMissingStart',
  missing_end: 'validationMissingEnd',
  outside_exercise: 'validationOutsideExercise',
  invalid_order: 'validationOrder',
  overlap: 'validationOverlap',
} as const;
