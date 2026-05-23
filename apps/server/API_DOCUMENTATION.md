# Invoicely Server API Documentation

Developer-facing API reference for integrating the mobile app with the NestJS server.

## Base URL

```text
http://<host>:<port>/api
```

Local example:

```text
http://localhost:5000/api
```

## API Conventions

### Authentication

Most endpoints are protected by `SecurityGuard` and require a Bearer token:

```http
Authorization: Bearer <authToken>
```

Get `authToken` from `POST /api/auth/login/google`.

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

`POST /api/auth/login/google`

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

`POST /api/auth/logout`

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

`GET /api`

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

`GET /api/user/profile`

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

`GET /api/company/gst/verify?gstNumber=<GST_NUMBER>`

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

`POST /api/user/company`

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

`GET /api/user/company/:id`

Auth required: `Yes`

Path params:

- `id`: Company MongoDB ObjectId

### Get Companies For Logged-In User

`GET /api/user/companies`

Auth required: `Yes`

Returns companies linked to the authenticated user.

## Product APIs

All product endpoints are company-scoped and require authentication.

Base route:

```text
/api/companies/:companyId/products
```

### Product Enums

`gstSlab`

- `0`
- `5`
- `12`
- `18`
- `28`

`unit`

- `kg`
- `litre`
- `gram`
- `pcs`

### Create Product

`POST /api/companies/:companyId/products`

Request body:

```json
{
  "name": "Basmati Rice",
  "description": "Premium grade rice",
  "hsnCode": "100630",
  "gstSlab": "5",
  "unit": "kg",
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
    "gstSlab": "5",
    "unit": "kg",
    "unitPrice": "120.50",
    "isActive": true,
    "company": "67f0d2f2b6d5f8f0b8c1a222"
  }
}
```

### Get All Products

`GET /api/companies/:companyId/products`

Returns active products only.

### Get Product By ID

`GET /api/companies/:companyId/products/:productId`

### Update Product

`PATCH /api/companies/:companyId/products/:productId`

Request body:

```json
{
  "name": "Basmati Rice 5kg",
  "unitPrice": "580.00",
  "gstSlab": "5"
}
```

### Delete Product

`DELETE /api/companies/:companyId/products/:productId`

Soft delete behavior:

- The record is kept in the database
- `isActive` is set to `false`

## Vendor APIs

All vendor endpoints are company-scoped and require authentication.

Base route:

```text
/api/companies/:companyId/vendors
```

### Create Vendor

`POST /api/companies/:companyId/vendors`

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

`GET /api/companies/:companyId/vendors`

### Get Vendor By ID

`GET /api/companies/:companyId/vendors/:vendorId`

### Update Vendor

`PATCH /api/companies/:companyId/vendors/:vendorId`

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

`DELETE /api/companies/:companyId/vendors/:vendorId`

Soft delete behavior:

- The record is marked deleted using `isDeleted: true`
- Deleted records are filtered out by the shared soft-delete plugin

## Bill APIs

All bill endpoints are company-scoped and require authentication.

Base route:

```text
/api/companies/:companyId/bills
```

### Bill Enums

`type`

- `Tax Invoice`
- `Bill Of Supply`

`status`

- `Draft`
- `Issued`
- `Cancelled`

`products[].unit`

- `kg`
- `litre`
- `gram`
- `pcs`

`products[].gstSlab`

- `0`
- `5`
- `12`
- `18`
- `28`

### Create Bill

`POST /api/companies/:companyId/bills`

Recommended request body:

```json
{
  "billNumber": "INV-2026-0001",
  "billDate": "2026-04-05T00:00:00.000Z",
  "type": "Tax Invoice",
  "status": "Draft",
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
      "quantity": 5,
      "unit": "kg",
      "unitPrice": "120.50",
      "gstSlab": 5,
      "totalPrice": "602.50"
    }
  ],
  "billingDetails": {
    "amount": "602.50",
    "gstAmount": "30.13",
    "totalAmount": "632.63"
  }
}
```

Important:

- Send monetary values as strings.
- Send `products[].gstSlab` as a number, not a string.
- `billNumber` should be unique within the company.

### Get All Bills

`GET /api/companies/:companyId/bills`

### Get Bill By ID

`GET /api/companies/:companyId/bills/:billId`

### Update Bill

`PATCH /api/companies/:companyId/bills/:billId`

Example request body:

```json
{
  "status": "Issued",
  "billingDetails": {
    "amount": "602.50",
    "gstAmount": "30.13",
    "totalAmount": "632.63"
  }
}
```

### Delete Bill

`DELETE /api/companies/:companyId/bills/:billId`

Soft delete behavior:

- The record is marked deleted using `isDeleted: true`
- Deleted records are filtered out by the shared soft-delete plugin

## Integration Checklist For Mobile App

1. Authenticate with `POST /api/auth/login/google` and store `authToken` securely.
2. Send `Authorization: Bearer <authToken>` for every protected API.
3. Treat money fields as strings on requests and responses.
4. Use company-scoped routes for products, vendors, and bills.
5. Handle both wrapped success responses and standard NestJS error responses.
6. Expect MongoDB ObjectId strings for all resource identifiers.

## Quick Endpoint Index

| Method   | Endpoint                                        | Auth | Purpose                          |
| -------- | ----------------------------------------------- | ---- | -------------------------------- |
| `GET`    | `/api`                                          | No   | Welcome/health route             |
| `POST`   | `/api/auth/login/google`                        | No   | Login with Google Firebase token |
| `POST`   | `/api/auth/logout`                              | Yes  | Logout                           |
| `GET`    | `/api/user/profile`                             | Yes  | Logged-in user profile           |
| `GET`    | `/api/company/gst/verify?gstNumber=...`         | Yes  | Verify GST number                |
| `POST`   | `/api/user/company`                             | Yes  | Create company                   |
| `GET`    | `/api/user/company/:id`                         | Yes  | Get company by ID                |
| `GET`    | `/api/user/companies`                           | Yes  | List user companies              |
| `POST`   | `/api/companies/:companyId/products`            | Yes  | Create product                   |
| `GET`    | `/api/companies/:companyId/products`            | Yes  | List products                    |
| `GET`    | `/api/companies/:companyId/products/:productId` | Yes  | Get product                      |
| `PATCH`  | `/api/companies/:companyId/products/:productId` | Yes  | Update product                   |
| `DELETE` | `/api/companies/:companyId/products/:productId` | Yes  | Delete product                   |
| `POST`   | `/api/companies/:companyId/vendors`             | Yes  | Create vendor                    |
| `GET`    | `/api/companies/:companyId/vendors`             | Yes  | List vendors                     |
| `GET`    | `/api/companies/:companyId/vendors/:vendorId`   | Yes  | Get vendor                       |
| `PATCH`  | `/api/companies/:companyId/vendors/:vendorId`   | Yes  | Update vendor                    |
| `DELETE` | `/api/companies/:companyId/vendors/:vendorId`   | Yes  | Delete vendor                    |
| `POST`   | `/api/companies/:companyId/bills`               | Yes  | Create bill                      |
| `GET`    | `/api/companies/:companyId/bills`               | Yes  | List bills                       |
| `GET`    | `/api/companies/:companyId/bills/:billId`       | Yes  | Get bill                         |
| `PATCH`  | `/api/companies/:companyId/bills/:billId`       | Yes  | Update bill                      |
| `DELETE` | `/api/companies/:companyId/bills/:billId`       | Yes  | Delete bill                      |
