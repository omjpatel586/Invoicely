'use client';

import {
  IAddress,
  IGetCompanyResponse,
  IVerifyGSTNumberResponse,
} from '@invoicely/api-interfaces';
import {
  CompanyStatus,
  ConstitutionOfBusiness,
  TaxPayerType,
} from '@invoicely/constants';
import { Building2, ChevronRight, Hash, MapPin } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ScreenLoader from '../components/loader';
import {
  createCompany,
  getUserCompanies,
  verifyGSTNumber,
} from '../utils/company';

export default function Company() {
  const token = localStorage.getItem('invoicelyAppAuthToken') as string;
  const [list, setList] = useState<IGetCompanyResponse[]>([]);

  // modal
  const [open, setOpen] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    setLoading(true);
    getUserCompanies(token).then((res) => {
      setLoading(false);
      setList(res.data);
    });
  }, []);

  // GST form data
  const [gstIn, setGstIn] = useState('');
  const [companyDetails, setCompanyDetails] =
    useState<IVerifyGSTNumberResponse>();

  /* ---------------- VERIFY GST IN ---------------- */
  async function handleVerifyGstIn() {
    setError(null);

    if (gstIn.length !== 15) {
      setError('GSTIN must be 15 characters');
      return;
    }

    setButtonLoading(true);
    try {
      const res = await verifyGSTNumber({ gstNumber: gstIn }, token);

      const data = res.data;

      setCompanyDetails(data);

      setVerified(true);
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError(err.response?.data?.message);
      } else {
        setError('Something went wrong. Please try again later');
      }
    } finally {
      setButtonLoading(false);
    }
  }

  /* ---------------- CREATE COMPANY ---------------- */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!verified) return;

    setButtonLoading(true);
    try {
      const res = await createCompany(
        {
          gstIn: gstIn,
          legalName: companyDetails?.legalName || '',
          tradeName: companyDetails?.tradeName || '',
          constitutionOfBusiness:
            companyDetails?.constitutionOfBusiness as ConstitutionOfBusiness,
          headOfficeAddress: companyDetails?.headOfficeAddress || '',
          headOfficeSplitAddress:
            companyDetails?.headOfficeSplitAddress as IAddress,
          branches: companyDetails?.branches || [],
          registrationDate: companyDetails?.registrationDate || new Date(),
          stateJurisdiction: companyDetails?.stateJurisdiction || '',
          centerJurisdiction: companyDetails?.centerJurisdiction || '',
          status: companyDetails?.status || CompanyStatus.ACTIVE,
          natureOfBusiness: companyDetails?.natureOfBusiness || [],
          taxPayerType: companyDetails?.taxPayerType || TaxPayerType.REGULAR,
        },
        token
      );

      const created: IGetCompanyResponse = res.data;
      toast.success(res.message);
      setList((p) => [created, ...p]);
      setOpen(false);
      setVerified(false);
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.error(
          error.response?.data?.message || 'Failed to create company'
        );
      } else {
        toast.error('Something went wrong. Please try again later');
      }
    } finally {
      setButtonLoading(false);
    }
  }

  // cancel model
  function onCancelModel() {
    setOpen(false);
    setVerified(false);
  }

  if (loading) {
    return <ScreenLoader />;
  }

  return (
    <div className="min-h-[60vh] px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 1. PAGE HEADER (Responsive sizing) */}
        <div className="flex flex-row justify-between items-center bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg hidden sm:block">
              <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Companies
            </h2>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-sm font-medium whitespace-nowrap text-sm sm:text-base"
          >
            + Add Company
          </button>
        </div>

        {/* MAIN CONTENT AREA */}
        {list.length === 0 ? (
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center shadow-sm">
            <Building2 className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No companies found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Get started by adding your first company to the dashboard.
            </p>
            <button
              onClick={() => setOpen(true)}
              className="px-4 py-2 text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg font-medium hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
            >
              Add New Company
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {list.map((c) => (
              <Link
                href={`/companies/${c._id}`}
                key={c._id}
                className="group block bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm active:scale-[0.98] transition-all hover:border-indigo-500/50"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-indigo-600 dark:text-indigo-400 text-lg pr-4 leading-tight group-hover:underline">
                    {c.legalName}
                  </h3>
                  <div className="bg-gray-50 dark:bg-[#262626] p-1.5 rounded-full shrink-0 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/20 transition-colors">
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-500" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <div className="w-7 flex justify-center shrink-0">
                      <Hash className="w-4 h-4 text-gray-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-mono tracking-wide bg-gray-50 dark:bg-[#262626] px-2 py-0.5 rounded">
                      {c.gstIn}
                    </span>
                  </div>

                  <div className="flex items-start text-sm">
                    <div className="w-7 flex justify-center shrink-0 pt-0.5">
                      <MapPin className="w-4 h-4 text-gray-400" />
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {c.headOfficeAddress}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ---------------- MODAL ---------------- */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-xl max-h-[90vh] flex flex-col"
          >
            <h3 className="text-lg font-semibold mb-4">Add Company</h3>

            {/* GSTIN + VERIFY */}
            <label className="block mb-3">
              GSTIN *
              <div className="flex gap-2">
                <input
                  value={gstIn}
                  onChange={(e) => setGstIn(e.target.value)}
                  disabled={verified}
                  className="flex-1 border rounded px-3 py-2"
                />
                {!verified ? (
                  <button
                    type="button"
                    onClick={handleVerifyGstIn}
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
              <div className="mt-6 border-t pt-6 flex-1 overflow-y-auto p-6">
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
                      value={companyDetails?.legalName}
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
                      value={companyDetails?.taxPayerType}
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GST IN Status
                    </label>
                    <input
                      disabled
                      value={companyDetails?.status}
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
                      value={new Date(
                        companyDetails?.registrationDate || ''
                      ).toLocaleDateString()}
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      disabled
                      value={companyDetails?.stateJurisdiction}
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
                      value={companyDetails?.headOfficeAddress}
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-600 resize-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nature of Business
                    </label>
                    <input
                      disabled
                      value={companyDetails?.natureOfBusiness?.join(', ')}
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
                onClick={onCancelModel}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!verified || buttonLoading}
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
