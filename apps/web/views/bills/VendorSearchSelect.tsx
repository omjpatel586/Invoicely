'use client';

import { IBillVendorSnapshot, IVendor } from '@invoicely/api-interfaces';
import { ChevronDown, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { getVendors } from '../utils/vendor';

interface VendorSearchSelectProps {
  companyId: string;
  error?: string;
  value: IBillVendorSnapshot | null;
  onChange: (vendor: IVendor | null) => void;
}

const SEARCH_DEBOUNCE_MS = 300;

export function VendorSearchSelect({
  companyId,
  error,
  value,
  onChange,
}: VendorSearchSelectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const latestRequest = useRef(0);
  const [query, setQuery] = useState(value?.name ?? '');
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [vendors, setVendors] = useState<IVendor[]>([]);

  useEffect(() => {
    if (value) {
      setQuery(value.name ?? '');
    }
  }, [value]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const requestId = ++latestRequest.current;
    const search = value && query === value.name ? '' : query;

    const timeout = setTimeout(async () => {
      const token = localStorage.getItem('invoicelyAppAuthToken') as string;

      try {
        setIsSearching(true);
        const res = await getVendors(companyId, token, search);

        if (requestId === latestRequest.current) {
          setVendors(res.data);
        }
      } catch (error: unknown) {
        toast.error(
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || 'Failed to search vendors'
        );
      } finally {
        if (requestId === latestRequest.current) {
          setIsSearching(false);
        }
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [companyId, isOpen, query, value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setQuery(value?.name ?? '');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [value]);

  const handleQueryChange = (nextQuery: string) => {
    setQuery(nextQuery);
    setIsOpen(true);

    if (value) {
      onChange(null);
    }
  };

  const handleSelect = (vendor: IVendor) => {
    onChange(vendor);
    setQuery(vendor.name);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange(null);
    setQuery('');
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={query}
          onChange={(event) => handleQueryChange(event.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search vendor by name, GSTIN, or mobile"
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-11 text-gray-900 outline-none transition focus:border-indigo-500 dark:border-gray-700 dark:bg-[#101010] dark:text-white"
        />
        {query ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            title="Clear vendor"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        )}
      </div>

      {isOpen && (
        <div className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white py-1 shadow-xl dark:border-gray-800 dark:bg-[#161616]">
          {isSearching && !vendors.length ? (
            <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              Searching vendors...
            </p>
          ) : !vendors.length ? (
            <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              No vendors found. Add one from the Vendors page.
            </p>
          ) : (
            vendors.map((vendor) => (
              <button
                key={vendor._id}
                type="button"
                onClick={() => handleSelect(vendor)}
                className={`block w-full px-4 py-2.5 text-left transition hover:bg-gray-50 dark:hover:bg-white/5 ${
                  vendor._id === value?.id
                    ? 'bg-indigo-50 dark:bg-indigo-500/10'
                    : ''
                }`}
              >
                <p className="font-medium text-gray-900 dark:text-white">
                  {vendor.name}
                </p>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {[vendor.gstIn, vendor.mobileNumber, vendor.address?.city]
                    .filter(Boolean)
                    .join(' | ') || 'No GSTIN or contact details'}
                </p>
              </button>
            ))
          )}
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
