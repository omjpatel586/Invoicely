import { IBill, ICompany, IVendor } from '@invoicely/api-interfaces';
import { BillStatus, GstSupplyType, InvoiceCopy } from '@invoicely/constants';
import {
  amountInWords,
  calculateLineGst,
  formatBillNumber,
  getGstSupply,
} from '@invoicely/utils';

export interface InvoiceData {
  bill: IBill;
  copy: InvoiceCopy;
  company: ICompany | null;
  vendor: IVendor | null;
}

const MIN_TABLE_ROWS = 8;

const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatMoney = (value: string | null) =>
  Number(value ?? 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatQuantity = (value: number | null) =>
  Number(value ?? 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 3,
  });

const formatDate = (value: Date | string) => {
  const date = new Date(value);
  const pad = (part: number) => String(part).padStart(2, '0');
  return `${pad(date.getDate())}-${pad(
    date.getMonth() + 1
  )}-${date.getFullYear()}`;
};

const formatRate = (rate: number) => `${Number(rate.toFixed(2))}%`;

const getBillSupplyType = (
  bill: IBill,
  company: ICompany | null,
  vendor: IVendor | null
): GstSupplyType => {
  const { cgstAmount, sgstAmount, igstAmount } = bill.billingDetails;

  if (Number(igstAmount ?? 0) > 0) {
    return GstSupplyType.INTER_STATE;
  }

  if (cgstAmount === null && sgstAmount === null && igstAmount === null) {
    return getGstSupply(company, vendor).type;
  }

  return GstSupplyType.INTRA_STATE;
};

const joinParts = (parts: Array<string | null | undefined>, separator = ', ') =>
  parts.filter((part) => part && part.trim()).join(separator);

const renderParty = (title: string, bill: IBill, vendor: IVendor | null) => {
  const name = vendor?.name ?? bill.billToVendorDetails?.name ?? '-';
  const address = vendor
    ? joinParts([
        vendor.address?.line1,
        joinParts([vendor.address?.city, vendor.address?.pinCode], '-'),
      ])
    : '';
  const phone = vendor?.mobileNumber
    ? joinParts([vendor.countryCode, vendor.mobileNumber], ' ')
    : '';

  return `
    <div class="party">
      <div class="party-title">${escapeHtml(title)}</div>
      <div class="party-body">
        <div class="party-name">${escapeHtml(name)}</div>
        <div>Address: ${escapeHtml(address || '-')}</div>
        <div>State: ${escapeHtml(vendor?.address?.state || '-')}</div>
        <div>Ph: ${escapeHtml(phone || '-')}</div>
        <div>Email: ${escapeHtml(vendor?.email || '-')}</div>
        <div class="strong">GSTIN: ${escapeHtml(vendor?.gstIn || '-')}</div>
      </div>
    </div>`;
};

export const buildInvoiceHtml = ({
  bill,
  copy,
  company,
  vendor,
}: InvoiceData) => {
  const supplyType = getBillSupplyType(bill, company, vendor);
  const isInterState = supplyType === GstSupplyType.INTER_STATE;
  const isCancelled = bill.status === BillStatus.CANCELLED;

  const companyName = company?.tradeName || company?.legalName || '';
  const companyState = company?.headOfficeSplitAddress?.state || '';
  const companyContact = joinParts(
    [
      company?.phoneNumber ? `Ph: ${company.phoneNumber}` : null,
      company?.gstIn ? `GSTIN: ${company.gstIn}` : null,
      companyState ? `State: ${companyState}` : null,
    ],
    ' | '
  );

  const slabs = new Set(bill.products.map((product) => product.gstSlab ?? 0));
  const uniformSlab = slabs.size === 1 ? [...slabs][0] : null;
  const rateHeader = (divisor: number) =>
    uniformSlab !== null ? `<br />${formatRate(uniformSlab / divisor)}` : '';

  const rows = bill.products.map((product, index) => {
    const lineGst = calculateLineGst(product, supplyType);
    const slab = product.gstSlab ?? 0;
    const cellRate = (divisor: number, amount: string) =>
      uniformSlab === null && Number(amount) > 0
        ? `<div class="cell-rate">${formatRate(slab / divisor)}</div>`
        : '';

    return `
      <tr>
        <td class="center">${index + 1}</td>
        <td class="item-name">${escapeHtml(product.name)}</td>
        <td class="center">${escapeHtml(product.hsnCode || '-')}</td>
        <td class="right">${formatQuantity(product.quantity)}</td>
        <td class="center">${escapeHtml(
          product.unit?.toUpperCase() || '-'
        )}</td>
        <td class="right">${formatMoney(product.unitPrice)}</td>
        <td class="right">${formatMoney(lineGst.cgstAmount)}${cellRate(
      2,
      lineGst.cgstAmount
    )}</td>
        <td class="right">${formatMoney(lineGst.sgstAmount)}${cellRate(
      2,
      lineGst.sgstAmount
    )}</td>
        <td class="right">${formatMoney(lineGst.igstAmount)}${cellRate(
      1,
      lineGst.igstAmount
    )}</td>
        <td class="right">${formatMoney(product.totalPrice)}</td>
      </tr>`;
  });

  const fillerRows = Array.from(
    { length: Math.max(0, MIN_TABLE_ROWS - rows.length) },
    () => `<tr class="filler">${'<td></td>'.repeat(10)}</tr>`
  );

  const { amount, cgstAmount, sgstAmount, igstAmount, totalAmount } =
    bill.billingDetails;

  const taxRows = isInterState
    ? `<div class="total-row"><span>IGST:</span><span>Rs. ${formatMoney(
        igstAmount
      )}</span></div>`
    : `<div class="total-row"><span>CGST:</span><span>Rs. ${formatMoney(
        cgstAmount
      )}</span></div>
       <div class="total-row"><span>SGST:</span><span>Rs. ${formatMoney(
         sgstAmount
       )}</span></div>`;

  const title = `${bill.type} ${formatBillNumber(bill.billNumber)}`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(title)}</title>
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #ffffff; }
  body {
    font-family: Arial, Helvetica, sans-serif;
    color: #1f2937;
    font-size: 11px;
    line-height: 1.45;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .invoice { position: relative; width: 210mm; min-height: 297mm; padding: 12mm 11mm 10mm; background: #ffffff; }
  .watermark {
    position: absolute; top: 50%; left: 50%; z-index: 10; pointer-events: none;
    transform: translate(-50%, -50%) rotate(-32deg);
    padding: 4px 22px; border: 6px solid rgba(220, 38, 38, 0.22); border-radius: 16px;
    color: rgba(220, 38, 38, 0.2); font-size: 76px; font-weight: 800; letter-spacing: 6px;
    white-space: nowrap;
  }
  .header { background: #1e1f3b; color: #ffffff; text-align: center; padding: 14px 16px; }
  .header h1 { font-size: 22px; letter-spacing: 0.5px; margin-bottom: 6px; }
  .header p { font-size: 11.5px; opacity: 0.92; margin-top: 4px; }
  .meta {
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    border: 1px solid #c4c7d0; background: #f3f4f6; padding: 8px 12px; margin-top: 12px;
  }
  .meta .doc-type { font-size: 15px; font-weight: 700; color: #111827; }
  .meta .meta-item { font-weight: 700; color: #111827; }
  .meta .copy { font-size: 9.5px; font-weight: 700; color: #374151; }
  .parties { display: flex; gap: 14px; margin-top: 12px; }
  .party { flex: 1; border: 1px solid #c4c7d0; background: #f3f4f6; }
  .party-title { background: #1e1f3b; color: #ffffff; font-weight: 700; padding: 6px 10px; font-size: 12px; }
  .party-body { padding: 8px 10px; display: grid; gap: 5px; }
  .party-name { font-size: 13px; font-weight: 700; color: #111827; }
  .strong { font-weight: 700; color: #111827; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; border: 1.5px solid #1e1f3b; }
  thead th {
    background: #1e1f3b; color: #ffffff; font-size: 10px; font-weight: 700;
    padding: 7px 5px; border: 1px solid #3a3c5c; text-align: center; line-height: 1.35;
  }
  tbody td { border: 1px solid #c4c7d0; padding: 6px 6px; height: 26px; vertical-align: middle; }
  tbody tr:nth-child(even) td { background: #eef0f3; }
  .center { text-align: center; }
  .right { text-align: right; white-space: nowrap; }
  .item-name { font-weight: 600; color: #111827; }
  .cell-rate { font-size: 8.5px; color: #6b7280; }
  .totals { margin-top: 12px; border: 1px solid #c4c7d0; background: #f3f4f6; }
  .total-row { display: flex; justify-content: space-between; padding: 7px 10px; font-weight: 700; color: #111827; }
  .net { display: flex; justify-content: space-between; background: #1e1f3b; color: #ffffff; padding: 9px 10px; font-size: 13.5px; font-weight: 700; }
  .words { margin-top: 8px; font-style: italic; }
  .words strong { font-weight: 700; }
  .footer { display: flex; margin-top: 12px; border-top: 1px solid #c4c7d0; padding-top: 10px; min-height: 110px; }
  .terms { flex: 1; padding-right: 12px; border-right: 1px solid #c4c7d0; }
  .terms h4 { font-size: 11.5px; margin-bottom: 6px; color: #111827; }
  .signatory { width: 38%; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding-left: 12px; }
  .signatory .for { font-size: 12.5px; font-weight: 700; color: #111827; }
  .signatory .sign { font-size: 10px; color: #9ca3af; }
  .generated { text-align: center; font-size: 9.5px; color: #9ca3af; margin-top: 10px; }
</style>
</head>
<body>
  <div class="invoice">
    ${isCancelled ? '<div class="watermark">CANCELLED</div>' : ''}
    <div class="header">
      <h1>${escapeHtml(companyName.toUpperCase())}</h1>
      ${
        company?.headOfficeAddress
          ? `<p>${escapeHtml(company.headOfficeAddress.toUpperCase())}</p>`
          : ''
      }
      ${companyContact ? `<p>${escapeHtml(companyContact)}</p>` : ''}
    </div>

    <div class="meta">
      <span class="doc-type">${escapeHtml(bill.type)}</span>
      <span class="meta-item">Invoice No: ${escapeHtml(
        formatBillNumber(bill.billNumber)
      )}</span>
      <span class="meta-item">Date: ${escapeHtml(
        formatDate(bill.billDate)
      )}</span>
      <span class="meta-item">Supply: ${
        isInterState ? 'Inter-state' : 'Intra-state'
      }</span>
      <span class="copy">[ ${copy} ]</span>
    </div>

    <div class="parties">
      ${renderParty('Bill To Party', bill, vendor)}
      ${renderParty('Ship To Party', bill, vendor)}
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 4%">Sr.</th>
          <th style="width: 20%">Item Name</th>
          <th style="width: 8%">HSN</th>
          <th style="width: 9%">Qty</th>
          <th style="width: 6%">Unit</th>
          <th style="width: 10%">Rate (Rs.)</th>
          <th style="width: 10%">CGST${rateHeader(2)}</th>
          <th style="width: 10%">SGST${rateHeader(2)}</th>
          <th style="width: 10%">IGST${rateHeader(1)}</th>
          <th style="width: 13%">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${rows.join('')}
        ${fillerRows.join('')}
      </tbody>
    </table>

    <div class="totals">
      <div class="total-row"><span>Subtotal:</span><span>Rs. ${formatMoney(
        amount
      )}</span></div>
      ${taxRows}
      <div class="net"><span>Net Amount:</span><span>Rs. ${formatMoney(
        totalAmount
      )}</span></div>
    </div>

    <p class="words">Amount in Words: <strong>${escapeHtml(
      amountInWords(totalAmount)
    )}</strong></p>

    <div class="footer">
      <div class="terms">
        <h4>Terms &amp; Conditions:</h4>
        <p>1. Goods once sold will not be taken back.</p>
      </div>
      <div class="signatory">
        <span class="for">For ${escapeHtml(companyName.toUpperCase())}</span>
        <span class="sign">Authorised Signatory</span>
      </div>
    </div>

    <p class="generated">This is a computer generated invoice.</p>
  </div>
</body>
</html>`;
};
