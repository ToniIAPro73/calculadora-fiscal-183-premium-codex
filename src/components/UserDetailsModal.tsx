import { FileText, LockKeyhole, UserRound } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/contexts/i18nContext';
import { cn } from '@/lib/utils';

export type ReportUserData = {
  name: string;
  email: string;
  documentType: 'passport' | 'nie';
  taxId: string;
};

type UserDetailsModalProps = {
  isOpen: boolean;
  userData: ReportUserData;
  setUserData: (data: ReportUserData) => void;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
};

export default function UserDetailsModal({
  isOpen,
  userData,
  setUserData,
  onClose,
  onConfirm,
  isLoading = false,
}: UserDetailsModalProps) {
  const { t } = useI18n();

  return (
    <Dialog open={isOpen} onOpenChange={(next) => (!next ? onClose() : undefined)}>
      <DialogContent className="w-[min(92vw,34rem)] rounded-[2rem] border-white/10 bg-background/95 p-0">
        <div className="double-shell rounded-[2rem]">
          <div className="double-shell-core rounded-[calc(2rem-1px)] p-6">
            <DialogHeader>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                <UserRound className="h-7 w-7 text-primary" />
              </div>
              <DialogTitle className="text-center text-2xl font-[650] tracking-[-0.05em]">{t('userDetailsTitle')}</DialogTitle>
              <DialogDescription className="text-center text-sm leading-7">{t('userDetailsDescription')}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-5">
              <div className="space-y-2">
                <Label className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{t('userDetailsName')}</Label>
                <Input
                  value={userData.name}
                  onChange={(event) => setUserData({ ...userData, name: event.target.value })}
                  className="h-12 rounded-xl border-white/8 bg-white/[0.04]"
                  placeholder="Alex Rivera"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{t('userDetailsEmail')}</Label>
                <Input
                  type="email"
                  value={userData.email}
                  onChange={(event) => setUserData({ ...userData, email: event.target.value })}
                  className="h-12 rounded-xl border-white/8 bg-white/[0.04]"
                  placeholder="alex@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{t('userDetailsDocumentType')}</Label>
                <div className="grid grid-cols-2 gap-3">
                  {(['passport', 'nie'] as const).map((value) => {
                    const selected = userData.documentType === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setUserData({ ...userData, documentType: value })}
                        className={cn(
                          'rounded-[1.1rem] border px-4 py-3 text-sm font-medium transition-all',
                          selected
                            ? 'border-primary/20 bg-primary/10 text-primary'
                            : 'border-white/8 bg-white/[0.04] text-muted-foreground hover:text-foreground',
                        )}
                      >
                        {value === 'passport' ? t('userDetailsPassport') : t('userDetailsNie')}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{t('userDetailsTaxId')}</Label>
                <Input
                  value={userData.taxId}
                  onChange={(event) => setUserData({ ...userData, taxId: event.target.value })}
                  className="h-12 rounded-xl border-white/8 bg-white/[0.04]"
                  placeholder={userData.documentType === 'nie' ? 'X1234567A' : 'X1234567Z'}
                />
              </div>
            </div>

            <DialogFooter className="flex-col gap-3 sm:flex-col">
              <Button
                onClick={onConfirm}
                disabled={isLoading || !userData.name.trim() || !userData.email.trim() || !userData.taxId.trim()}
                className="h-12 w-full rounded-full text-[11px] uppercase tracking-[0.2em]"
              >
                <LockKeyhole className="h-4 w-4" />
                {isLoading ? t('userDetailsGenerating') : t('userDetailsConfirm')}
              </Button>
              <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
                <FileText className="h-4 w-4" />
                {t('userDetailsNote')}
              </div>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
