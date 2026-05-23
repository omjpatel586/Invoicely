'use client';

import { ICreateProductRequest, IProduct } from '@invoicely/api-interfaces';
import { GstSlab, ProductUnit } from '@invoicely/constants';
import { X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface ProductFormModalProps {
  initialProduct: IProduct | null;
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: ICreateProductRequest) => void;
}

interface FormErrors {
  name?: string;
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

const gstOptions = [
  GstSlab.ZERO,
  GstSlab.FIVE,
  GstSlab.TWELVE,
  GstSlab.EIGHTEEN,
  GstSlab.TWENTY_EIGHT,
];

const unitOptions = [
  ProductUnit.KG,
  ProductUnit.LITRE,
  ProductUnit.GRAM,
  ProductUnit.PCS,
];

export function ProductFormModal({
  initialProduct,
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
}: ProductFormModalProps) {
  const [values, setValues] = useState<ICreateProductRequest>(defaultValues);
  const [errors, setErrors] = useState<FormErrors>({});

  const isEditMode = useMemo(() => !!initialProduct, [initialProduct]);

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
      setErrors({});
      return;
    }

    setValues(defaultValues);
    setErrors({});
  }, [initialProduct, isOpen]);

  if (!isOpen) {
    return null;
  }

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!values.name?.trim()) {
      nextErrors.name = 'Product name is required';
    }

    if (!values.hsnCode?.trim()) {
      nextErrors.hsnCode = 'HSN code is required';
    }

    if (!values.gstSlab) {
      nextErrors.gstSlab = 'GST slab is required';
    }

    if (!values.unit) {
      nextErrors.unit = 'Unit is required';
    }

    if (!values.unitPrice.trim()) {
      nextErrors.unitPrice = 'Unit price is required';
    } else if (!/^\d+(\.\d{1,2})?$/.test(values.unitPrice.trim())) {
      nextErrors.unitPrice = 'Enter a valid price such as 120.50';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (
    field: keyof ICreateProductRequest,
    value: string | GstSlab | ProductUnit | null
  ) => {
    setValues((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      name: values.name.trim(),
      description: values.description?.trim() || '',
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
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Product Name *
                </label>
                <input
                  value={values.name}
                  onChange={(event) => handleChange('name', event.target.value)}
                  placeholder="e.g. Basmati Rice"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-indigo-500 dark:border-gray-700 dark:bg-[#101010] dark:text-white"
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  value={values.description ?? ''}
                  onChange={(event) =>
                    handleChange('description', event.target.value)
                  }
                  rows={3}
                  placeholder="Optional product description"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-indigo-500 dark:border-gray-700 dark:bg-[#101010] dark:text-white"
                />
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
                {errors.hsnCode && (
                  <p className="mt-2 text-sm text-red-600">{errors.hsnCode}</p>
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
                        ? (event.target.value as GstSlab)
                        : null
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-indigo-500 dark:border-gray-700 dark:bg-[#101010] dark:text-white"
                >
                  <option value="">Select GST %</option>
                  {gstOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}%
                    </option>
                  ))}
                </select>
                {errors.gstSlab && (
                  <p className="mt-2 text-sm text-red-600">{errors.gstSlab}</p>
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
                  {unitOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.unit && (
                  <p className="mt-2 text-sm text-red-600">{errors.unit}</p>
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
                {errors.unitPrice && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.unitPrice}
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
                disabled={isSubmitting}
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
