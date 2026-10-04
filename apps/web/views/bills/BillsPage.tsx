'use client';

import { IBill, ICompany } from '@invoicely/api-interfaces';
import { BillStatus, InvoiceCopy } from '@invoicely/constants';
import { formatBillNumber } from '@invoicely/utils';
import { ReceiptText } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { ConfirmDeleteDialog } from '../components/ConfirmDeleteDialog';
import ScreenLoader from '../components/loader';
import { deleteBill, getBills, updateBill } from '../utils/bill';
import { getCompanyById } from '../utils/company';
import { getProductById } from '../utils/product';
import { getVendorById } from '../utils/vendor';
import { BillsTable } from './BillsTable';
import { downloadInvoicePdf, printInvoice } from './invoiceDocument';
import { buildInvoiceHtml } from './invoiceTemplate';

export function BillsPage() {
  const router = useRouter();
  const params = useParams();
  const companyId = params.id as string;
  const listPath = `/companies/${companyId}/sales-bills`;

  const [bills, setBills] = useState<IBill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [billPendingDelete, setBillPendingDelete] = useState<IBill | null>(
    null
  );
  const [isStatusSubmitting, setIsStatusSubmitting] = useState(false);
  const [billPendingStatusChange, setBillPendingStatusChange] =
    useState<IBill | null>(null);
  const isReissuing = billPendingStatusChange?.status === BillStatus.CANCELLED;
  const companyRef = useRef<ICompany | null>(null);

  useEffect(() => {
    if (!companyId) {
      return;
    }

    void fetchBills(companyId);
  }, [companyId]);

  const fetchBills = async (targetCompanyId: string) => {
    const token = localStorage.getItem('invoicelyAppAuthToken') as string;

    try {
      setIsLoading(true);
      const res = await getBills(targetCompanyId, token);
      setBills(res.data);
    } catch (error: unknown) {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to fetch sales bills'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!billPendingDelete) {
      return;
    }

    const token = localStorage.getItem('invoicelyAppAuthToken') as string;

    try {
      setIsDeleteSubmitting(true);
      await deleteBill(companyId, billPendingDelete._id, token);
      setBills((current) =>
        current.filter(
          (currentBill) => currentBill._id !== billPendingDelete._id
        )
      );
      toast.success('Sales bill deleted successfully');
      handleCloseDeleteDialog();
    } catch (error: unknown) {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to delete sales bill'
      );
    } finally {
      setIsDeleteSubmitting(false);
    }
  };

  const handleStatusChangeConfirm = async () => {
    if (!billPendingStatusChange) {
      return;
    }

    const token = localStorage.getItem('invoicelyAppAuthToken') as string;

    try {
      setIsStatusSubmitting(true);
      const res = await updateBill(
        companyId,
        billPendingStatusChange._id,
        { status: isReissuing ? BillStatus.ISSUED : BillStatus.CANCELLED },
        token
      );
      setBills((current) =>
        current.map((bill) =>
          bill._id === billPendingStatusChange._id ? res.data : bill
        )
      );
      toast.success(
        isReissuing
          ? 'Sales bill re-issued successfully'
          : 'Sales bill cancelled successfully'
      );
      setBillPendingStatusChange(null);
    } catch (error: unknown) {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
          (isReissuing
            ? 'Failed to re-issue sales bill'
            : 'Failed to cancel sales bill')
      );
    } finally {
      setIsStatusSubmitting(false);
    }
  };

  const fillMissingHsnCodes = async (bill: IBill, token: string) => {
    const missingProductIds = [
      ...new Set(
        bill.products
          .filter((product) => !product.hsnCode && product.id)
          .map((product) => product.id as string)
      ),
    ];

    if (!missingProductIds.length) {
      return bill;
    }

    const products = await Promise.all(
      missingProductIds.map((productId) =>
        getProductById(companyId, productId, token)
          .then((res) => res.data)
          .catch(() => null)
      )
    );
    const hsnCodeByProductId = new Map(
      products.flatMap((product) =>
        product?.hsnCode ? [[product._id, product.hsnCode] as const] : []
      )
    );

    return {
      ...bill,
      products: bill.products.map((product) => ({
        ...product,
        hsnCode:
          product.hsnCode ||
          (product.id ? hsnCodeByProductId.get(product.id) : null) ||
          null,
      })),
    };
  };

  const buildBillInvoice = async (bill: IBill, copy: InvoiceCopy) => {
    const token = localStorage.getItem('invoicelyAppAuthToken') as string;
    const vendorId = bill.billToVendorDetails?.id;

    const [companyRes, vendorRes, billWithHsnCodes] = await Promise.all([
      companyRef.current
        ? Promise.resolve(null)
        : getCompanyById(companyId, token),
      vendorId
        ? getVendorById(companyId, vendorId, token).catch(() => null)
        : Promise.resolve(null),
      fillMissingHsnCodes(bill, token),
    ]);

    if (companyRes) {
      companyRef.current = companyRes.data;
    }

    return buildInvoiceHtml({
      bill: billWithHsnCodes,
      copy,
      company: companyRef.current,
      vendor: vendorRes?.data ?? null,
    });
  };

  const handlePrint = async (bill: IBill, copy: InvoiceCopy) => {
    const toastId = toast.loading('Preparing bill for print...');

    try {
      await printInvoice(await buildBillInvoice(bill, copy));
    } catch (error: unknown) {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to print sales bill'
      );
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleDownload = async (bill: IBill, copy: InvoiceCopy) => {
    const toastId = toast.loading('Generating PDF...');

    try {
      await downloadInvoicePdf(
        await buildBillInvoice(bill, copy),
        `${formatBillNumber(bill.billNumber)}-${copy.toLowerCase()}.pdf`
      );
      toast.success('PDF downloaded', { id: toastId });
    } catch (error: unknown) {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to download PDF',
        { id: toastId }
      );
    }
  };

  const handleEdit = (bill: IBill) => {
    router.push(`${listPath}/${bill._id}/update`);
  };

  const handleOpenDeleteDialog = (bill: IBill) => {
    setBillPendingDelete(bill);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setBillPendingDelete(null);
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
            <ReceiptText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Sales Bills
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Create, print, and manage tax and proforma invoices for this
              company.
            </p>
          </div>
        </div>

        <Link
          href={`${listPath}/create`}
          className="shrink-0 whitespace-nowrap rounded-xl bg-indigo-600 px-4 py-2.5 font-medium text-white transition hover:bg-indigo-700"
        >
          + Add Sales Bill
        </Link>
      </div>

      {isLoading ? (
        <ScreenLoader />
      ) : (
        <BillsTable
          bills={bills}
          isLoading={false}
          onDelete={handleOpenDeleteDialog}
          onDownload={handleDownload}
          onEdit={handleEdit}
          onPrint={handlePrint}
          onToggleStatus={setBillPendingStatusChange}
        />
      )}

      <ConfirmDeleteDialog
        confirmLabel="Delete Bill"
        description="The sales bill will be removed from the list."
        isDeleting={isDeleteSubmitting}
        isOpen={isDeleteDialogOpen}
        itemName={
          billPendingDelete
            ? formatBillNumber(billPendingDelete.billNumber)
            : null
        }
        subtitle="Confirm removal of this sales bill."
        title="Delete Sales Bill"
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteConfirm}
      />

      <ConfirmDeleteDialog
        actionVerb={isReissuing ? 're-issue' : 'cancel'}
        confirmLabel={isReissuing ? 'Re-issue Bill' : 'Cancel Bill'}
        description={
          isReissuing
            ? 'The bill becomes Issued again and its print and PDF no longer carry the Cancelled watermark.'
            : 'The bill stays in your records marked as Cancelled, and its print and PDF carry a Cancelled watermark. You can re-issue it later.'
        }
        dismissLabel={isReissuing ? 'Keep Cancelled' : 'Keep Bill'}
        isDeleting={isStatusSubmitting}
        isOpen={!!billPendingStatusChange}
        itemName={
          billPendingStatusChange
            ? formatBillNumber(billPendingStatusChange.billNumber)
            : null
        }
        pendingLabel={isReissuing ? 'Re-issuing...' : 'Cancelling...'}
        subtitle={
          isReissuing
            ? 'Mark this cancelled sales bill as issued again.'
            : 'Mark this sales bill as cancelled.'
        }
        title={isReissuing ? 'Re-issue Sales Bill' : 'Cancel Sales Bill'}
        onClose={() => setBillPendingStatusChange(null)}
        onConfirm={handleStatusChangeConfirm}
      />
    </div>
  );
}
