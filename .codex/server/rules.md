# Core Modules Implementation Guide

**Project:** Invoicely — Smart Invoicing & Business Management
**Scope:** Products, Vendors, and Bills Modules
**Architecture:** Multi-Tenant SaaS (Company-Scoped)

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Coding Standards](#coding-standards)
4. [Architecture Review & Recommendations](#architecture-review--recommendations)
5. [Schema Definitions](#schema-definitions)
   - [Products](#1-products-schema)
   - [Vendors](#2-vendors-schema)
   - [Bills](#3-bills-schema)
6. [TypeScript Interfaces](#typescript-interfaces)
7. [Mongoose Models](#mongoose-models)
8. [API Implementation — Products CRUD](#api-implementation--products-crud)
9. [Implementation Checklist](#implementation-checklist)

---

## Overview

This guide outlines the full implementation requirements for the `Products`, `Vendors`, and `Bills` modules within the Invoicely platform.

All three modules operate within a **multi-tenant SaaS architecture**. Every record must be strictly scoped to a specific `Company` via its `ObjectId`, ensuring complete tenant isolation across the system.

---

## Prerequisites

Before beginning implementation, ensure you have reviewed:

- The root `README.md` for project architecture, folder structure, and existing design patterns
- The existing `Company` model and `database.module.ts` for reference patterns
- Environment variables and MongoDB connection setup

---

## Coding Standards

Consistency is the highest priority in this codebase. Follow these rules without exception.

### General Rules

| Rule                  | Requirement                                                                 |
| --------------------- | --------------------------------------------------------------------------- |
| **Consistency**       | Strictly adhere to existing project logic, patterns, and naming conventions |
| **Strict Typing**     | Always use TypeScript `enum`s for categorical or finite-value fields        |
| **Schema Validation** | Define enums explicitly in Mongoose schemas                                 |
| **Enum Values**       | Never use `Object.values()` for Mongoose enum creation or validation        |
| **Tenant Isolation**  | All queries must be scoped to `company` ObjectId                            |

### Enum Declaration Pattern

```typescript
// ✅ CORRECT — Explicit enum declaration
export enum GstSlab {
  ZERO    = '0',
  FIVE    = '5',
  TWELVE  = '12',
  EIGHTEEN = '18',
  TWENTY_EIGHT = '28',
}

// ❌ WRONG — Never use Object.values() in schema enums
gstSlab: { type: String, enum: Object.values(GstSlab) }
```

### Mongoose Schema Enum Pattern

```typescript
// ✅ CORRECT — Explicit array in schema definition
gstSlab: { type: String, enum: ['0', '5', '12', '18', '28'] }
```

---

## Architecture Review & Recommendations

The following improvements are recommended before finalizing schema implementation.

### Financial Precision — Use `Decimal128` Over `Number`

JavaScript's `Number` type uses IEEE 754 floating-point, which introduces rounding errors in financial calculations. For a GST-compliant invoicing platform, this is unacceptable.

**Recommendation:** Replace all monetary fields with `Decimal128`.

```typescript
// ❌ Avoid for financial fields
amount: {
  type: Number;
}

// ✅ Recommended for financial precision
amount: {
  type: Schema.Types.Decimal128;
}
```

> **Note:** When serializing `Decimal128` to JSON, convert via `.toString()` in your service layer or use a Mongoose transform.

---

### Products Schema — Add `unitPrice` and `stockTracking`

The current draft lacks pricing data on the product itself. Bills snapshot product details at the time of billing, so the product record should carry base pricing.

**Recommended additions:**

```typescript
unitPrice:  { type: Schema.Types.Decimal128, required: true }
unit:       { type: String, enum: ['kg', 'litre', 'gram', 'pcs'] }
isActive:   { type: Boolean, default: true }
```

---

### Vendors Schema — Add Indexing and Validation

For a SaaS platform with multiple companies, queries on vendors are frequent. Index the `company` field and, where applicable, the `gstIn` field.

**Recommended additions:**

```typescript
// Address as sub-document for extensibility
address: {
  line1:   { type: String },
  city:    { type: String },
  state:   { type: String },
  pinCode: { type: String },
}

// Index for query performance
VendorsSchema.index({ company: 1 });
VendorsSchema.index({ gstIn: 1, company: 1 });
```

---

### Bills Schema — Price Snapshot at Bill Time

The `products` array in a bill correctly stores a snapshot of product details. Add `unitPrice` and `totalPrice` per line item so the bill is self-contained and auditable, even if the product catalog changes later.

**Recommended additions per line item:**

```typescript
unitPrice: {
  type: Schema.Types.Decimal128;
}
totalPrice: {
  type: Schema.Types.Decimal128;
} // quantity × unitPrice
```

---

### Bills Schema — Add `billNumber` and `status`

For GST compliance and business operations, bills need a unique identifier and a lifecycle status.

```typescript
billNumber: { type: String, unique: true, required: true }  // e.g., INV-2024-0001
status:     { type: String, enum: ['Draft', 'Issued', 'Cancelled'], default: 'Draft' }
billDate:   { type: Date, required: true, default: Date.now }
```

---

## Schema Definitions

### 1. Products Schema

**Location:** `apps/server/src/app/product/`

**Fields:**

| Field         | Type            | Required | Notes                                |
| ------------- | --------------- | -------- | ------------------------------------ |
| `name`        | `String`        | Yes      | Product or service name              |
| `description` | `String`        | No       | Optional description                 |
| `hsnCode`     | `String`        | No       | HSN/SAC code for GST                 |
| `gstSlab`     | `String` (enum) | No       | GST rate: `0`, `5`, `12`, `18`, `28` |
| `unit`        | `String` (enum) | No       | Unit of measure                      |
| `unitPrice`   | `Decimal128`    | Yes      | Base selling price                   |
| `isActive`    | `Boolean`       | No       | Soft-delete / catalog visibility     |
| `company`     | `ObjectId`      | Yes      | Tenant reference — always required   |

---

### 2. Vendors Schema

**Location:** `apps/server/src/app/vendor/`

**Fields:**

| Field             | Type       | Required | Notes                              |
| ----------------- | ---------- | -------- | ---------------------------------- |
| `name`            | `String`   | Yes      | Vendor / customer name             |
| `description`     | `String`   | No       | Optional notes                     |
| `email`           | `String`   | No       | Contact email                      |
| `countryCode`     | `String`   | No       | Phone country code, e.g. `+91`     |
| `mobileNumber`    | `String`   | No       | Primary contact number             |
| `gstIn`           | `String`   | No       | GST Identification Number          |
| `address.line1`   | `String`   | No       | Street address                     |
| `address.city`    | `String`   | No       | City                               |
| `address.state`   | `String`   | No       | State name                         |
| `address.pinCode` | `String`   | No       | PIN code                           |
| `company`         | `ObjectId` | Yes      | Tenant reference — always required |

---

### 3. Bills Schema

**Location:** `apps/server/src/app/bill/`

**Fields:**

| Field                 | Type            | Required | Notes                                      |
| --------------------- | --------------- | -------- | ------------------------------------------ |
| `billNumber`          | `String`        | Yes      | Unique per company — e.g., `INV-2024-0001` |
| `billDate`            | `Date`          | Yes      | Date of invoice                            |
| `type`                | `String` (enum) | Yes      | `Tax Invoice` or `Bill Of Supply`          |
| `status`              | `String` (enum) | No       | `Draft`, `Issued`, `Cancelled`             |
| `billToVendorDetails` | Sub-document    | No       | Snapshot of billing party                  |
| `shipToVendorDetails` | Sub-document    | No       | Snapshot of shipping party                 |
| `products[]`          | Array           | No       | Line-item product snapshots                |
| `billingDetails`      | Sub-document    | No       | Financial totals                           |
| `company`             | `ObjectId`      | Yes      | Tenant reference — always required         |

---

## TypeScript Interfaces

**Location:** `libs/api-interfaces/src/`

### Enums

```typescript
// libs/api-interfaces/src/lib/enums/gst-slab.enum.ts

export enum GstSlab {
  ZERO = '0',
  FIVE = '5',
  TWELVE = '12',
  EIGHTEEN = '18',
  TWENTY_EIGHT = '28',
}

export enum GstSlabNumeric {
  ZERO = 0,
  FIVE = 5,
  TWELVE = 12,
  EIGHTEEN = 18,
  TWENTY_EIGHT = 28,
}

export enum ProductUnit {
  KG = 'kg',
  LITRE = 'litre',
  GRAM = 'gram',
  PCS = 'pcs',
}

export enum BillType {
  TAX_INVOICE = 'Tax Invoice',
  BILL_OF_SUPPLY = 'Bill Of Supply',
}

export enum BillStatus {
  DRAFT = 'Draft',
  ISSUED = 'Issued',
  CANCELLED = 'Cancelled',
}
```

### Product Interface

```typescript
// libs/api-interfaces/src/lib/interfaces/product.interface.ts

import { Types } from 'mongoose';
import { GstSlab, ProductUnit } from '../enums/gst-slab.enum';

export interface IProduct {
  _id: Types.ObjectId;
  name: string;
  description: string | null;
  hsnCode: string | null;
  gstSlab: GstSlab | null;
  unit: ProductUnit | null;
  unitPrice: Types.Decimal128;
  isActive: boolean;
  company: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

### Vendor Interface

```typescript
// libs/api-interfaces/src/lib/interfaces/vendor.interface.ts

import { Types } from 'mongoose';

export interface IVendorAddress {
  line1: string | null;
  city: string | null;
  state: string | null;
  pinCode: string | null;
}

export interface IVendor {
  _id: Types.ObjectId;
  name: string;
  description: string | null;
  email: string | null;
  countryCode: string | null;
  mobileNumber: string | null;
  gstIn: string | null;
  address: IVendorAddress;
  company: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

### Bill Interface

```typescript
// libs/api-interfaces/src/lib/interfaces/bill.interface.ts

import { Types } from 'mongoose';
import {
  BillType,
  BillStatus,
  ProductUnit,
  GstSlabNumeric,
} from '../enums/gst-slab.enum';

export interface IBillVendorSnapshot {
  id: Types.ObjectId | null;
  name: string | null;
}

export interface IBillLineItem {
  id: Types.ObjectId | null;
  name: string | null;
  description: string | null;
  quantity: number | null;
  unit: ProductUnit | null;
  unitPrice: Types.Decimal128 | null;
  gstSlab: GstSlabNumeric | null;
  totalPrice: Types.Decimal128 | null;
}

export interface IBillingDetails {
  amount: Types.Decimal128 | null;
  gstAmount: Types.Decimal128 | null;
  totalAmount: Types.Decimal128 | null;
}

export interface IBill {
  _id: Types.ObjectId;
  billNumber: string;
  billDate: Date;
  type: BillType;
  status: BillStatus;
  billToVendorDetails: IBillVendorSnapshot;
  shipToVendorDetails: IBillVendorSnapshot;
  products: IBillLineItem[];
  billingDetails: IBillingDetails;
  company: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Mongoose Models

### Product Model

```typescript
// apps/server/src/app/product/models/product.model.ts

import { Schema, Document, Types, model } from 'mongoose';

export interface ProductDocument extends Document {
  name: string;
  description: string | null;
  hsnCode: string | null;
  gstSlab: string | null;
  unit: string | null;
  unitPrice: Types.Decimal128;
  isActive: boolean;
  company: Types.ObjectId;
}

const ProductSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true },
    description: { type: String, default: null },
    hsnCode: { type: String, default: null },
    gstSlab: {
      type: String,
      enum: ['0', '5', '12', '18', '28'],
      default: null,
    },
    unit: { type: String, enum: ['kg', 'litre', 'gram', 'pcs'], default: null },
    unitPrice: { type: Schema.Types.Decimal128, required: true },
    isActive: { type: Boolean, default: true },
    company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  },
  { timestamps: true }
);

ProductSchema.index({ company: 1 });
ProductSchema.index({ name: 1, company: 1 });

export const ProductModel = model<ProductDocument>('Product', ProductSchema);
```

---

### Vendor Model

```typescript
// apps/server/src/app/vendor/models/vendor.model.ts

import { Schema, Document, Types, model } from 'mongoose';

export interface VendorDocument extends Document {
  name: string;
  description: string | null;
  email: string | null;
  countryCode: string | null;
  mobileNumber: string | null;
  gstIn: string | null;
  address: {
    line1: string | null;
    city: string | null;
    state: string | null;
    pinCode: string | null;
  };
  company: Types.ObjectId;
}

const VendorSchema = new Schema<VendorDocument>(
  {
    name: { type: String, required: true },
    description: { type: String, default: null },
    email: { type: String, default: null },
    countryCode: { type: String, default: null },
    mobileNumber: { type: String, default: null },
    gstIn: { type: String, default: null },
    address: {
      line1: { type: String, default: null },
      city: { type: String, default: null },
      state: { type: String, default: null },
      pinCode: { type: String, default: null },
    },
    company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  },
  { timestamps: true }
);

VendorSchema.index({ company: 1 });
VendorSchema.index({ gstIn: 1, company: 1 });

export const VendorModel = model<VendorDocument>('Vendor', VendorSchema);
```

---

### Bill Model

```typescript
// apps/server/src/app/bill/models/bill.model.ts

import { Schema, Document, Types, model } from 'mongoose';

export interface BillDocument extends Document {
  billNumber: string;
  billDate: Date;
  type: string;
  status: string;
  billToVendorDetails: { id: Types.ObjectId | null; name: string | null };
  shipToVendorDetails: { id: Types.ObjectId | null; name: string | null };
  products: {
    id: Types.ObjectId | null;
    name: string | null;
    description: string | null;
    quantity: number | null;
    unit: string | null;
    unitPrice: Types.Decimal128 | null;
    gstSlab: number | null;
    totalPrice: Types.Decimal128 | null;
  }[];
  billingDetails: {
    amount: Types.Decimal128 | null;
    gstAmount: Types.Decimal128 | null;
    totalAmount: Types.Decimal128 | null;
  };
  company: Types.ObjectId;
}

const BillSchema = new Schema<BillDocument>(
  {
    billNumber: { type: String, required: true },
    billDate: { type: Date, required: true, default: Date.now },
    type: {
      type: String,
      enum: ['Tax Invoice', 'Bill Of Supply'],
      required: true,
    },
    status: {
      type: String,
      enum: ['Draft', 'Issued', 'Cancelled'],
      default: 'Draft',
    },

    billToVendorDetails: {
      id: { type: Schema.Types.ObjectId, ref: 'Vendor', default: null },
      name: { type: String, default: null },
    },
    shipToVendorDetails: {
      id: { type: Schema.Types.ObjectId, ref: 'Vendor', default: null },
      name: { type: String, default: null },
    },

    products: [
      {
        id: { type: Schema.Types.ObjectId, ref: 'Product', default: null },
        name: { type: String, default: null },
        description: { type: String, default: null },
        quantity: { type: Number, default: null },
        unit: {
          type: String,
          enum: ['kg', 'litre', 'gram', 'pcs'],
          default: null,
        },
        unitPrice: { type: Schema.Types.Decimal128, default: null },
        gstSlab: { type: Number, enum: [0, 5, 12, 18, 28], default: null },
        totalPrice: { type: Schema.Types.Decimal128, default: null },
      },
    ],

    billingDetails: {
      amount: { type: Schema.Types.Decimal128, default: null },
      gstAmount: { type: Schema.Types.Decimal128, default: null },
      totalAmount: { type: Schema.Types.Decimal128, default: null },
    },

    company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  },
  { timestamps: true }
);

BillSchema.index({ company: 1 });
BillSchema.index({ billNumber: 1, company: 1 }, { unique: true });

export const BillModel = model<BillDocument>('Bill', BillSchema);
```

---

## API Implementation — Products CRUD

> Implement Products first. The same patterns apply to Vendors and Bills.

### DTO — Create Product

```typescript
// apps/server/src/app/product/dto/create-product.dto.ts

import { IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { GstSlab, ProductUnit } from '@invoicely/api-interfaces';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  hsnCode?: string;

  @IsOptional()
  @IsEnum(GstSlab)
  gstSlab?: GstSlab;

  @IsOptional()
  @IsEnum(ProductUnit)
  unit?: ProductUnit;

  @IsNotEmpty()
  unitPrice: string; // Accept as string, store as Decimal128
}
```

### DTO — Update Product

```typescript
// apps/server/src/app/product/dto/update-product.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
```

### Service

```typescript
// apps/server/src/app/product/product.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProductDocument } from './models/product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<ProductDocument>
  ) {}

  async create(
    companyId: string,
    dto: CreateProductDto
  ): Promise<ProductDocument> {
    const product = new this.productModel({
      ...dto,
      unitPrice: Types.Decimal128.fromString(dto.unitPrice),
      company: new Types.ObjectId(companyId),
    });
    return product.save();
  }

  async findAll(companyId: string): Promise<ProductDocument[]> {
    return this.productModel.find({
      company: new Types.ObjectId(companyId),
      isActive: true,
    });
  }

  async findOne(
    companyId: string,
    productId: string
  ): Promise<ProductDocument> {
    const product = await this.productModel.findOne({
      _id: new Types.ObjectId(productId),
      company: new Types.ObjectId(companyId),
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(
    companyId: string,
    productId: string,
    dto: UpdateProductDto
  ): Promise<ProductDocument> {
    const update: Record<string, unknown> = { ...dto };
    if (dto.unitPrice) {
      update.unitPrice = Types.Decimal128.fromString(dto.unitPrice);
    }
    const product = await this.productModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(productId),
        company: new Types.ObjectId(companyId),
      },
      { $set: update },
      { new: true }
    );
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async remove(companyId: string, productId: string): Promise<void> {
    const result = await this.productModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(productId),
        company: new Types.ObjectId(companyId),
      },
      { $set: { isActive: false } }
    );
    if (!result) throw new NotFoundException('Product not found');
  }
}
```

### Controller

```typescript
// apps/server/src/app/product/product.controller.ts

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('companies/:companyId/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Param('companyId') companyId: string, @Body() dto: CreateProductDto) {
    return this.productService.create(companyId, dto);
  }

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.productService.findAll(companyId);
  }

  @Get(':productId')
  findOne(
    @Param('companyId') companyId: string,
    @Param('productId') productId: string
  ) {
    return this.productService.findOne(companyId, productId);
  }

  @Patch(':productId')
  update(
    @Param('companyId') companyId: string,
    @Param('productId') productId: string,
    @Body() dto: UpdateProductDto
  ) {
    return this.productService.update(companyId, productId, dto);
  }

  @Delete(':productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('companyId') companyId: string,
    @Param('productId') productId: string
  ) {
    return this.productService.remove(companyId, productId);
  }
}
```

### API Routes Summary

| Method   | Route                                       | Description              |
| -------- | ------------------------------------------- | ------------------------ |
| `POST`   | `/companies/:companyId/products`            | Create a new product     |
| `GET`    | `/companies/:companyId/products`            | List all active products |
| `GET`    | `/companies/:companyId/products/:productId` | Get a single product     |
| `PATCH`  | `/companies/:companyId/products/:productId` | Update a product         |
| `DELETE` | `/companies/:companyId/products/:productId` | Soft-delete a product    |

---

## Implementation Checklist

### Shared Library (`libs/api-interfaces`)

- [ ] Create `GstSlab`, `GstSlabNumeric`, `ProductUnit`, `BillType`, `BillStatus` enums
- [ ] Create `IProduct` interface
- [ ] Create `IVendor`, `IVendorAddress` interfaces
- [ ] Create `IBill`, `IBillLineItem`, `IBillingDetails`, `IBillVendorSnapshot` interfaces
- [ ] Export all from `index.ts`

### Database Models (`apps/server`)

- [ ] Create `product.model.ts` with schema and indexes
- [ ] Create `vendor.model.ts` with schema and indexes
- [ ] Create `bill.model.ts` with schema and indexes

### Products Module

- [ ] `create-product.dto.ts`
- [ ] `update-product.dto.ts`
- [ ] `product.service.ts` — all 5 CRUD methods, company-scoped
- [ ] `product.controller.ts` — REST endpoints
- [ ] `product.module.ts` — wire up service, controller, and model
- [ ] Register module in `app.module.ts`

### Vendors Module

- [ ] `create-vendor.dto.ts`
- [ ] `update-vendor.dto.ts`
- [ ] `vendor.service.ts`
- [ ] `vendor.controller.ts`
- [ ] `vendor.module.ts`

### Bills Module

- [ ] `create-bill.dto.ts`
- [ ] `update-bill.dto.ts`
- [ ] `bill.service.ts`
- [ ] `bill.controller.ts`
- [ ] `bill.module.ts`

---

> **Implementation Order:** `Products` → `Vendors` → `Bills`
> Bills depend on both Products and Vendors for vendor/product snapshots.
