'use client';

import {
  ICreateVendorRequest,
  IVendor,
  IVendorAddress,
  IVerifyGSTNumberResponse,
} from '@invoicely/api-interfaces';
import { BadgeCheck, Loader2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  COUNTRY_CODE_PATTERN,
  EMAIL_PATTERN,
  GSTIN_PATTERN,
  MOBILE_NUMBER_PATTERN,
  INDIAN_STATES,
  IndianState,
  PIN_CODE_PATTERN,
} from '@invoicely/constants';
import { useFormErrors } from '../hooks/useFormErrors';
import { verifyGSTNumber } from '../utils/company';

interface VendorFormModalProps {
  initialVendor: IVendor | null;
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: ICreateVendorRequest) => void;
}

type VendorAddressValues = { [K in keyof IVendorAddress]: string };

interface VendorFormValues {
  name: string;
  description: string;
  email: string;
  countryCode: string;
  mobileNumber: string;
  gstIn: string;
  address: VendorAddressValues;
}

interface FormErrors {
  gstIn?: string;
  name?: string;
  description?: string;
  email?: string;
  mobileNumber?: string;
  line1?: string;
  city?: string;
  state?: string;
  pinCode?: string;
}

const defaultValues: VendorFormValues = {
  name: '',
  description: '',
  email: '',
  countryCode: '+91',
  mobileNumber: '',
  gstIn: '',
  address: {
    line1: '',
    city: '',
    state: '',
    pinCode: '',
  },
};

const inputClassName =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-indigo-500 dark:border-gray-700 dark:bg-[#101010] dark:text-white';

const labelClassName =
  'mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300';

const joinAddressParts = (parts: Array<string | undefined>) =>
  parts.filter((part) => part && part.trim()).join(', ');

const toVendorValuesFromGst = (
  gstDetails: IVerifyGSTNumberResponse
): Pick<VendorFormValues, 'name' | 'address'> => {
  const split = gstDetails.headOfficeSplitAddress;
  const line1 =
    joinAddressParts([
      split?.flatNumber,
      split?.buildingNumber,
      split?.buildingName,
      split?.street,
      split?.location,
    ]) ||
    gstDetails.headOfficeAddress ||
    '';

  return {
    name: gstDetails.tradeName || gstDetails.legalName || '',
    address: {
      line1,
      city: split?.city || split?.district || '',
      state: split?.state || '',
      pinCode: split?.pincode || '',
    },
  };
};

const getVendorErrors = (values: VendorFormValues): FormErrors => {
  const errors: FormErrors = {};
  const gstIn = values.gstIn.trim().toUpperCase();
  const mobileNumber = values.mobileNumber.trim();

  if (!gstIn) {
    errors.gstIn = 'GSTIN is required';
  } else if (!GSTIN_PATTERN.test(gstIn)) {
    errors.gstIn = 'Enter a valid GSTIN such as 24ABCDE1234F1Z5';
  }

  if (!values.name.trim()) {
    errors.name = 'Vendor name is required';
  }

  if (!values.description.trim()) {
    errors.description = 'Description is required';
  }

  if (values.email.trim() && !EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Enter a valid email address';
  }

  if (mobileNumber) {
    if (!COUNTRY_CODE_PATTERN.test(values.countryCode.trim())) {
      errors.mobileNumber = 'Enter a country code such as +91';
    } else if (!MOBILE_NUMBER_PATTERN.test(mobileNumber)) {
      errors.mobileNumber = 'Enter a valid 10 digit mobile number';
    }
  }

  if (!values.address.line1.trim()) {
    errors.line1 = 'Address is required';
  }

  if (!values.address.city.trim()) {
    errors.city = 'City is required';
  }

  if (!INDIAN_STATES.includes(values.address.state as IndianState)) {
    errors.state = 'Select a state';
  }

  if (!PIN_CODE_PATTERN.test(values.address.pinCode.trim())) {
    errors.pinCode = 'Enter a valid 6 digit PIN code';
  }

  return errors;
};

export function VendorFormModal({
  initialVendor,
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
}: VendorFormModalProps) {
  const [values, setValues] = useState<VendorFormValues>(defaultValues);
  const [isVerifyingGst, setIsVerifyingGst] = useState(false);
  const [verifiedGstIn, setVerifiedGstIn] = useState<string | null>(null);
  const [gstVerifyError, setGstVerifyError] = useState<string | null>(null);

  const isEditMode = useMemo(() => !!initialVendor, [initialVendor]);
  const { visibleErrors, hasErrors, markTouched, resetTouched } = useFormErrors(
    getVendorErrors(values),
    isEditMode
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setVerifiedGstIn(null);
    setGstVerifyError(null);
    resetTouched();

    if (initialVendor) {
      setValues({
        name: initialVendor.name,
        description: initialVendor.description ?? '',
        email: initialVendor.email ?? '',
        countryCode: initialVendor.countryCode ?? '',
        mobileNumber: initialVendor.mobileNumber ?? '',
        gstIn: initialVendor.gstIn ?? '',
        address: {
          line1: initialVendor.address?.line1 ?? '',
          city: initialVendor.address?.city ?? '',
          state: initialVendor.address?.state ?? '',
          pinCode: initialVendor.address?.pinCode ?? '',
        },
      });
      return;
    }

    setValues(defaultValues);
  }, [initialVendor, isOpen, resetTouched]);

  if (!isOpen) {
    return null;
  }

  const handleVerifyGstIn = async () => {
    const gstIn = values.gstIn.trim().toUpperCase();
    markTouched('gstIn');

    if (!GSTIN_PATTERN.test(gstIn)) {
      return;
    }

    const token = localStorage.getItem('invoicelyAppAuthToken') as string;

    try {
      setIsVerifyingGst(true);
      const res = await verifyGSTNumber({ gstNumber: gstIn }, token);
      const gstValues = toVendorValuesFromGst(res.data);

      setValues((previous) => ({
        ...previous,
        gstIn,
        name: gstValues.name || previous.name,
        address: {
          line1: gstValues.address.line1 || previous.address.line1,
          city: gstValues.address.city || previous.address.city,
          state: gstValues.address.state || previous.address.state,
          pinCode: gstValues.address.pinCode || previous.address.pinCode,
        },
      }));
      setVerifiedGstIn(gstIn);
      setGstVerifyError(null);
      (['name', 'line1', 'city', 'state', 'pinCode'] as const).forEach(
        markTouched
      );
    } catch (error: unknown) {
      setGstVerifyError(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Could not verify this GSTIN. Please try again.'
      );
    } finally {
      setIsVerifyingGst(false);
    }
  };

  const handleChange = (
    field: Exclude<keyof VendorFormValues, 'address'>,
    value: string
  ) => {
    setValues((previous) => ({
      ...previous,
      [field]: value,
    }));
    markTouched(field === 'countryCode' ? 'mobileNumber' : field);
  };

  const handleAddressChange = (
    field: keyof VendorAddressValues,
    value: string
  ) => {
    setValues((previous) => ({
      ...previous,
      address: {
        ...previous.address,
        [field]: value,
      },
    }));
    markTouched(field);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (hasErrors) {
      return;
    }

    const mobileNumber = values.mobileNumber.trim();

    onSubmit({
      name: values.name.trim(),
      description: values.description.trim(),
      email: values.email.trim() || null,
      countryCode: mobileNumber ? values.countryCode.trim() : null,
      mobileNumber: mobileNumber || null,
      gstIn: values.gstIn.trim().toUpperCase(),
      address: {
        line1: values.address.line1.trim(),
        city: values.address.city.trim(),
        state: values.address.state as IndianState,
        pinCode: values.address.pinCode.trim(),
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/55 p-4 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center py-6">
        <div className="w-full max-w-2xl rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-[#161616]">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 dark:border-gray-800">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {isEditMode ? 'Edit Vendor' : 'Add Vendor'}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage vendor contact, GST, and address details.
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
                <label className={labelClassName}>GSTIN *</label>
                <div className="flex gap-2">
                  <input
                    value={values.gstIn}
                    onChange={(event) => {
                      handleChange('gstIn', event.target.value.toUpperCase());
                      setVerifiedGstIn(null);
                      setGstVerifyError(null);
                    }}
                    placeholder="e.g. 24ABCDE1234F1Z5"
                    maxLength={15}
                    className={inputClassName}
                  />
                  {verifiedGstIn && verifiedGstIn === values.gstIn ? (
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-emerald-50 px-4 text-sm font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <BadgeCheck className="h-4 w-4" />
                      Verified
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleVerifyGstIn}
                      disabled={isVerifyingGst || !values.gstIn.trim()}
                      className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl bg-indigo-600 px-4 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isVerifyingGst && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                      {isVerifyingGst ? 'Verifying...' : 'Verify & Fill'}
                    </button>
                  )}
                </div>
                {gstVerifyError || visibleErrors.gstIn ? (
                  <p className="mt-2 text-sm text-red-600">
                    {gstVerifyError || visibleErrors.gstIn}
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Verify the GSTIN to fill the vendor name and address from
                    the GST registry.
                  </p>
                )}
              </div>

              <div className="minMd:col-span-2">
                <label className={labelClassName}>Vendor Name *</label>
                <input
                  value={values.name}
                  onChange={(event) => handleChange('name', event.target.value)}
                  placeholder="e.g. Shree Traders"
                  className={inputClassName}
                />
                {visibleErrors.name && (
                  <p className="mt-2 text-sm text-red-600">
                    {visibleErrors.name}
                  </p>
                )}
              </div>

              <div className="minMd:col-span-2">
                <label className={labelClassName}>Description *</label>
                <textarea
                  value={values.description}
                  onChange={(event) =>
                    handleChange('description', event.target.value)
                  }
                  rows={2}
                  placeholder="e.g. Preferred raw material supplier"
                  className={inputClassName}
                />
                {visibleErrors.description && (
                  <p className="mt-2 text-sm text-red-600">
                    {visibleErrors.description}
                  </p>
                )}
              </div>

              <div className="minMd:col-span-2">
                <label className={labelClassName}>Email</label>
                <input
                  value={values.email}
                  onChange={(event) =>
                    handleChange('email', event.target.value)
                  }
                  placeholder="e.g. contact@shreetraders.com"
                  inputMode="email"
                  className={inputClassName}
                />
                {visibleErrors.email && (
                  <p className="mt-2 text-sm text-red-600">
                    {visibleErrors.email}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-[6rem_1fr] gap-3 minMd:col-span-2">
                <div>
                  <label className={labelClassName}>Code</label>
                  <input
                    value={values.countryCode}
                    onChange={(event) =>
                      handleChange('countryCode', event.target.value)
                    }
                    placeholder="+91"
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label className={labelClassName}>Mobile Number</label>
                  <input
                    value={values.mobileNumber}
                    onChange={(event) =>
                      handleChange('mobileNumber', event.target.value)
                    }
                    placeholder="e.g. 9876543210"
                    inputMode="numeric"
                    className={inputClassName}
                  />
                  {visibleErrors.mobileNumber && (
                    <p className="mt-2 text-sm text-red-600">
                      {visibleErrors.mobileNumber}
                    </p>
                  )}
                </div>
              </div>

              <div className="minMd:col-span-2">
                <label className={labelClassName}>Address *</label>
                <input
                  value={values.address.line1}
                  onChange={(event) =>
                    handleAddressChange('line1', event.target.value)
                  }
                  placeholder="e.g. Shop 12, Market Yard"
                  className={inputClassName}
                />
                {visibleErrors.line1 && (
                  <p className="mt-2 text-sm text-red-600">
                    {visibleErrors.line1}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClassName}>City *</label>
                <input
                  value={values.address.city}
                  onChange={(event) =>
                    handleAddressChange('city', event.target.value)
                  }
                  placeholder="e.g. Surat"
                  className={inputClassName}
                />
                {visibleErrors.city && (
                  <p className="mt-2 text-sm text-red-600">
                    {visibleErrors.city}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClassName}>State *</label>
                <select
                  value={values.address.state}
                  onChange={(event) =>
                    handleAddressChange('state', event.target.value)
                  }
                  className={inputClassName}
                >
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {visibleErrors.state && (
                  <p className="mt-2 text-sm text-red-600">
                    {visibleErrors.state}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClassName}>PIN Code *</label>
                <input
                  value={values.address.pinCode}
                  onChange={(event) =>
                    handleAddressChange('pinCode', event.target.value)
                  }
                  placeholder="e.g. 395003"
                  inputMode="numeric"
                  className={inputClassName}
                />
                {visibleErrors.pinCode && (
                  <p className="mt-2 text-sm text-red-600">
                    {visibleErrors.pinCode}
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
                  ? 'Update Vendor'
                  : 'Add Vendor'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
