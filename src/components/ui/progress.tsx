import * as ProgressPrimitive from '@radix-ui/react-progress';

type ProgressProps = ProgressPrimitive.ProgressProps & {
  indicatorClassName?: string;
};

export function Progress({ value = 0, indicatorClassName, ...props }: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      value={value}
      className="relative h-4 w-full overflow-hidden rounded-full bg-white/10"
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={indicatorClassName ?? 'h-full bg-primary transition-all'}
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}
