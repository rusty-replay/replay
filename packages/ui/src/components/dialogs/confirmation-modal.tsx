'use client';

import * as React from 'react';
import { XIcon } from 'lucide-react';

import { cn } from '@workspace/ui/lib/utils';
import { Button } from '../button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../dialog';

export interface ConfirmationModalProps {
  /**
   * Whether the modal is visible
   */
  visible: boolean;
  /**
   * The title of the modal
   */
  title: string | React.ReactNode;
  /**
   * The size of the modal
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /**
   * The label for the confirm button
   */
  confirmLabel?: string;
  /**
   * The label for the confirm button when loading
   */
  confirmLabelLoading?: string;
  /**
   * The label for the cancel button
   */
  cancelLabel?: string;
  /**
   * Callback when the confirm button is clicked
   */
  onConfirm: () => void;
  /**
   * Callback when the modal is closed or cancel button is clicked
   */
  onCancel: () => void;
  /**
   * Whether the modal is in a loading state
   */
  loading?: boolean;
  /**
   * Whether the confirm button is disabled
   */
  disabled?: boolean;
  /**
   * The variant of the confirm button
   */
  variant?: 'default' | 'destructive' | 'warning';
  /**
   * Alert configuration
   */
  alert?: {
    title?: string;
    description?: string | React.ReactNode;
    className?: string;
  };
  /**
   * Whether to hide the close button
   */
  hideClose?: boolean;
  /**
   * Children to render in the modal body
   */
  children?: React.ReactNode;
  /**
   * Additional class names for the modal content
   */
  className?: string;
}

const sizeMap = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  full: 'sm:max-w-[calc(100%-4rem)]',
};

const buttonVariantMap = {
  default: 'default',
  destructive: 'destructive',
  warning: 'warning',
};

const ConfirmationModal = React.forwardRef<
  React.ElementRef<typeof DialogContent>,
  ConfirmationModalProps
>(
  (
    {
      title,
      size = 'sm',
      visible,
      onCancel,
      onConfirm,
      loading = false,
      cancelLabel = 'Cancel',
      confirmLabel = 'Submit',
      confirmLabelLoading,
      alert,
      children,
      variant = 'default',
      disabled,
      hideClose = false,
      className,
      ...props
    },
    ref
  ) => {
    // Handle the button click
    const handleConfirm: React.MouseEventHandler<HTMLButtonElement> = (e) => {
      e.preventDefault();
      e.stopPropagation();
      onConfirm();
    };

    return (
      <Dialog
        open={visible}
        onOpenChange={(open) => {
          if (!open && visible) {
            onCancel();
          }
        }}
      >
        <DialogContent
          ref={ref}
          className={cn(
            'p-0 gap-0 block overflow-hidden',
            sizeMap[size],
            className
          )}
          {...props}
        >
          {!hideClose && (
            <DialogClose className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          )}

          <DialogHeader className="border-b p-4">
            <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          </DialogHeader>

          {alert && (
            <div
              className={cn(
                'p-4 border-b',
                {
                  'bg-red-50 text-red-900': variant === 'destructive',
                  'bg-yellow-50 text-yellow-900': variant === 'warning',
                  'bg-blue-50 text-blue-900': variant === 'default',
                },
                alert.className
              )}
            >
              {alert.title && <div className="font-medium">{alert.title}</div>}
              {alert.description && (
                <div className="text-sm mt-1">{alert.description}</div>
              )}
            </div>
          )}

          {children && <div className="p-4">{children}</div>}

          <DialogFooter className="flex justify-end gap-2 border-t p-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={loading}
            >
              {cancelLabel}
            </Button>
            <Button
              variant={
                buttonVariantMap[variant] as
                  | 'default'
                  | 'destructive'
                  | 'secondary'
                  | 'outline'
                  | 'ghost'
                  | 'link'
                  | undefined
              }
              size="sm"
              onClick={handleConfirm}
              disabled={disabled || loading}
              className="truncate"
            >
              {loading ? confirmLabelLoading || confirmLabel : confirmLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

ConfirmationModal.displayName = 'ConfirmationModal';

export { ConfirmationModal };
