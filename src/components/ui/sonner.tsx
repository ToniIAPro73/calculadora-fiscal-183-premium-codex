import * as React from 'react';
import { Toaster as Sonner } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';

export function Toaster(props: React.ComponentProps<typeof Sonner>) {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme}
      toastOptions={{
        classNames: {
          toast: 'bg-background text-foreground border-border shadow-lg',
          description: 'text-muted-foreground',
          actionButton: 'bg-primary text-primary-foreground',
          cancelButton: 'bg-muted text-muted-foreground',
        },
      }}
      {...props}
    />
  );
}
