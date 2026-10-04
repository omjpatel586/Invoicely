# Invoicely Server API Documentation

Developer-facing API reference for integrating the mobile app with the NestJS server.

## Base URL

```text
http://<host>:<port>/api/v1
```

Local example:

```text
http://localhost:5000/api/v1
```

## API Conventions

### Authentication

Most endpoints are protected by `SecurityGuard` and require a Bearer token:

```http
Authorization: Bearer <authToken>
```

Get `authToken` from `POST /api/v1/auth/login/google`.

### Response Format

Most endpoints are wrapped by a global response interceptor and return:

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {}
}
```

Notes:

- `POST /auth/login/google` and `POST /auth/logout` write the response directly, but they still use the same top-level shape.
- `DELETE` endpoints return HTTP `204 No Content`. Because of the global interceptor, clients may still receive a wrapped empty body depending on runtime behavior.

### Error Format

Standard NestJS errors can look like:

```json
{
  "statusCode": 400,
  "message": "Invalid GST number format",
  "error": "Bad Request"
}
```

## Authentication Flow

### 1. Google Login

`POST /api/v1/auth/login/google`

Authenticates the user with a Google OAuth access token, fetches the Google user profile on the server, and returns an app auth token.

Auth required: `No`

Request body:

```json
{
  "accessToken": "GOOGLE_OAUTH_ACCESS_TOKEN"
}
```

Success response:

```json
{
  "statusCode": 201,
  "message": "Google Login Successful",
  "data": {
    "_id": "67f0c2f2b6d5f8f0b8c1a111",
    "firstName": "Om",
    "lastName": "Patel",
    "email": "om@example.com",
    "profile": "https://...",
    "authToken": "JWT_TOKEN"
  }
}
```

### 2. Logout

`POST /api/v1/auth/logout`

Invalidates the session on the client side. Current implementation only returns success; there is no token blacklist.

Auth required: `Yes`

Headers:

```http
Authorization: Bearer <authToken>
```

Success response:

```json
{
  "statusCode": 200,
  "message": "Logout Successful"
}
```

## General Endpoints

### Health / Welcome

`GET /api/v1`

Auth required: `No`

Success response:

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "message": "Welcome To Invoicely Backend"
  }
}
```

## User APIs

### Get Logged-In User Profile

`GET /api/v1/user/profile`

Auth required: `Yes`

Headers:

```http
Authorization: Bearer <authToken>
```

Success response:

```json
{
  "statusCode": 200,
  "message": "User profile fetched successfully",
  "data": {
    "_id": "67f0c2f2b6d5f8f0b8c1a111",
    "firstName": "Om",
    "lastName": "Patel",
    "email": "om@example.com",
    "profile": "https://..."
  }
}
```

## Company APIs

All company endpoints require authentication.

### Verify GST Number

`GET /api/v1/company/gst/verify?gstNumber=<GST_NUMBER>`

Auth required: `Yes`

Purpose:

- Validates GST number format
- Fetches GST registration details from the external verification provider

Success response:

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "legalName": "ABC PRIVATE LIMITED",
    "tradeName": "ABC Traders",
    "registrationDate": "2021-07-15T00:00:00.000Z",
    "status": "Active",
    "taxPayerType": "Regular",
    "stateJurisdiction": "State Jurisdiction Value",
    "natureOfBusiness": ["Retail Business"],
    "centerJurisdiction": "Center Jurisdiction Value",
    "constitutionOfBusiness": "Private Limited Company",
    "headOfficeAddress": "Full address",
    "gstIn": "24ABCDE1234F1Z5",
    "headOfficeSplitAddress": {
      "buildingName": "Building",
      "buildingNumber": "12",
      "location": "Area",
      "street": "Main Road",
      "district": "Ahmedabad",
      "state": "Gujarat",
      "city": "Ahmedabad",
      "flatNumber": "101",
      "pincode": "380001",
      "latitude": 23.0225,
      "longitude": 72.5714
    },
    "branches": []
  }
}
```

### Create Company

`POST /api/v1/user/company`

Auth required: `Yes`

Request body:

```json
{
  "gstIn": "24ABCDE1234F1Z5",
  "legalName": "ABC PRIVATE LIMITED",
  "tradeName": "ABC Traders",
  "constitutionOfBusiness": "Private Limited Company",
  "taxPayerType": "Regular",
  "status": "Active",
  "stateJurisdiction": "State Jurisdiction Value",
  "centerJurisdiction": "Center Jurisdiction Value",
  "headOfficeAddress": "Full address",
  "headOfficeSplitAddress": {
    "buildingName": "Building",
    "street": "Main Road",
    "location": "Area",
    "buildingNumber": "12",
    "district": "Ahmedabad",
    "state": "Gujarat",
    "city": "Ahmedabad",
    "flatNumber": "101",
    "pincode": "380001",
    "latitude": 23.0225,
    "longitude": 72.5714
  },
  "registrationDate": "2021-07-15T00:00:00.000Z",
  "branches": [],
  "natureOfBusiness": ["Retail Business"],
  "phoneNumber": "+919999999999",
  "email": "accounts@abc.com",
  "isUseCompanyEmail": true
}
```

Success response:

```json
{
  "statusCode": 201,
  "message": "Company created successfully",
  "data": {
    "_id": "67f0d2f2b6d5f8f0b8c1a222",
    "gstIn": "24ABCDE1234F1Z5",
    "legalName": "ABC PRIVATE LIMITED"
  }
}
```

### Get Company By ID

`GET /api/v1/user/company/:id`

Auth required: `Yes`

Path params:

- `id`: Company MongoDB ObjectId

### Get Companies For Logged-In User

`GET /api/v1/user/companies`

Auth required: `Yes`

Returns companies linked to the authenticated user.

## Product APIs

All product endpoints are company-scoped and require authentication.

Base route:

```text
/api/v1/companies/:companyId/products
```

### Product Enums

`gstSlab` (number)

- `0`
- `5`
- `12`
- `18`
- `28`

`unit`

GST Unique Quantity Codes (UQC), for example `KGS` (kilograms), `LTR` (litres), `GMS` (grams), `PCS` (pieces), `BOX`, `DOZ`, `MTR`, `SQF`, `NOS`, `OTH`. The full list of 44 codes is `ProductUnit` in `shared/constants/src/lib/product.ts`.

### Create Product

`POST /api/v1/companies/:companyId/products`

Request body:

```json
{
  "name": "Basmati Rice",
  "description": "Premium grade rice",
  "hsnCode": "100630",
  "gstSlab": 5,
  "unit": "KGS",
  "unitPrice": "120.50"
}
```

Success response:

```json
{
  "statusCode": 201,
  "message": "Success",
  "data": {
    "_id": "67f0e2f2b6d5f8f0b8c1a333",
    "name": "Basmati Rice",
    "description": "Premium grade rice",
    "hsnCode": "100630",
    "gstSlab": 5,
    "unit": "KGS",
    "unitPrice": "120.50",
    "isActive": true,
    "company": "67f0d2f2b6d5f8f0b8c1a222"
  }
}
```

### Get All Products

`GET /api/v1/companies/:companyId/products`

Returns active products only.

### Get Product By ID

`GET /api/v1/companies/:companyId/products/:productId`

### Update Product

`PATCH /api/v1/companies/:companyId/products/:productId`

Request body:

```json
{
  "name": "Basmati Rice 5kg",
  "unitPrice": "580.00",
  "gstSlab": 5
}
```

### Delete Product

`DELETE /api/v1/companies/:companyId/products/:productId`

Soft delete behavior:

- The record is kept in the database
- `isActive` is set to `false`

## Vendor APIs

All vendor endpoints are company-scoped and require authentication.

Base route:

```text
/api/v1/companies/:companyId/vendors
```

### Create Vendor

`POST /api/v1/companies/:companyId/vendors`

Request body:

```json
{
  "name": "Shree Traders",
  "description": "Preferred raw material vendor",
  "email": "contact@shreetraders.com",
  "countryCode": "+91",
  "mobileNumber": "9876543210",
  "gstIn": "24ABCDE1234F1Z5",
  "address": {
    "line1": "Shop 12, Market Yard",
    "city": "Surat",
    "state": "Gujarat",
    "pinCode": "395003"
  }
}
```

Success response:

```json
{
  "statusCode": 201,
  "message": "Success",
  "data": {
    "_id": "67f0f2f2b6d5f8f0b8c1a444",
    "name": "Shree Traders",
    "email": "contact@shreetraders.com",
    "gstIn": "24ABCDE1234F1Z5",
    "address": {
      "line1": "Shop 12, Market Yard",
      "city": "Surat",
      "state": "Gujarat",
      "pinCode": "395003"
    }
  }
}
```

### Get All Vendors

`GET /api/v1/companies/:companyId/vendors`

Query params:

- `search` (optional): case-insensitive partial match on `name`, `gstIn`, or `mobileNumber`. Example: `?search=shree`

### Get Vendor By ID

`GET /api/v1/companies/:companyId/vendors/:vendorId`

### Update Vendor

`PATCH /api/v1/companies/:companyId/vendors/:vendorId`

Request body:

```json
{
  "mobileNumber": "9999999999",
  "address": {
    "line1": "Updated address line",
    "city": "Surat",
    "state": "Gujarat",
    "pinCode": "395003"
  }
}
```

### Delete Vendor

`DELETE /api/v1/companies/:companyId/vendors/:vendorId`

Soft delete behavior:

- The record is marked deleted using `isDeleted: true`
- Deleted records are filtered out by the shared soft-delete plugin

## Bill APIs

All bill endpoints are company-scoped and require authentication.

Base route:

```text
/api/v1/companies/:companyId/bills
```

### Bill Enums

`type`

- `Tax Invoice` (default)
- `Proforma Invoice`

`status`

- `Issued` (every new bill)
- `Cancelled`

`products[].unit`

GST Unique Quantity Codes (UQC), for example `KGS` (kilograms), `LTR` (litres), `GMS` (grams), `PCS` (pieces), `BOX`, `DOZ`, `MTR`, `SQF`, `NOS`, `OTH`. The full list of 44 codes is `ProductUnit` in `shared/constants/src/lib/product.ts`.

`products[].gstSlab`

- `0`
- `5`
- `12`
- `18`
- `28`

### Create Bill

`POST /api/v1/companies/:companyId/bills`

Recommended request body:

```json
{
  "billDate": "2026-04-05T00:00:00.000Z",
  "type": "Tax Invoice",
  "billToVendorDetails": {
    "id": "67f0f2f2b6d5f8f0b8c1a444",
    "name": "Shree Traders"
  },
  "shipToVendorDetails": {
    "id": "67f0f2f2b6d5f8f0b8c1a444",
    "name": "Shree Traders"
  },
  "products": [
    {
      "id": "67f0e2f2b6d5f8f0b8c1a333",
      "name": "Basmati Rice",
      "description": "Premium grade rice",
      "hsnCode": "100630",
      "quantity": 5,
      "unit": "KGS",
      "unitPrice": "120.50",
      "gstSlab": 5,
      "totalPrice": "602.50"
    }
  ],
  "billingDetails": {
    "amount": "602.50",
    "cgstAmount": "15.06",
    "sgstAmount": "15.06",
    "igstAmount": "0.00",
    "gstAmount": "30.12",
    "totalAmount": "632.62"
  }
}
```

Success response:

```json
{
  "statusCode": 201,
  "message": "Success",
  "data": {
    "_id": "67f102f2b6d5f8f0b8c1a555",
    "billNumber": 1,
    "billDate": "2026-04-05T00:00:00.000Z",
    "type": "Tax Invoice",
    "status": "Issued",
    "company": "67f0d2f2b6d5f8f0b8c1a222"
  }
}
```

Important:

- Do not send `billNumber`. The server assigns it as the next sequential number within the company (`1`, `2`, `3`, ...), counting only bills that are not deleted. Deleting the latest bill frees its number for the next bill. Any client-sent value is ignored.
- `billDate` is optional (ISO 8601 date string). It defaults to the current date and time when omitted. It cannot be in the past (a one-day tolerance covers client timezones); the request fails with `400 Bill date cannot be in the past`.
- Do not send `status`. Every new bill is created as `Issued`; it can later be changed to `Cancelled` through Update Bill.
- Send the same vendor in `billToVendorDetails` and `shipToVendorDetails`. The web app bills and ships to one vendor.
- Send monetary values as strings.
- Send `gstSlab` as a number, not a string, for both products and bill lines.
- `products[].hsnCode` is copied from the product so the printed invoice shows it.
- Products and vendors are stored as snapshots, so bills stay unchanged when the original product or vendor is later edited or deleted.
- Totals are calculated by the client. GST applies to both `Tax Invoice` and `Proforma Invoice`.
- GST split depends on the place of supply. Compare the company and vendor states, using the first two digits of each GSTIN (state code) when both exist, otherwise the state names:
  - Same state (intra-state): `cgstAmount` and `sgstAmount` are each half the GST per line; `igstAmount` is `0.00`.
  - Different state (inter-state): `igstAmount` is the full GST; `cgstAmount` and `sgstAmount` are `0.00`.
  - Vendor state unknown: treated as intra-state.
- `gstAmount` = `cgstAmount` + `sgstAmount` + `igstAmount`, and `totalAmount` = `amount` + `gstAmount`. Bills created before this split was added have `null` for the three split fields.

### Get All Bills

`GET /api/v1/companies/:companyId/bills`

### Get Bill By ID

`GET /api/v1/companies/:companyId/bills/:billId`

### Update Bill

`PATCH /api/v1/companies/:companyId/bills/:billId`

Send only the fields that changed. `billNumber` cannot be changed. A new `billDate` follows the same no-past-date rule as Create Bill.

Example request body:

```json
{
  "billDate": "2026-04-06T00:00:00.000Z",
  "status": "Issued",
  "billingDetails": {
    "amount": "602.50",
    "cgstAmount": "0.00",
    "sgstAmount": "0.00",
    "igstAmount": "30.13",
    "gstAmount": "30.13",
    "totalAmount": "632.63"
  }
}
```

### Delete Bill

`DELETE /api/v1/companies/:companyId/bills/:billId`

Soft delete behavior:

- The record is marked deleted using `isDeleted: true`
- Deleted records are filtered out by the shared soft-delete plugin

## Integration Checklist For Mobile App

1. Authenticate with `POST /api/v1/auth/login/google` and store `authToken` securely.
2. Send `Authorization: Bearer <authToken>` for every protected API.
3. Treat money fields as strings on requests and responses.
4. Use company-scoped routes for products, vendors, and bills.
5. Handle both wrapped success responses and standard NestJS error responses.
6. Expect MongoDB ObjectId strings for all resource identifiers.

## Quick Endpoint Index

| Method   | Endpoint                                           | Auth | Purpose                          |
| -------- | -------------------------------------------------- | ---- | -------------------------------- |
| `GET`    | `/api/v1`                                          | No   | Welcome/health route             |
| `POST`   | `/api/v1/auth/login/google`                        | No   | Login with Google Firebase token |
| `POST`   | `/api/v1/auth/logout`                              | Yes  | Logout                           |
| `GET`    | `/api/v1/user/profile`                             | Yes  | Logged-in user profile           |
| `GET`    | `/api/v1/company/gst/verify?gstNumber=...`         | Yes  | Verify GST number                |
| `POST`   | `/api/v1/user/company`                             | Yes  | Create company                   |
| `GET`    | `/api/v1/user/company/:id`                         | Yes  | Get company by ID                |
| `GET`    | `/api/v1/user/companies`                           | Yes  | List user companies              |
| `POST`   | `/api/v1/companies/:companyId/products`            | Yes  | Create product                   |
| `GET`    | `/api/v1/companies/:companyId/products`            | Yes  | List products                    |
| `GET`    | `/api/v1/companies/:companyId/products/:productId` | Yes  | Get product                      |
| `PATCH`  | `/api/v1/companies/:companyId/products/:productId` | Yes  | Update product                   |
| `DELETE` | `/api/v1/companies/:companyId/products/:productId` | Yes  | Delete product                   |
| `POST`   | `/api/v1/companies/:companyId/vendors`             | Yes  | Create vendor                    |
| `GET`    | `/api/v1/companies/:companyId/vendors`             | Yes  | List vendors                     |
| `GET`    | `/api/v1/companies/:companyId/vendors/:vendorId`   | Yes  | Get vendor                       |
| `PATCH`  | `/api/v1/companies/:companyId/vendors/:vendorId`   | Yes  | Update vendor                    |
| `DELETE` | `/api/v1/companies/:companyId/vendors/:vendorId`   | Yes  | Delete vendor                    |
| `POST`   | `/api/v1/companies/:companyId/bills`               | Yes  | Create bill                      |
| `GET`    | `/api/v1/companies/:companyId/bills`               | Yes  | List bills                       |
| `GET`    | `/api/v1/companies/:companyId/bills/:billId`       | Yes  | Get bill                         |
| `PATCH`  | `/api/v1/companies/:companyId/bills/:billId`       | Yes  | Update bill                      |
| `DELETE` | `/api/v1/companies/:companyId/bills/:billId`       | Yes  | Delete bill                      |
