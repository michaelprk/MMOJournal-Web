import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalBaseProps {
  open: boolean;
  onClose: () => void;
  disableBackdropClose?: boolean;
  closeOnEsc?: boolean;
  confirmOnDirty?: boolean;
  isDirty?: boolean;
  getIsDirty?: () => boolean;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function ModalBase({
  open,
  onClose,
  disableBackdropClose = true,
  closeOnEsc = true,
  confirmOnDirty = false,
  isDirty = false,
  getIsDirty,
  title,
  children,
  className = '',
}: ModalBaseProps) {
  const [mounted, setMounted] = useState(false);
  const [openGuard, setOpenGuard] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Get dirty state
  const isDirtyState = getIsDirty ? getIsDirty() : isDirty;

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (open) {
      // Store the previously focused element
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      
      // Set open guard to prevent immediate close
      setOpenGuard(true);
      const timer = setTimeout(() => setOpenGuard(false), 150);
      
      // Focus the dialog
      if (dialogRef.current) {
        dialogRef.current.focus();
      }
      
      return () => {
        clearTimeout(timer);
        // Restore body scroll
        document.body.style.overflow = '';
        // Restore focus to the previously focused element
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [open]);

  // Handle close with dirty confirmation
  const handleClose = () => {
    if (confirmOnDirty && isDirtyState) {
      if (window.confirm('Discard changes?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (openGuard) return; // Prevent immediate close during open guard
    if (disableBackdropClose) return; // Backdrop close disabled
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Handle dialog content click (prevent event bubbling)
  const handleDialogClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Handle scroll capture to prevent bubbling
  const handleWheelCapture = (e: React.WheelEvent) => {
    e.stopPropagation();
  };

  const handleTouchMoveCapture = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  // Handle Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open && closeOnEsc && !openGuard) {
        handleClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, closeOnEsc, openGuard, confirmOnDirty, isDirtyState]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(1px)',
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
        className={className}
        style={{
          background: 'rgba(0, 0, 0, 0.95)',
          border: '2px solid #ffcb05',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          outline: 'none',
        }}
        onClick={handleDialogClick}
        onWheelCapture={handleWheelCapture}
        onTouchMoveCapture={handleTouchMoveCapture}
      >
        {title && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 id="modal-title" style={{ color: '#ffcb05', margin: 0 }}>{title}</h3>
            <button
              onClick={handleClose}
              style={{
                background: 'transparent',
                border: '1px solid #dc3545',
                color: '#dc3545',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '1.2rem',
              }}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
}
