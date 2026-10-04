'use client';

import { ICreateProductRequest, IProduct } from '@invoicely/api-interfaces';
import {
  GST_SLABS,
  GstSlab,
  MONEY_PATTERN,
  PRODUCT_UNIT_LABELS,
  PRODUCT_UNITS,
  ProductUnit,
} from '@invoicely/constants';
import { X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useFormErrors } from '../hooks/useFormErrors';

interface ProductFormModalProps {
  initialProduct: IProduct | null;
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: ICreateProductRequest) => void;
}

interface FormErrors {
  name?: string;
  description?: string;
  hsnCode?: string;
  gstSlab?: string;
  unit?: string;
  unitPrice?: string;
}

const defaultValues: ICreateProductRequest = {
  name: '',
  description: '',
  hsnCode: '',
  gstSlab: null,
  unit: null,
  unitPrice: '',
};

const getProductErrors = (values: ICreateProductRequest): FormErrors => {
  const errors: FormErrors = {};

  if (!values.name?.trim()) {
    errors.name = 'Product name is required';
  }

  if (!values.description?.trim()) {
    errors.description = 'Description is required';
  }

  if (!values.hsnCode?.trim()) {
    errors.hsnCode = 'HSN code is required';
  }

  if (values.gstSlab === null || values.gstSlab === undefined) {
    errors.gstSlab = 'GST slab is required';
  }

  if (!values.unit) {
    errors.unit = 'Unit is required';
  }

  if (!values.unitPrice.trim()) {
    errors.unitPrice = 'Unit price is required';
  } else if (!MONEY_PATTERN.test(values.unitPrice.trim())) {
    errors.unitPrice = 'Enter a valid price such as 120.50';
  }

  return errors;
};

export function ProductFormModal({
  initialProduct,
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
}: ProductFormModalProps) {
  const [values, setValues] = useState<ICreateProductRequest>(defaultValues);
  const isEditMode = useMemo(() => !!initialProduct, [initialProduct]);
  const { visibleErrors, hasErrors, markTouched, resetTouched } = useFormErrors(
    getProductErrors(values),
    isEditMode
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (initialProduct) {
      setValues({
        name: initialProduct.name,
        description: initialProduct.description ?? '',
        hsnCode: initialProduct.hsnCode ?? '',
        gstSlab: initialProduct.gstSlab,
        unit: initialProduct.unit,
        unitPrice: initialProduct.unitPrice,
      });
      resetTouched();
      return;
    }

    setValues(defaultValues);
    resetTouched();
  }, [initialProduct, isOpen, resetTouched]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (
    field: keyof ICreateProductRequest,
    value: string | GstSlab | ProductUnit | null
  ) => {
    setValues((previous) => ({
      ...previous,
      [field]: value,
    }));
    markTouched(field);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (hasErrors) {
      return;
    }

    onSubmit({
      name: values.name.trim(),
      description: values.description?.trim(),
      hsnCode: values.hsnCode?.trim() || '',
      gstSlab: values.gstSlab,
      unit: values.unit,
      unitPrice: values.unitPrice.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/55 p-4 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center py-6">
        <div className="w-full max-w-2xl rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-[#161616]">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 dark:border-gray-800">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {isEditMode ? 'Edit Product' : 'Add Product'}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage product details, pricing, unit, and GST slab.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="max-h-[calc(100vh-10rem)] overflow-y-auto p-6"
          >
            <div className="grid gap-5 minMd:grid-cols-2">
              <div className="minMd:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Product Name *
                </label>
                <input
                  value={values.name}
                  onChange={(event) => handleChange('name', event.target.value)}
                  placeholder="e.g. Basmati Rice"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-indigo-500 dark:border-gray-700 dark:bg-[#101010] dark:text-white"
                />
                {visibleErrors.name && (
                  <p className="mt-2 text-sm text-red-600">
                    {visibleErrors.name}
                  </p>
                )}
              </div>

              <div className="minMd:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description *
                </label>
                <textarea
                  value={values.description ?? ''}
                  onChange={(event) =>
                    handleChange('description', event.target.value)
                  }
                  rows={3}
                  placeholder="e.g. Premium long grain rice"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-indigo-500 dark:border-gray-700 dark:bg-[#101010] dark:text-white"
                />
                {visibleErrors.description && (
                  <p className="mt-2 text-sm text-red-600">
                    {visibleErrors.description}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  HSN Code *
                </label>
                <input
                  value={values.hsnCode ?? ''}
                  onChange={(event) =>
                    handleChange('hsnCode', event.target.value)
                  }
                  placeholder="e.g. 100630"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-indigo-500 dark:border-gray-700 dark:bg-[#101010] dark:text-white"
                />
                {visibleErrors.hsnCode && (
                  <p className="mt-2 text-sm text-red-600">
                    {visibleErrors.hsnCode}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  GST Slab *
                </label>
                <select
                  value={values.gstSlab ?? ''}
                  onChange={(event) =>
                    handleChange(
                      'gstSlab',
                      event.target.value
                        ? (Number(event.target.value) as GstSlab)
                        : null
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-indigo-500 dark:border-gray-700 dark:bg-[#101010] dark:text-white"
                >
                  <option value="">Select GST %</option>
                  {GST_SLABS.map((option) => (
                    <option key={option} value={option}>
                      {option}%
                    </option>
                  ))}
                </select>
                {visibleErrors.gstSlab && (
                  <p className="mt-2 text-sm text-red-600">
                    {visibleErrors.gstSlab}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Unit *
                </label>
                <select
                  value={values.unit ?? ''}
                  onChange={(event) =>
                    handleChange(
                      'unit',
                      event.target.value
                        ? (event.target.value as ProductUnit)
                        : null
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-indigo-500 dark:border-gray-700 dark:bg-[#101010] dark:text-white"
                >
                  <option value="">Select unit</option>
                  {PRODUCT_UNITS.map((option) => (
                    <option key={option} value={option}>
                      {PRODUCT_UNIT_LABELS[option]} ({option})
                    </option>
                  ))}
                </select>
                {visibleErrors.unit && (
                  <p className="mt-2 text-sm text-red-600">
                    {visibleErrors.unit}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Unit Price (INR) *
                </label>
                <input
                  value={values.unitPrice}
                  onChange={(event) =>
                    handleChange('unitPrice', event.target.value)
                  }
                  placeholder="e.g. 120.50"
                  inputMode="decimal"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-indigo-500 dark:border-gray-700 dark:bg-[#101010] dark:text-white"
                />
                {visibleErrors.unitPrice && (
                  <p className="mt-2 text-sm text-red-600">
                    {visibleErrors.unitPrice}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-800">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-gray-200 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || hasErrors}
                className="rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? 'Saving...'
                  : isEditMode
                  ? 'Update Product'
                  : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
