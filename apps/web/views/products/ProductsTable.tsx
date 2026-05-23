'use client';

import { IProduct } from '@invoicely/api-interfaces';
import { Pencil, Trash2 } from 'lucide-react';

interface ProductsTableProps {
  isLoading: boolean;
  onDelete: (product: IProduct) => void;
  onEdit: (product: IProduct) => void;
  products: IProduct[];
}

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
});

export function ProductsTable({
  isLoading,
  onDelete,
  onEdit,
  products,
}: ProductsTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500 dark:border-gray-800 dark:bg-[#1a1a1a] dark:text-gray-400">
        Loading products...
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center dark:border-gray-700 dark:bg-[#1a1a1a]">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          No products found
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Add your first product to start managing catalog and pricing data for
          this company.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-[#1a1a1a] md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-[#141414]">
              <tr>
                {[
                  'Product Name',
                  'HSN Code',
                  'Unit',
                  'Unit Price',
                  'GST %',
                  'Description',
                  'Actions',
                ].map((title) => (
                  <th
                    key={title}
                    className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400"
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="transition hover:bg-gray-50/70 dark:hover:bg-white/5"
                >
                  <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white">
                    {product.name}
                  </td>
                  <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                    {product.hsnCode || '-'}
                  </td>
                  <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                    {product.unit?.toUpperCase() || '-'}
                  </td>
                  <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                    {currencyFormatter.format(Number(product.unitPrice))}
                  </td>
                  <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                    {product.gstSlab ? `${product.gstSlab}%` : '-'}
                  </td>
                  <td className="max-w-xs px-5 py-4 text-gray-600 dark:text-gray-300">
                    <span className="line-clamp-2">
                      {product.description || '-'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(product)}
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

      <div className="grid gap-4 md:hidden">
        {products.map((product) => (
          <div
            key={product._id}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#1a1a1a]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  HSN: {product.hsnCode || '-'} | GST:{' '}
                  {product.gstSlab ? `${product.gstSlab}%` : '-'}
                </p>
              </div>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                {product.unit?.toUpperCase() || '-'}
              </span>
            </div>

            <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <p>
                <span className="font-medium text-gray-900 dark:text-white">
                  Unit Price:
                </span>{' '}
                {currencyFormatter.format(Number(product.unitPrice))}
              </p>
              <p>
                <span className="font-medium text-gray-900 dark:text-white">
                  Description:
                </span>{' '}
                {product.description || '-'}
              </p>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => onEdit(product)}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(product)}
                className="flex-1 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/30"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
