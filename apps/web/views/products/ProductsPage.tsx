'use client';

import { ICreateProductRequest, IProduct } from '@invoicely/api-interfaces';
import { getChangedFields } from '@invoicely/utils';
import { Package } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ConfirmDeleteDialog } from '../components/ConfirmDeleteDialog';
import ScreenLoader from '../components/loader';
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from '../utils/product';
import { ProductFormModal } from './ProductFormModal';
import { ProductsTable } from './ProductsTable';

export function ProductsPage() {
  const params = useParams();
  const companyId = params.id as string;

  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productPendingDelete, setProductPendingDelete] =
    useState<IProduct | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  useEffect(() => {
    if (!companyId) {
      return;
    }

    void fetchProducts(companyId);
  }, [companyId]);

  const fetchProducts = async (targetCompanyId: string) => {
    const token = localStorage.getItem('invoicelyAppAuthToken') as string;

    try {
      setIsLoading(true);
      const res = await getProducts(targetCompanyId, token);
      setProducts(res.data);
    } catch (error: unknown) {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to fetch products'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrUpdate = async (values: ICreateProductRequest) => {
    const token = localStorage.getItem('invoicelyAppAuthToken') as string;

    try {
      setIsSubmitting(true);

      if (selectedProduct) {
        const previousValues: ICreateProductRequest = {
          name: selectedProduct.name,
          description: selectedProduct.description || '',
          hsnCode: selectedProduct.hsnCode || '',
          gstSlab: selectedProduct.gstSlab,
          unit: selectedProduct.unit,
          unitPrice: selectedProduct.unitPrice,
        };
        const changedFields = getChangedFields(previousValues, values);

        if (!Object.keys(changedFields).length) {
          toast('No changes to update');
          handleCloseModal();
          return;
        }

        const res = await updateProduct(
          companyId,
          selectedProduct._id,
          changedFields,
          token
        );
        setProducts((current) =>
          current.map((product) =>
            product._id === selectedProduct._id ? res.data : product
          )
        );
        toast.success(res.message || 'Product updated successfully');
      } else {
        const res = await createProduct(companyId, values, token);
        setProducts((current) => [res.data, ...current]);
        toast.success(res.message || 'Product created successfully');
      }

      handleCloseModal();
    } catch (error: unknown) {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to save product'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!productPendingDelete) {
      return;
    }

    const token = localStorage.getItem('invoicelyAppAuthToken') as string;

    try {
      setIsDeleteSubmitting(true);
      await deleteProduct(companyId, productPendingDelete._id, token);
      setProducts((current) =>
        current.filter(
          (currentProduct) => currentProduct._id !== productPendingDelete._id
        )
      );
      toast.success('Product deleted successfully');
      handleCloseDeleteDialog();
    } catch (error: unknown) {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to delete product'
      );
    } finally {
      setIsDeleteSubmitting(false);
    }
  };

  const handleOpenAddModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: IProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleOpenDeleteDialog = (product: IProduct) => {
    setProductPendingDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setProductPendingDelete(null);
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
            <Package className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Products
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage product catalog, units, GST slabs, and pricing for this
              company.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="shrink-0 whitespace-nowrap rounded-xl bg-indigo-600 px-4 py-2.5 font-medium text-white transition hover:bg-indigo-700"
        >
          + Add Product
        </button>
      </div>

      {isLoading ? (
        <ScreenLoader />
      ) : (
        <ProductsTable
          isLoading={false}
          onDelete={handleOpenDeleteDialog}
          onEdit={handleOpenEditModal}
          products={products}
        />
      )}

      <ProductFormModal
        initialProduct={selectedProduct}
        isOpen={isModalOpen}
        isSubmitting={isSubmitting}
        onClose={handleCloseModal}
        onSubmit={handleCreateOrUpdate}
      />

      <ConfirmDeleteDialog
        confirmLabel="Delete Product"
        description="The product will permanently disappear from the list."
        isDeleting={isDeleteSubmitting}
        isOpen={isDeleteDialogOpen}
        itemName={productPendingDelete?.name ?? null}
        subtitle="Confirm removal from the active catalog."
        title="Delete Product"
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
