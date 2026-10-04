'use client';

import { IBillingDetails } from '@invoicely/api-interfaces';
import { BillType, GstSupplyType } from '@invoicely/constants';
import { GstSupply } from '@invoicely/utils';
import { AlertTriangle, ArrowRight, MapPin, ReceiptText } from 'lucide-react';
import Link from 'next/link';

interface BillSummaryPanelProps {
  billingDetails: IBillingDetails;
  billType: BillType;
  cancelHref: string;
  hasVendor: boolean;
  isEditMode: boolean;
  isSubmitDisabled: boolean;
  isSubmitting: boolean;
  itemCount: number;
  supply: GstSupply;
}

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
});

const formatAmount = (value: string | null) =>
  currencyFormatter.format(Number(value ?? 0));

function SummaryRow({
  label,
  hint,
  value,
}: {
  label: string;
  hint?: string;
  value: string | null;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-sm">
      <span className="text-gray-600 dark:text-gray-400">
        {label}
        {hint && (
          <span className="ml-1.5 text-xs text-gray-400 dark:text-gray-500">
            {hint}
          </span>
        )}
      </span>
      <span className="font-medium tabular-nums text-gray-900 dark:text-white">
        {formatAmount(value)}
      </span>
    </div>
  );
}

function SupplyInfo({
  hasVendor,
  supply,
}: {
  hasVendor: boolean;
  supply: GstSupply;
}) {
  if (!hasVendor) {
    return (
      <p className="rounded-xl border border-dashed border-gray-300 px-3 py-2.5 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
        Select a vendor to apply CGST + SGST or IGST.
      </p>
    );
  }

  if (!supply.isDetermined) {
    return (
      <div className="flex gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>
          Vendor state is unknown, so CGST + SGST is applied. Add the vendors
          GSTIN or state to confirm.
        </span>
      </div>
    );
  }

  const isInterState = supply.type === GstSupplyType.INTER_STATE;

  return (
    <div className="rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-white/5">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-200">
          <MapPin className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
          {isInterState ? 'Inter-state supply' : 'Intra-state supply'}
        </span>
        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
          {isInterState ? 'IGST' : 'CGST + SGST'}
        </span>
      </div>
      {supply.companyState && supply.vendorState && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          {supply.companyState}
          <ArrowRight className="h-3 w-3" />
          {supply.vendorState}
        </p>
      )}
    </div>
  );
}

export function BillSummaryPanel({
  billingDetails,
  billType,
  cancelHref,
  hasVendor,
  isEditMode,
  isSubmitDisabled,
  isSubmitting,
  itemCount,
  supply,
}: BillSummaryPanelProps) {
  const isInterState = supply.type === GstSupplyType.INTER_STATE;

  return (
    <aside className="minLg:sticky minLg:top-4">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-[#1a1a1a]">
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 px-5 pb-5 pt-4 text-white dark:from-indigo-500/90 dark:via-indigo-600/80 dark:to-violet-700/80">
          <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-100">
              <ReceiptText className="h-4 w-4" />
              {billType}
            </span>
            <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-medium text-white">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
          </div>
          <p className="relative mt-4 text-xs font-medium text-indigo-100">
            Grand Total
          </p>
          <p className="relative mt-1 text-3xl font-semibold tabular-nums tracking-tight">
            {formatAmount(billingDetails.totalAmount)}
          </p>
        </div>

        <div className="space-y-4 p-5">
          <SupplyInfo hasVendor={hasVendor} supply={supply} />

          <div className="space-y-3">
            <SummaryRow label="Taxable Amount" value={billingDetails.amount} />
            {isInterState ? (
              <SummaryRow label="IGST" value={billingDetails.igstAmount} />
            ) : (
              <>
                <SummaryRow
                  label="CGST"
                  hint="Central"
                  value={billingDetails.cgstAmount}
                />
                <SummaryRow
                  label="SGST"
                  hint="State"
                  value={billingDetails.sgstAmount}
                />
              </>
            )}
          </div>

          <div className="space-y-3 border-t border-dashed border-gray-200 pt-4 dark:border-gray-800">
            <SummaryRow label="Total GST" value={billingDetails.gstAmount} />
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-semibold text-gray-900 dark:text-white">
                Total Payable
              </span>
              <span className="text-lg font-semibold tabular-nums text-indigo-600 dark:text-indigo-400">
                {formatAmount(billingDetails.totalAmount)}
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <button
              type="submit"
              disabled={isSubmitting || isSubmitDisabled}
              className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? 'Saving...'
                : isEditMode
                ? 'Update Bill'
                : 'Create Bill'}
            </button>
            {isSubmitDisabled && (
              <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                Complete the bill date, vendor, and products to continue.
              </p>
            )}
            <Link
              href={cancelHref}
              className="block w-full rounded-xl px-5 py-2.5 text-center text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
