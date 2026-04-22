import type { HTMLAttributes } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;

export function DialogOverlay(props: DialogPrimitive.DialogOverlayProps) {
  return <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" {...props} />;
}

export function DialogContent(props: DialogPrimitive.DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className="fixed left-1/2 top-1/2 w-[min(92vw,32rem)] -translate-x-1/2 -translate-y-1/2 rounded-[2rem] border border-white/10 bg-background p-6 shadow-2xl"
        {...props}
      />
    </DialogPortal>
  );
}

export function DialogHeader(props: HTMLAttributes<HTMLDivElement>) {
  return <div className="space-y-2 text-center sm:text-left" {...props} />;
}

export function DialogFooter(props: HTMLAttributes<HTMLDivElement>) {
  return <div className="mt-6 flex justify-end gap-3" {...props} />;
}
