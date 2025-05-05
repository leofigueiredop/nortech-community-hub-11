import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ComingSoonAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinWaitlist: () => void;
}

const ComingSoonAlert: React.FC<ComingSoonAlertProps> = ({
  isOpen,
  onClose,
  onJoinWaitlist
}) => {
  const { t } = useTranslation();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="mx-auto bg-indigo-100 dark:bg-indigo-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Clock className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <DialogTitle className="text-center" translationKey="workflows.comingSoon.title" />
          <DialogDescription className="text-center" translationKey="workflows.comingSoon.description" />
        </DialogHeader>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button variant="outline" onClick={onClose} className="sm:flex-1">
            {/* @ts-expect-error i18next typing */}
            {t('workflows.comingSoon.close')}
          </Button>
          <Button onClick={onJoinWaitlist} className="sm:flex-1">
            {/* @ts-expect-error i18next typing */}
            {t('workflows.comingSoon.joinWaitlist')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ComingSoonAlert;
