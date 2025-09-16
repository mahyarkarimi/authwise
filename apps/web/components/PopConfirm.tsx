import Modal from './Modal';
import Button from './Button';
import { useState } from 'react';

interface PopConfirmProps {
  onClose?: () => void;
  title: string;
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'primary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
}

export default function PopConfirm({
  onClose,
  title,
  message,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  loading = false,
  disabled,
  children
}: React.PropsWithChildren<PopConfirmProps>) {
  const [isOpen, setOpen] = useState(false);
  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  }

  return (
    <>
      <div onClick={() => disabled ? null : setOpen(true)}>
        {children}
      </div>
      <Modal isOpen={isOpen} onClose={handleClose} title={title} size="sm">
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">{message}</p>
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={handleClose} disabled={loading}>
              {cancelText}
            </Button>
            <Button variant={variant} onClick={handleConfirm} loading={loading}>
              {confirmText}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
