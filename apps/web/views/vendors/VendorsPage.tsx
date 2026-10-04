'use client';

import { ICreateVendorRequest, IVendor } from '@invoicely/api-interfaces';
import { getChangedFields } from '@invoicely/utils';
import { Users } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ConfirmDeleteDialog } from '../components/ConfirmDeleteDialog';
import ScreenLoader from '../components/loader';
import {
  createVendor,
  deleteVendor,
  getVendors,
  updateVendor,
} from '../utils/vendor';
import { VendorFormModal } from './VendorFormModal';
import { VendorsTable } from './VendorsTable';

export function VendorsPage() {
  const params = useParams();
  const companyId = params.id as string;

  const [vendors, setVendors] = useState<IVendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vendorPendingDelete, setVendorPendingDelete] =
    useState<IVendor | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<IVendor | null>(null);

  useEffect(() => {
    if (!companyId) {
      return;
    }

    void fetchVendors(companyId);
  }, [companyId]);

  const fetchVendors = async (targetCompanyId: string) => {
    const token = localStorage.getItem('invoicelyAppAuthToken') as string;

    try {
      setIsLoading(true);
      const res = await getVendors(targetCompanyId, token);
      setVendors(res.data);
    } catch (error: unknown) {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to fetch vendors'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrUpdate = async (values: ICreateVendorRequest) => {
    const token = localStorage.getItem('invoicelyAppAuthToken') as string;

    try {
      setIsSubmitting(true);

      if (selectedVendor) {
        const previousValues: ICreateVendorRequest = {
          name: selectedVendor.name,
          description: selectedVendor.description,
          email: selectedVendor.email,
          countryCode: selectedVendor.countryCode,
          mobileNumber: selectedVendor.mobileNumber,
          gstIn: selectedVendor.gstIn,
          address: selectedVendor.address,
        };
        const changedFields = getChangedFields(previousValues, values);

        if ('countryCode' in changedFields || 'mobileNumber' in changedFields) {
          changedFields.countryCode = values.countryCode;
          changedFields.mobileNumber = values.mobileNumber;
        }

        if (!Object.keys(changedFields).length) {
          toast('No changes to update');
          handleCloseModal();
          return;
        }

        const res = await updateVendor(
          companyId,
          selectedVendor._id,
          changedFields,
          token
        );
        setVendors((current) =>
          current.map((vendor) =>
            vendor._id === selectedVendor._id ? res.data : vendor
          )
        );
        toast.success(res.message || 'Vendor updated successfully');
      } else {
        const res = await createVendor(companyId, values, token);
        setVendors((current) => [res.data, ...current]);
        toast.success(res.message || 'Vendor created successfully');
      }

      handleCloseModal();
    } catch (error: unknown) {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to save vendor'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!vendorPendingDelete) {
      return;
    }

    const token = localStorage.getItem('invoicelyAppAuthToken') as string;

    try {
      setIsDeleteSubmitting(true);
      await deleteVendor(companyId, vendorPendingDelete._id, token);
      setVendors((current) =>
        current.filter(
          (currentVendor) => currentVendor._id !== vendorPendingDelete._id
        )
      );
      toast.success('Vendor deleted successfully');
      handleCloseDeleteDialog();
    } catch (error: unknown) {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to delete vendor'
      );
    } finally {
      setIsDeleteSubmitting(false);
    }
  };

  const handleOpenAddModal = () => {
    setSelectedVendor(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (vendor: IVendor) => {
    setSelectedVendor(vendor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedVendor(null);
    setIsModalOpen(false);
  };

  const handleOpenDeleteDialog = (vendor: IVendor) => {
    setVendorPendingDelete(vendor);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setVendorPendingDelete(null);
    setIsDeleteDialogOpen(false);
  };

  if (!companyId) {
    return <ScreenLoader />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm minSm:items-center dark:border-gray-800 dark:bg-[#1a1a1a]">
        <div className="flex items-center gap-3">
          <div className="hidden rounded-xl bg-indigo-50 p-2 minSm:block dark:bg-indigo-500/10">
            <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Vendors
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage vendors and customers, their GST details, and contact
              information for this company.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="shrink-0 whitespace-nowrap rounded-xl bg-indigo-600 px-4 py-2.5 font-medium text-white transition hover:bg-indigo-700"
        >
          + Add Vendor
        </button>
      </div>

      {isLoading ? (
        <ScreenLoader />
      ) : (
        <VendorsTable
          isLoading={false}
          onDelete={handleOpenDeleteDialog}
          onEdit={handleOpenEditModal}
          vendors={vendors}
        />
      )}

      <VendorFormModal
        initialVendor={selectedVendor}
        isOpen={isModalOpen}
        isSubmitting={isSubmitting}
        onClose={handleCloseModal}
        onSubmit={handleCreateOrUpdate}
      />

      <ConfirmDeleteDialog
        confirmLabel="Delete Vendor"
        description="The vendor will be removed from the list. Existing bills keep their saved vendor details."
        isDeleting={isDeleteSubmitting}
        isOpen={isDeleteDialogOpen}
        itemName={vendorPendingDelete?.name ?? null}
        subtitle="Confirm removal from your vendor list."
        title="Delete Vendor"
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
