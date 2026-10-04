import {
  IBill,
  IBillingDetails,
  IBillLineItem,
  ICreateBillRequest,
  IResponse,
} from '@invoicely/api-interfaces';
import { clientAxios } from '../../libs/axiosInstance';
import { DecimalApiValue, normalizeNullableDecimal } from '@invoicely/utils';

export type IUpdateBillRequest = Partial<ICreateBillRequest>;

type BillLineItemApiShape = Omit<IBillLineItem, 'unitPrice' | 'totalPrice'> & {
  unitPrice: DecimalApiValue;
  totalPrice: DecimalApiValue;
};

type BillApiShape = Omit<IBill, 'products' | 'billingDetails'> & {
  products: BillLineItemApiShape[];
  billingDetails: { [K in keyof IBillingDetails]: DecimalApiValue };
};

const billRoute = (companyId: string, billId?: string) =>
  billId
    ? `/companies/${companyId}/bills/${billId}`
    : `/companies/${companyId}/bills`;

const normalizeBill = (bill: BillApiShape): IBill => ({
  ...bill,
  products: (bill.products ?? []).map((product) => ({
    ...product,
    unitPrice: normalizeNullableDecimal(product.unitPrice),
    totalPrice: normalizeNullableDecimal(product.totalPrice),
  })),
  billingDetails: {
    amount: normalizeNullableDecimal(bill.billingDetails?.amount),
    cgstAmount: normalizeNullableDecimal(bill.billingDetails?.cgstAmount),
    sgstAmount: normalizeNullableDecimal(bill.billingDetails?.sgstAmount),
    igstAmount: normalizeNullableDecimal(bill.billingDetails?.igstAmount),
    gstAmount: normalizeNullableDecimal(bill.billingDetails?.gstAmount),
    totalAmount: normalizeNullableDecimal(bill.billingDetails?.totalAmount),
  },
});

export const createBill = async (
  companyId: string,
  billDetails: ICreateBillRequest,
  token: string
): Promise<IResponse<IBill>> => {
  const res = await clientAxios.post<IResponse<BillApiShape>>(
    billRoute(companyId),
    billDetails,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return {
    ...res.data,
    data: normalizeBill(res.data.data),
  };
};

export const getBills = async (
  companyId: string,
  token: string
): Promise<IResponse<IBill[]>> => {
  const res = await clientAxios.get<IResponse<BillApiShape[]>>(
    billRoute(companyId),
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return {
    ...res.data,
    data: res.data.data.map(normalizeBill),
  };
};

export const getBillById = async (
  companyId: string,
  billId: string,
  token: string
): Promise<IResponse<IBill>> => {
  const res = await clientAxios.get<IResponse<BillApiShape>>(
    billRoute(companyId, billId),
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return {
    ...res.data,
    data: normalizeBill(res.data.data),
  };
};

export const updateBill = async (
  companyId: string,
  billId: string,
  billDetails: IUpdateBillRequest,
  token: string
): Promise<IResponse<IBill>> => {
  const res = await clientAxios.patch<IResponse<BillApiShape>>(
    billRoute(companyId, billId),
    billDetails,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return {
    ...res.data,
    data: normalizeBill(res.data.data),
  };
};

export const deleteBill = async (
  companyId: string,
  billId: string,
  token: string
): Promise<void> => {
  await clientAxios.delete(billRoute(companyId, billId), {
    headers: { Authorization: `Bearer ${token}` },
  });
};
