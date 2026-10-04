'use client';

import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDeleteDialogProps {
  actionVerb?: string;
  confirmLabel: string;
  description: string;
  dismissLabel?: string;
  isDeleting: boolean;
  isOpen: boolean;
  itemName: string | null;
  subtitle: string;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
  pendingLabel?: string;
}

export function ConfirmDeleteDialog({
  actionVerb = 'delete',
  confirmLabel,
  description,
  dismissLabel = 'Cancel',
  isDeleting,
  isOpen,
  itemName,
  subtitle,
  title,
  onClose,
  onConfirm,
  pendingLabel = 'Deleting...',
}: ConfirmDeleteDialogProps) {
  if (!isOpen || !itemName) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/55 p-4 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center py-6">
        <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-[#161616]">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 dark:border-gray-800">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-red-50 p-2 text-red-600 dark:bg-red-950/30 dark:text-red-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {subtitle}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-5 p-6">
            <div className="rounded-2xl border border-red-100 bg-red-50/70 p-4 dark:border-red-900/50 dark:bg-red-950/20">
              <p className="text-sm leading-7 text-gray-700 dark:text-gray-200">
                You are about to {actionVerb}{' '}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {itemName}
                </span>
                .
              </p>
              <p className="mt-2 text-sm leading-7 text-gray-600 dark:text-gray-300">
                {description}
              </p>
            </div>

            <div className="flex flex-wrap justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-800">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-gray-200 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                {dismissLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isDeleting}
                className="rounded-xl bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? pendingLabel : confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
