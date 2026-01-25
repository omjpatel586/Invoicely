'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ICompany } from 'shared/api-interfaces/src';
import { verifyGSTNumber } from '../utils/company';

type Props = {
  companies?: ICompany[];
};

function useIsDark() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));

    const obs = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });

    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => obs.disconnect();
  }, []);

  return isDark;
}

export default function Company({ companies = [] }: Props) {
  const router = useRouter();
  const isDark = useIsDark();

  const [list, setList] = useState<ICompany[]>(companies);

  // modal
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);

  // GST form data
  const [gstin, setGstin] = useState('');
  const [legalName, setLegalName] = useState('');
  const [address, setAddress] = useState('');
  const [registrationDate, setRegistrationDate] = useState('');
  const [state, setState] = useState('');
  const [status, setStatus] = useState('');
  const [natureOfBusiness, setNatureOfBusiness] = useState<string[]>([]);
  const [taxPayerType, setTaxPayerType] = useState('');

  /* ---------------- VERIFY GSTIN ---------------- */
  async function handleVerifyGstin() {
    setError(null);

    if (gstin.length !== 15) {
      setError('GSTIN must be 15 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyGSTNumber({ gstNumber: gstin });

      const data = res.data;

      // populate verified data
      setLegalName(data.legalName || '');
      setAddress(data.headOfficeAddress || '');
      setRegistrationDate(
        new Date(data.registrationDate || new Date()).toLocaleDateString()
      );
      setState(data.stateJurisdiction || '');
      setStatus(data.status || '');
      setNatureOfBusiness(data.natureOfBusiness || []);
      setTaxPayerType(data.taxPayerType || '');

      setVerified(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- CREATE COMPANY ---------------- */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!verified) return;

    setLoading(true);
    try {
      const res = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gstIn: gstin,
          legalName,
          headOfficeAddress: address,
          registrationDate,
          stateJurisdiction: state,
          status,
          natureOfBusiness,
          taxPayerType,
        }),
      });

      const created: ICompany = await res.json();
      setList((p) => [created, ...p]);
      setOpen(false);
      router.push(`/companies/${created._id}`);
    } catch {
      setError('Failed to create company');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[60vh] px-6 py-8">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-2xl border p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Companies</h2>
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
          >
            + Add Company
          </button>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-sm">
              <th>Company Name</th>
              <th>GSTIN</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                {' '}
                <td
                  colSpan={3}
                  className={
                    'py-8 text-center ' +
                    (isDark ? 'text-gray-400' : 'text-gray-500')
                  }
                >
                  {' '}
                  No companies yet. Click{' '}
                  <span className="font-medium">Add Company</span> to create
                  one.{' '}
                </td>{' '}
              </tr>
            ) : (
              list.map((c) => (
                <tr key={c._id} className="border-b">
                  <td>
                    <Link
                      href={`/companies/${c._id}`}
                      className="text-indigo-600"
                    >
                      {c.legalName}
                    </Link>
                  </td>
                  <td>{c.gstIn}</td>
                  <td>{c.headOfficeAddress}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ---------------- MODAL ---------------- */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-xl"
          >
            <h3 className="text-lg font-semibold mb-4">Add Company</h3>

            {/* GSTIN + VERIFY */}
            <label className="block mb-3">
              GSTIN *
              <div className="flex gap-2">
                <input
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  disabled={verified}
                  className="flex-1 border rounded px-3 py-2"
                />
                {!verified ? (
                  <button
                    type="button"
                    onClick={handleVerifyGstin}
                    className="px-4 py-2 bg-indigo-600 text-white rounded"
                  >
                    Verify
                  </button>
                ) : (
                  <span className="px-4 py-2 bg-green-100 text-green-700 rounded">
                    ✓ Verified
                  </span>
                )}
              </div>
            </label>

            {/* VERIFIED DETAILS SECTION */}
            {verified && (
              <div className="mt-6 border-t pt-6 max-h-[80vh] overflow-y-auto p-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Company Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Width Field */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Legal Name
                    </label>
                    <input
                      disabled
                      value={legalName}
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  {/* Two Column Fields */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GST Registration Type
                    </label>
                    <input
                      disabled
                      value={taxPayerType}
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GST IN Status
                    </label>
                    <input
                      disabled
                      value={status}
                      className={`w-full p-2 border rounded-md font-medium ${
                        status === 'Active'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-gray-50 text-gray-600 border-gray-200'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Registration Date
                    </label>
                    <input
                      disabled
                      value={registrationDate}
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      disabled
                      value={state}
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-600"
                    />
                  </div>

                  {/* Full Width Fields */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      disabled
                      rows={2}
                      value={address}
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-600 resize-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nature of Business
                    </label>
                    <input
                      disabled
                      value={natureOfBusiness.join(', ')}
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {error && <p className="text-red-600 mt-2">{error}</p>}

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!verified || loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
              >
                Create Company
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
