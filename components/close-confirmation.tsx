'use client';

/**
 * ============================================================================
 * CLOSE CONFIRMATION DIALOG
 * ============================================================================
 * Shows a confirmation dialog when the user tries to leave with unsaved changes
 * or while a game is actively being played.
 * 
 * This component:
 * - Intercepts the browser's beforeunload event
 * - Shows a custom modal when navigating away
 * - Provides options to save, discard, or cancel
 */

import { useEffect } from 'react';
import { useGame } from '@/lib/game-context';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';

interface CloseConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export function CloseConfirmation({ 
  open, 
  onOpenChange, 
  onConfirm,
  title = 'Unsaved Changes',
  description = 'You have unsaved changes. Are you sure you want to leave? Your changes will be lost.'
}: CloseConfirmationProps) {
  const { playSound } = useGame();

  const handleConfirm = () => {
    playSound('click');
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    playSound('click');
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-card border-border">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-destructive/10">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <AlertDialogTitle className="text-foreground">
              {title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-muted-foreground">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={handleCancel}
            className="bg-muted text-foreground border-border hover:bg-muted/80"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Leave Anyway
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/**
 * Hook to handle browser close/refresh warnings
 * Use this in components that have unsaved state
 */
export function useCloseWarning(hasUnsavedChanges: boolean) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        // Modern browsers ignore custom messages, but this triggers the dialog
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);
}
