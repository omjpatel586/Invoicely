'use client';

import { IBill } from '@invoicely/api-interfaces';
import { BillStatus, InvoiceCopy } from '@invoicely/constants';
import { formatBillNumber } from '@invoicely/utils';
import {
  Ban,
  FileDown,
  MessageCircle,
  Pencil,
  Printer,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { ActionsMenu } from '../components/ActionsMenu';

interface BillsTableProps {
  bills: IBill[];
  isLoading: boolean;
  onToggleStatus: (bill: IBill) => void;
  onDelete: (bill: IBill) => void;
  onDownload: (bill: IBill, copy: InvoiceCopy) => void;
  onEdit: (bill: IBill) => void;
  onPrint: (bill: IBill, copy: InvoiceCopy) => void;
}

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
});

const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const statusClassNames: Record<BillStatus, string> = {
  [BillStatus.ISSUED]:
    'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  [BillStatus.CANCELLED]:
    'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400',
};

const formatAmount = (value: string | null) =>
  currencyFormatter.format(Number(value ?? 0));

function StatusBadge({ status }: { status: BillStatus }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${statusClassNames[status]}`}
    >
      {status}
    </span>
  );
}

export function BillsTable({
  bills,
  isLoading,
  onToggleStatus,
  onDelete,
  onDownload,
  onEdit,
  onPrint,
}: BillsTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500 dark:border-gray-800 dark:bg-[#1a1a1a] dark:text-gray-400">
        Loading sales bills...
      </div>
    );
  }

  if (!bills.length) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center dark:border-gray-700 dark:bg-[#1a1a1a]">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          No sales bills found
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Create your first sales bill from your products and vendors for this
          company.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-[#1a1a1a]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-[#141414]">
            <tr>
              {[
                'Bill No.',
                'Date',
                'Bill To',
                'Type',
                'Items',
                'Total',
                'Status',
                'Actions',
              ].map((title) => (
                <th
                  key={title}
                  className="whitespace-nowrap px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400"
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {bills.map((bill) => (
              <tr
                key={bill._id}
                className="transition hover:bg-gray-50/70 dark:hover:bg-white/5"
              >
                <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white">
                  {formatBillNumber(bill.billNumber)}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-gray-600 dark:text-gray-300">
                  {dateFormatter.format(new Date(bill.billDate))}
                </td>
                <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                  {bill.billToVendorDetails?.name || '-'}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-gray-600 dark:text-gray-300">
                  {bill.type}
                </td>
                <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                  {bill.products.length}
                </td>
                <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-900 dark:text-white">
                  {formatAmount(bill.billingDetails.totalAmount)}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={bill.status} />
                </td>
                <td className="px-5 py-4">
                  <ActionsMenu
                    label={`Actions for ${formatBillNumber(bill.billNumber)}`}
                    items={[
                      {
                        label: 'Edit Bill',
                        icon: Pencil,
                        disabled: bill.status === BillStatus.CANCELLED,
                        onClick: () => onEdit(bill),
                      },
                      {
                        label: 'Print Original Copy',
                        icon: Printer,
                        onClick: () => onPrint(bill, InvoiceCopy.ORIGINAL),
                      },
                      {
                        label: 'Print Duplicate Copy',
                        icon: Printer,
                        onClick: () => onPrint(bill, InvoiceCopy.DUPLICATE),
                      },
                      {
                        label: 'Download Original Copy',
                        icon: FileDown,
                        onClick: () => onDownload(bill, InvoiceCopy.ORIGINAL),
                      },
                      {
                        label: 'Download Duplicate Copy',
                        icon: FileDown,
                        onClick: () => onDownload(bill, InvoiceCopy.DUPLICATE),
                      },
                      {
                        label: 'Send on WhatsApp',
                        icon: MessageCircle,
                        badge: 'Soon',
                        disabled: true,
                      },
                      bill.status === BillStatus.CANCELLED
                        ? {
                            label: 'Re-issue Bill',
                            icon: RotateCcw,
                            separated: true,
                            onClick: () => onToggleStatus(bill),
                          }
                        : {
                            label: 'Cancel Bill',
                            icon: Ban,
                            tone: 'warning',
                            separated: true,
                            onClick: () => onToggleStatus(bill),
                          },
                      {
                        label: 'Delete Bill',
                        icon: Trash2,
                        tone: 'danger',
                        onClick: () => onDelete(bill),
                      },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
