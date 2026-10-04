import { IBillingDetails, IBillLineItem } from '@invoicely/api-interfaces';
import { GstSupplyType } from '@invoicely/constants';

const toPaise = (value: string | null) => {
  const amount = Number.parseFloat(value ?? '');
  return Number.isFinite(amount) ? Math.round(amount * 100) : 0;
};

const fromPaise = (paise: number) => (paise / 100).toFixed(2);

export const calculateLineTotal = (
  unitPrice: string | null,
  quantity: number | null
): string => fromPaise(Math.round(toPaise(unitPrice) * (quantity ?? 0)));

export interface LineGst {
  cgstAmount: string;
  sgstAmount: string;
  igstAmount: string;
}

const calculateLineGstPaise = (
  lineItem: IBillLineItem,
  supplyType: GstSupplyType
) => {
  const lineAmount = toPaise(lineItem.totalPrice);
  const gstSlab = lineItem.gstSlab ?? 0;

  if (supplyType === GstSupplyType.INTER_STATE) {
    return { cgst: 0, sgst: 0, igst: Math.round((lineAmount * gstSlab) / 100) };
  }

  const halfGst = Math.round((lineAmount * gstSlab) / 200);
  return { cgst: halfGst, sgst: halfGst, igst: 0 };
};

export const calculateLineGst = (
  lineItem: IBillLineItem,
  supplyType: GstSupplyType
): LineGst => {
  const { cgst, sgst, igst } = calculateLineGstPaise(lineItem, supplyType);
  return {
    cgstAmount: fromPaise(cgst),
    sgstAmount: fromPaise(sgst),
    igstAmount: fromPaise(igst),
  };
};

export const calculateBillingDetails = (
  lineItems: IBillLineItem[],
  supplyType: GstSupplyType
): IBillingDetails => {
  let amount = 0;
  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;

  lineItems.forEach((lineItem) => {
    const { cgst, sgst, igst } = calculateLineGstPaise(lineItem, supplyType);
    amount += toPaise(lineItem.totalPrice);
    cgstAmount += cgst;
    sgstAmount += sgst;
    igstAmount += igst;
  });

  const gstAmount = cgstAmount + sgstAmount + igstAmount;

  return {
    amount: fromPaise(amount),
    cgstAmount: fromPaise(cgstAmount),
    sgstAmount: fromPaise(sgstAmount),
    igstAmount: fromPaise(igstAmount),
    gstAmount: fromPaise(gstAmount),
    totalAmount: fromPaise(amount + gstAmount),
  };
};
