# Products Module — Frontend Integration Guide

> **Scope:** `apps/web` — Next.js App Router  
> **Route:** `(dashboard)/companies/[id]/products/`  
> **API Base:** `/api/companies/:companyId/products`  
> **Auth:** All endpoints require `Authorization: Bearer <authToken>`

---

## 1. File Structure

```
apps/web/
├── app/
│   └── (dashboard)/
│       └── companies/
│           └── [id]/
│               └── products/
│                   └── page.tsx               # Products list page
│
├── views/
│   └── products/
│       ├── index.ts                           # Barrel export
│       ├── ProductsPage.tsx                   # Page-level view component
│       ├── ProductsTable.tsx                  # Table with columns config
│       ├── ProductFormModal.tsx               # Add / Edit modal
│
├── libs/
│   ├── api/
│   │   └── products.api.ts                    # Axios API calls
│   └── types/
│       └── product.types.ts                   # Interfaces & enums
```

---

## 2. Types & Interfaces

**Folder:** `apps/shared/constants`

```typescript
// ── Enums ────────────────────────────────────────────────────────────────────

export enum GstSlab {
  Zero = '0',
  Five = '5',
  Twelve = '12',
  Eighteen = '18',
  TwentyEight = '28',
}

export enum ProductUnit {
  Kg = 'kg',
  Litre = 'litre',
  Gram = 'gram',
  Pcs = 'pcs',
}

// ── Core Interface ────────────────────────────────────────────────────────────

export interface IProduct {
  _id: string;
  name: string;
  description?: string;
  hsnCode: string;
  gstSlab: GstSlab;
  unit: ProductUnit;
  unitPrice: string; // monetary — always string
  isActive: boolean;
  company: string; // company ObjectId ref
}

// ── Request Payloads ─────────────────────────────────────────────────────────

export interface CreateProductPayload {
  name: string;
  description?: string;
  hsnCode: string;
  gstSlab: GstSlab;
  unit: ProductUnit;
  unitPrice: string; // send as string e.g. "120.50"
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {}

// ── API Response Wrappers ────────────────────────────────────────────────────

export interface ProductApiResponse {
  statusCode: number;
  message: string;
  data: IProduct;
}

export interface ProductListApiResponse {
  statusCode: number;
  message: string;
  data: IProduct[];
}
```

---

## 3. Axios API Layer

**File:** `apps/web/libs/api/products.api.ts`

> Uses the existing `axiosInstance` already set up in `views/utils`.

```typescript
import axiosInstance from '@/libs/axiosInstance';
import {
  CreateProductPayload,
  UpdateProductPayload,
  ProductApiResponse,
  ProductListApiResponse,
} from '@/libs/types/product.types';

const productRoute = (companyId: string, productId?: string) =>
  productId
    ? `/companies/${companyId}/products/${productId}`
    : `/companies/${companyId}/products`;

// ── Create ───────────────────────────────────────────────────────────────────

export const createProduct = async (
  companyId: string,
  payload: CreateProductPayload
): Promise<ProductApiResponse> => {
  const { data } = await axiosInstance.post<ProductApiResponse>(
    productRoute(companyId),
    payload
  );
  return data;
};

// ── Get All (active only) ────────────────────────────────────────────────────

export const getProducts = async (
  companyId: string
): Promise<ProductListApiResponse> => {
  const { data } = await axiosInstance.get<ProductListApiResponse>(
    productRoute(companyId)
  );
  return data;
};

// ── Get By ID ────────────────────────────────────────────────────────────────

export const getProductById = async (
  companyId: string,
  productId: string
): Promise<ProductApiResponse> => {
  const { data } = await axiosInstance.get<ProductApiResponse>(
    productRoute(companyId, productId)
  );
  return data;
};

// ── Update ───────────────────────────────────────────────────────────────────

export const updateProduct = async (
  companyId: string,
  productId: string,
  payload: UpdateProductPayload
): Promise<ProductApiResponse> => {
  const { data } = await axiosInstance.patch<ProductApiResponse>(
    productRoute(companyId, productId),
    payload
  );
  return data;
};

// ── Delete (soft) ────────────────────────────────────────────────────────────

export const deleteProduct = async (
  companyId: string,
  productId: string
): Promise<void> => {
  await axiosInstance.delete(productRoute(companyId, productId));
};
```

---

## 4. API calling

**File:** `apps/web/views/utils/product.ts`
create a file same flow like `company.ts`

---

## 5. Products Table — Column Config

**File:** `apps/web/views/products/ProductsTable.tsx`

```typescript
import { IProduct, GstSlab, ProductUnit } from '@/libs/types/product.types';
import { useProductStore } from './useProductStore';

// ── Column definitions ────────────────────────────────────────────────────────
// Adapt to whichever table library the project uses (e.g. TanStack Table).

export const productColumns = [
  {
    key: 'name',
    header: 'Product Name',
    render: (row: IProduct) => row.name,
  },
  {
    key: 'hsnCode',
    header: 'HSN Code',
    render: (row: IProduct) => row.hsnCode,
  },
  {
    key: 'unit',
    header: 'Unit',
    render: (row: IProduct) => row.unit.toUpperCase(),
  },
  {
    key: 'unitPrice',
    header: 'Unit Price (₹)',
    render: (row: IProduct) =>
      new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
      }).format(parseFloat(row.unitPrice)),
  },
  {
    key: 'gstSlab',
    header: 'GST %',
    render: (row: IProduct) => `${row.gstSlab}%`,
  },
  {
    key: 'description',
    header: 'Description',
    render: (row: IProduct) => row.description ?? '—',
  },
  {
    key: 'actions',
    header: 'Actions',
    // Wire up your Edit / Delete buttons to store actions
  },
];

// ── Component skeleton ────────────────────────────────────────────────────────

export function ProductsTable({ companyId }: { companyId: string }) {
  const { products, isLoading, openEditModal, removeProduct } =
    useProductStore();

  if (isLoading) return <p>Loading products…</p>;

  return (
    <table>
      <thead>
        <tr>
          {productColumns.map((col) => (
            <th key={col.key}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product._id}>
            {productColumns.map((col) => (
              <td key={col.key}>
                {col.key === 'actions' ? (
                  <>
                    <button onClick={() => openEditModal(product)}>Edit</button>
                    <button
                      onClick={() => removeProduct(companyId, product._id)}
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  col.render(product)
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

## 6. Product Form Modal

**File:** `apps/web/views/products/ProductFormModal.tsx`

Maps directly to `CreateProductDto` / `UpdateProductPayload`.

```typescript
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  GstSlab,
  ProductUnit,
  CreateProductPayload,
} from '@/libs/types/product.types';
import { useProductStore } from './useProductStore';

interface Props {
  companyId: string;
}

export function ProductFormModal({ companyId }: Props) {
  const {
    isModalOpen,
    isEditMode,
    isSubmitting,
    selectedProduct,
    addProduct,
    editProduct,
    closeModal,
  } = useProductStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProductPayload>();

  // Pre-fill form in edit mode
  useEffect(() => {
    if (isEditMode && selectedProduct) {
      reset({
        name: selectedProduct.name,
        description: selectedProduct.description,
        hsnCode: selectedProduct.hsnCode,
        gstSlab: selectedProduct.gstSlab,
        unit: selectedProduct.unit,
        unitPrice: selectedProduct.unitPrice,
      });
    } else {
      reset({});
    }
  }, [isEditMode, selectedProduct, reset]);

  const onSubmit = (values: CreateProductPayload) => {
    if (isEditMode && selectedProduct) {
      editProduct(companyId, selectedProduct._id, values);
    } else {
      addProduct(companyId, values);
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{isEditMode ? 'Edit Product' : 'Add Product'}</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* ── Name ─────────────────────────────────────── */}
          <label>Product Name *</label>
          <input
            {...register('name', { required: 'Product name is required' })}
            placeholder="e.g. Basmati Rice"
          />
          {errors.name && <span>{errors.name.message}</span>}

          {/* ── Description ──────────────────────────────── */}
          <label>Description</label>
          <textarea
            {...register('description')}
            placeholder="Optional product description"
          />

          {/* ── HSN Code ─────────────────────────────────── */}
          <label>HSN Code *</label>
          <input
            {...register('hsnCode', { required: 'HSN code is required' })}
            placeholder="e.g. 100630"
          />
          {errors.hsnCode && <span>{errors.hsnCode.message}</span>}

          {/* ── GST Slab ─────────────────────────────────── */}
          <label>GST Slab *</label>
          <select
            {...register('gstSlab', { required: 'GST slab is required' })}
          >
            <option value="">Select GST %</option>
            {Object.entries(GstSlab).map(([label, value]) => (
              <option key={value} value={value}>
                {value}%
              </option>
            ))}
          </select>
          {errors.gstSlab && <span>{errors.gstSlab.message}</span>}

          {/* ── Unit ─────────────────────────────────────── */}
          <label>Unit *</label>
          <select {...register('unit', { required: 'Unit is required' })}>
            <option value="">Select unit</option>
            {Object.entries(ProductUnit).map(([label, value]) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          {errors.unit && <span>{errors.unit.message}</span>}

          {/* ── Unit Price ───────────────────────────────── */}
          <label>Unit Price (₹) *</label>
          <input
            {...register('unitPrice', {
              required: 'Unit price is required',
              pattern: {
                value: /^\d+(\.\d{1,2})?$/,
                message: 'Enter a valid price (e.g. 120.50)',
              },
            })}
            placeholder="e.g. 120.50"
            inputMode="decimal"
          />
          {errors.unitPrice && <span>{errors.unitPrice.message}</span>}

          {/* ── Actions ──────────────────────────────────── */}
          <div className="modal-actions">
            <button type="button" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? 'Saving…'
                : isEditMode
                ? 'Update Product'
                : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

---

## 7. Page — Wiring It All Together

**File:** `apps/web/app/(dashboard)/companies/[id]/products/page.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useProductStore } from '@/views/products/useProductStore';
import { ProductsTable } from '@/views/products/ProductsTable';
import { ProductFormModal } from '@/views/products/ProductFormModal';

export default function ProductsPage() {
  const { id: companyId } = useParams<{ id: string }>();
  const { fetchProducts, openAddModal } = useProductStore();

  useEffect(() => {
    if (companyId) fetchProducts(companyId);
  }, [companyId]);

  return (
    <section>
      <div className="page-header">
        <h1>Products</h1>
        <button onClick={openAddModal}>+ Add Product</button>
      </div>

      <ProductsTable companyId={companyId} />
      <ProductFormModal companyId={companyId} />
    </section>
  );
}
```

---

## 8. API Endpoint Reference (Products Only)

| Method   | Endpoint                                        | Payload / Notes                         |
| -------- | ----------------------------------------------- | --------------------------------------- |
| `POST`   | `/api/companies/:companyId/products`            | `CreateProductPayload` — all fields     |
| `GET`    | `/api/companies/:companyId/products`            | Returns active products only            |
| `GET`    | `/api/companies/:companyId/products/:productId` | Single product by ID                    |
| `PATCH`  | `/api/companies/:companyId/products/:productId` | `UpdateProductPayload` — partial fields |
| `DELETE` | `/api/companies/:companyId/products/:productId` | Soft delete — sets `isActive: false`    |

---

## 9. Key Rules & Gotchas

| Rule                   | Detail                                                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Money as strings**   | `unitPrice` must always be sent and stored as a string (`"120.50"`, not `120.50`)                                         |
| **GST slab as string** | In the product payload `gstSlab` is a string (`"5"`). Note: in Bill products it's a number — don't mix them               |
| **Soft delete**        | `DELETE` sets `isActive: false`; the record stays in DB. GET returns active-only so deleted items disappear automatically |
| **Company scope**      | Every product endpoint requires `:companyId` in the path — always read it from route params                               |
| **Auth header**        | Every call needs `Authorization: Bearer <authToken>` — handled by your `axiosInstance` interceptor                        |
| **HSN Code**           | Free-text string — no strict format enforced on the frontend, but typically 4–8 digits                                    |
