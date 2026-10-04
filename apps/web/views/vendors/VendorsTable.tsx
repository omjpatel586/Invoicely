'use client';

import { IVendor } from '@invoicely/api-interfaces';
import { Pencil, Trash2 } from 'lucide-react';

interface VendorsTableProps {
  isLoading: boolean;
  onDelete: (vendor: IVendor) => void;
  onEdit: (vendor: IVendor) => void;
  vendors: IVendor[];
}

const formatPhone = (vendor: IVendor) =>
  vendor.mobileNumber
    ? [vendor.countryCode, vendor.mobileNumber].filter(Boolean).join(' ')
    : '-';

const formatLocation = (vendor: IVendor) =>
  [vendor.address?.city, vendor.address?.state].filter(Boolean).join(', ') ||
  '-';

export function VendorsTable({
  isLoading,
  onDelete,
  onEdit,
  vendors,
}: VendorsTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500 dark:border-gray-800 dark:bg-[#1a1a1a] dark:text-gray-400">
        Loading vendors...
      </div>
    );
  }

  if (!vendors.length) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center dark:border-gray-700 dark:bg-[#1a1a1a]">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          No vendors found
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Add your first vendor to start billing customers and suppliers for
          this company.
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
                'Vendor Name',
                'GSTIN',
                'Email',
                'Mobile',
                'Location',
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
            {vendors.map((vendor) => (
              <tr
                key={vendor._id}
                className="transition hover:bg-gray-50/70 dark:hover:bg-white/5"
              >
                <td className="px-5 py-4">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {vendor.name}
                  </p>
                  {vendor.description && (
                    <p className="mt-1 line-clamp-1 max-w-xs text-sm text-gray-500 dark:text-gray-400">
                      {vendor.description}
                    </p>
                  )}
                </td>
                <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                  {vendor.gstIn || '-'}
                </td>
                <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                  {vendor.email || '-'}
                </td>
                <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                  {formatPhone(vendor)}
                </td>
                <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                  {formatLocation(vendor)}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(vendor)}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(vendor)}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
