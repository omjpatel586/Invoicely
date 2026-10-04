'use client';

import {
  IBill,
  IBillLineItem,
  IBillVendorSnapshot,
  ICompany,
  ICreateBillRequest,
  IProduct,
  IVendor,
} from '@invoicely/api-interfaces';
import { BillType, QUANTITY_PATTERN } from '@invoicely/constants';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import {
  calculateBillingDetails,
  calculateLineTotal,
  formatBillNumber,
  getChangedFields,
  getGstSupply,
} from '@invoicely/utils';
import ScreenLoader from '../components/loader';
import { useFormErrors } from '../hooks/useFormErrors';
import { createBill, getBillById, updateBill } from '../utils/bill';
import { getCompanyById } from '../utils/company';
import { getProducts } from '../utils/product';
import { getVendorById } from '../utils/vendor';
import { BillSummaryPanel } from './BillSummaryPanel';
import { VendorSearchSelect } from './VendorSearchSelect';

interface LineItemValues extends IBillLineItem {
  key: number;
  quantityInput: string;
}

type FormErrors = Record<string, string>;

const lineErrorKey = (key: number) => `line-${key}`;

const getMissingProductFields = (lineItem: IBillLineItem) =>
  [
    !lineItem.description && 'description',
    !lineItem.hsnCode && 'HSN code',
    !lineItem.unit && 'unit',
    lineItem.gstSlab === null && 'GST slab',
    !lineItem.unitPrice && 'unit price',
  ].filter(Boolean);

const getLineItemError = (lineItem: LineItemValues) => {
  if (!lineItem.id) {
    return 'Select a product';
  }

  const missingFields = getMissingProductFields(lineItem);
  if (missingFields.length) {
    return `This product has no ${missingFields.join(
      ', '
    )}. Update it on the Products page.`;
  }

  if (
    !QUANTITY_PATTERN.test(lineItem.quantityInput.trim()) ||
    Number(lineItem.quantityInput) <= 0
  ) {
    return 'Enter a valid quantity';
  }

  return null;
};

const typeOptions = [BillType.TAX_INVOICE, BillType.PROFORMA_INVOICE];

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
});

const cardClassName =
  'rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#1a1a1a]';

const inputClassName =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-indigo-500 dark:border-gray-700 dark:bg-[#101010] dark:text-white';

const labelClassName =
  'mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300';

const sectionTitleClassName =
  'text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400';

const padDatePart = (value: number) => String(value).padStart(2, '0');

const toDateInputValue = (value: Date | string) => {
  const date = new Date(value);
  return `${date.getFullYear()}-${padDatePart(
    date.getMonth() + 1
  )}-${padDatePart(date.getDate())}`;
};

const emptyLineItem = (key: number): LineItemValues => ({
  key,
  quantityInput: '1',
  id: null,
  name: null,
  description: null,
  hsnCode: null,
  quantity: 1,
  unit: null,
  unitPrice: null,
  gstSlab: null,
  totalPrice: null,
});

export function SalesBillFormPage() {
  const router = useRouter();
  const params = useParams();
  const companyId = params.id as string;
  const billId = params.billId as string | undefined;
  const listPath = `/companies/${companyId}/sales-bills`;

  const lineItemKey = useRef(0);
  const [initialBill, setInitialBill] = useState<IBill | null>(null);
  const [company, setCompany] = useState<ICompany | null>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [billDate, setBillDate] = useState(toDateInputValue(new Date()));
  const [vendor, setVendor] = useState<IBillVendorSnapshot | null>(null);
  const [vendorDetails, setVendorDetails] = useState<IVendor | null>(null);
  const [type, setType] = useState<BillType>(BillType.TAX_INVOICE);
  const [lineItems, setLineItems] = useState<LineItemValues[]>([]);

  const isEditMode = !!billId;
  const today = toDateInputValue(new Date());

  const nextLineItemKey = () => {
    lineItemKey.current += 1;
    return lineItemKey.current;
  };

  useEffect(() => {
    if (!companyId) {
      return;
    }

    void fetchFormData(companyId, billId);
  }, [companyId, billId]);

  const fetchFormData = async (
    targetCompanyId: string,
    targetBillId?: string
  ) => {
    const token = localStorage.getItem('invoicelyAppAuthToken') as string;

    try {
      setIsLoading(true);
      const [companyRes, productsRes, billRes] = await Promise.all([
        getCompanyById(targetCompanyId, token),
        getProducts(targetCompanyId, token),
        targetBillId
          ? getBillById(targetCompanyId, targetBillId, token)
          : Promise.resolve(null),
      ]);
      setCompany(companyRes.data);
      setProducts(productsRes.data);

      if (billRes) {
        const bill = billRes.data;
        const billVendorId = bill.billToVendorDetails?.id;

        setInitialBill(bill);
        setBillDate(toDateInputValue(bill.billDate));
        setVendor(billVendorId ? bill.billToVendorDetails : null);
        setType(bill.type);
        setLineItems(
          bill.products.map((product) => ({
            ...product,
            hsnCode:
              product.hsnCode ||
              productsRes.data.find(
                (catalogProduct) => catalogProduct._id === product.id
              )?.hsnCode ||
              null,
            key: nextLineItemKey(),
            quantityInput: product.quantity?.toString() ?? '',
          }))
        );

        if (billVendorId) {
          const vendorRes = await getVendorById(
            targetCompanyId,
            billVendorId,
            token
          ).catch(() => null);
          setVendorDetails(vendorRes?.data ?? null);
        }
      } else {
        setLineItems([emptyLineItem(nextLineItemKey())]);
      }
    } catch (error: unknown) {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to load sales bill'
      );

      if (targetBillId) {
        router.push(listPath);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const computedLineItems = useMemo<IBillLineItem[]>(
    () =>
      lineItems.map((lineItem) => {
        const quantity = Number.parseFloat(lineItem.quantityInput);
        const safeQuantity = Number.isFinite(quantity) ? quantity : null;

        return {
          id: lineItem.id,
          name: lineItem.name,
          description: lineItem.description,
          hsnCode: lineItem.hsnCode ?? null,
          quantity: safeQuantity,
          unit: lineItem.unit,
          unitPrice: lineItem.unitPrice,
          gstSlab: lineItem.gstSlab,
          totalPrice: calculateLineTotal(lineItem.unitPrice, safeQuantity),
        };
      }),
    [lineItems]
  );

  const supply = useMemo(
    () => getGstSupply(company, vendorDetails),
    [company, vendorDetails]
  );

  const billingDetails = useMemo(
    () => calculateBillingDetails(computedLineItems, supply.type),
    [computedLineItems, supply.type]
  );

  const isOriginalDate =
    !!initialBill && billDate === toDateInputValue(initialBill.billDate);

  const formErrors = useMemo<FormErrors>(() => {
    const errors: FormErrors = {};

    if (!billDate) {
      errors.billDate = 'Bill date is required';
    } else if (!isOriginalDate && billDate < today) {
      errors.billDate = 'Bill date cannot be in the past';
    }

    if (!vendor?.id) {
      errors.vendor = 'Select the vendor to bill';
    }

    if (!lineItems.length) {
      errors.products = 'Add at least one product';
    }

    lineItems.forEach((lineItem) => {
      const lineError = getLineItemError(lineItem);
      if (lineError) {
        errors[lineErrorKey(lineItem.key)] = lineError;
      }
    });

    return errors;
  }, [billDate, isOriginalDate, today, vendor, lineItems]);

  const { visibleErrors, hasErrors, markTouched } = useFormErrors(
    formErrors,
    isEditMode
  );

  const handleVendorChange = (selectedVendor: IVendor | null) => {
    markTouched('vendor');
    setVendorDetails(selectedVendor);
    setVendor(
      selectedVendor
        ? { id: selectedVendor._id, name: selectedVendor.name }
        : null
    );
  };

  const handleProductChange = (key: number, productId: string) => {
    const product = products.find((current) => current._id === productId);
    markTouched(lineErrorKey(key));

    setLineItems((previous) =>
      previous.map((lineItem) =>
        lineItem.key === key
          ? {
              ...lineItem,
              id: product?._id ?? null,
              name: product?.name ?? null,
              description: product?.description ?? null,
              hsnCode: product?.hsnCode ?? null,
              unit: product?.unit ?? null,
              unitPrice: product?.unitPrice ?? null,
              gstSlab: product?.gstSlab ?? null,
            }
          : lineItem
      )
    );
  };

  const handleQuantityChange = (key: number, value: string) => {
    markTouched(lineErrorKey(key));
    setLineItems((previous) =>
      previous.map((lineItem) =>
        lineItem.key === key ? { ...lineItem, quantityInput: value } : lineItem
      )
    );
  };

  const handleAddLineItem = () => {
    setLineItems((previous) => [...previous, emptyLineItem(nextLineItemKey())]);
  };

  const handleRemoveLineItem = (key: number) => {
    markTouched('products');
    setLineItems((previous) =>
      previous.filter((lineItem) => lineItem.key !== key)
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (hasErrors || !vendor) {
      return;
    }

    const values: ICreateBillRequest = {
      billDate:
        isOriginalDate && initialBill
          ? new Date(initialBill.billDate)
          : new Date(`${billDate}T00:00:00`),
      type,
      billToVendorDetails: vendor,
      shipToVendorDetails: vendor,
      products: computedLineItems,
      billingDetails,
    };

    const token = localStorage.getItem('invoicelyAppAuthToken') as string;

    try {
      setIsSubmitting(true);

      if (initialBill) {
        const previousValues: ICreateBillRequest = {
          billDate: new Date(initialBill.billDate),
          type: initialBill.type,
          billToVendorDetails: initialBill.billToVendorDetails,
          shipToVendorDetails: initialBill.shipToVendorDetails,
          products: initialBill.products,
          billingDetails: initialBill.billingDetails,
        };
        const changedFields = getChangedFields(previousValues, values);

        if (!Object.keys(changedFields).length) {
          toast('No changes to update');
          router.push(listPath);
          return;
        }

        const res = await updateBill(
          companyId,
          initialBill._id,
          changedFields,
          token
        );
        toast.success(res.message || 'Sales bill updated successfully');
      } else {
        const res = await createBill(companyId, values, token);
        toast.success(res.message || 'Sales bill created successfully');
      }

      router.push(listPath);
    } catch (error: unknown) {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to save sales bill'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!companyId || isLoading) {
    return <ScreenLoader />;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto space-y-6">
      <div className={`flex items-center gap-3 ${cardClassName}`}>
        <Link
          href={listPath}
          className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
          title="Back to sales bills"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {initialBill
              ? `Edit Sales Bill ${formatBillNumber(initialBill.billNumber)}`
              : 'Create Sales Bill'}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Bill a vendor with products from your catalog. GST is calculated
            automatically from the vendors state.
          </p>
        </div>
      </div>

      <div className="grid items-start gap-6 minLg:grid-cols-[minmax(0,1fr)_20rem] minXl:grid-cols-[minmax(0,1fr)_23rem]">
        <div className="space-y-6">
          <div className={cardClassName}>
            <h3 className={`mb-4 ${sectionTitleClassName}`}>Bill Details</h3>

            <div className="grid items-start gap-5 minMd:grid-cols-2 minXl:grid-cols-4">
              <div>
                <label className={labelClassName}>Bill Date *</label>
                <input
                  type="date"
                  value={billDate}
                  min={isOriginalDate ? undefined : today}
                  onChange={(event) => {
                    setBillDate(event.target.value);
                    markTouched('billDate');
                  }}
                  className={inputClassName}
                />
                {visibleErrors.billDate && (
                  <p className="mt-2 text-sm text-red-600">
                    {visibleErrors.billDate}
                  </p>
                )}
              </div>

              <div className="minXl:col-span-2">
                <label className={labelClassName}>Vendor *</label>
                <VendorSearchSelect
                  companyId={companyId}
                  error={visibleErrors.vendor}
                  value={vendor}
                  onChange={handleVendorChange}
                />
                {vendorDetails && (
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-600 dark:bg-white/5 dark:text-gray-300">
                      GSTIN: {vendorDetails.gstIn || 'Not provided'}
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-600 dark:bg-white/5 dark:text-gray-300">
                      State: {vendorDetails.address?.state || 'Not provided'}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className={labelClassName}>Bill Type *</label>
                <select
                  value={type}
                  onChange={(event) => setType(event.target.value as BillType)}
                  className={inputClassName}
                >
                  {typeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={cardClassName}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className={sectionTitleClassName}>Products</h3>
              <button
                type="button"
                onClick={handleAddLineItem}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                <Plus className="h-4 w-4" />
                Add Item
              </button>
            </div>

            {visibleErrors.products && (
              <p className="mb-3 text-sm text-red-600">
                {visibleErrors.products}
              </p>
            )}
            {!products.length && (
              <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
                No products yet. Add one from the Products page first.
              </p>
            )}

            <div className="space-y-3">
              {lineItems.map((lineItem, index) => {
                const computed = computedLineItems[index];
                const isMissingProduct =
                  !!lineItem.id &&
                  !products.some((product) => product._id === lineItem.id);

                return (
                  <div
                    key={lineItem.key}
                    className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800"
                  >
                    <div className="grid gap-3 minMd:grid-cols-[1fr_8rem_auto]">
                      <div>
                        <label className={labelClassName}>Product *</label>
                        <select
                          value={lineItem.id ?? ''}
                          onChange={(event) =>
                            handleProductChange(
                              lineItem.key,
                              event.target.value
                            )
                          }
                          className={inputClassName}
                        >
                          <option value="">Select product</option>
                          {isMissingProduct && (
                            <option value={lineItem.id ?? ''}>
                              {lineItem.name}
                            </option>
                          )}
                          {products.map((product) => (
                            <option key={product._id} value={product._id}>
                              {product.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className={labelClassName}>Quantity *</label>
                        <input
                          value={lineItem.quantityInput}
                          onChange={(event) =>
                            handleQuantityChange(
                              lineItem.key,
                              event.target.value
                            )
                          }
                          inputMode="decimal"
                          className={inputClassName}
                        />
                      </div>

                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveLineItem(lineItem.key)}
                          className="inline-flex h-[50px] items-center justify-center rounded-xl border border-red-200 px-4 text-red-600 transition hover:bg-red-50 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/30"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {visibleErrors[lineErrorKey(lineItem.key)] && (
                      <p className="mt-2 text-sm text-red-600">
                        {visibleErrors[lineErrorKey(lineItem.key)]}
                      </p>
                    )}

                    {lineItem.id && (
                      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600 dark:text-gray-300">
                        <span>Unit: {lineItem.unit?.toUpperCase() || '-'}</span>
                        <span>
                          Price:{' '}
                          {currencyFormatter.format(
                            Number(lineItem.unitPrice ?? 0)
                          )}
                        </span>
                        <span>
                          GST:{' '}
                          {lineItem.gstSlab !== null
                            ? `${lineItem.gstSlab}%`
                            : '-'}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          Amount:{' '}
                          {currencyFormatter.format(
                            Number(computed?.totalPrice ?? 0)
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <BillSummaryPanel
          billingDetails={billingDetails}
          billType={type}
          cancelHref={listPath}
          hasVendor={!!vendor}
          isEditMode={isEditMode}
          isSubmitting={isSubmitting}
          isSubmitDisabled={hasErrors}
          itemCount={lineItems.filter((lineItem) => lineItem.id).length}
          supply={supply}
        />
      </div>
    </form>
  );
}
