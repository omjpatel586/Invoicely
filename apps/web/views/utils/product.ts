import {
  ICreateProductRequest,
  IProduct,
  IResponse,
} from '@invoicely/api-interfaces';
import { clientAxios } from '../../libs/axiosInstance';
import { DecimalApiValue, normalizeDecimal } from '@invoicely/utils';

export type IUpdateProductRequest = Partial<ICreateProductRequest>;

type ProductApiShape = Omit<IProduct, 'unitPrice'> & {
  unitPrice: DecimalApiValue;
};

const productRoute = (companyId: string, productId?: string) =>
  productId
    ? `/companies/${companyId}/products/${productId}`
    : `/companies/${companyId}/products`;

const normalizeProduct = (product: ProductApiShape): IProduct => ({
  ...product,
  unitPrice: normalizeDecimal(product.unitPrice),
});

export const createProduct = async (
  companyId: string,
  productDetails: ICreateProductRequest,
  token: string
): Promise<IResponse<IProduct>> => {
  const res = await clientAxios.post<IResponse<ProductApiShape>>(
    productRoute(companyId),
    productDetails,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return {
    ...res.data,
    data: normalizeProduct(res.data.data),
  };
};

export const getProducts = async (
  companyId: string,
  token: string
): Promise<IResponse<IProduct[]>> => {
  const res = await clientAxios.get<IResponse<ProductApiShape[]>>(
    productRoute(companyId),
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return {
    ...res.data,
    data: res.data.data.map(normalizeProduct),
  };
};

export const getProductById = async (
  companyId: string,
  productId: string,
  token: string
): Promise<IResponse<IProduct>> => {
  const res = await clientAxios.get<IResponse<ProductApiShape>>(
    productRoute(companyId, productId),
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return {
    ...res.data,
    data: normalizeProduct(res.data.data),
  };
};

export const updateProduct = async (
  companyId: string,
  productId: string,
  productDetails: IUpdateProductRequest,
  token: string
): Promise<IResponse<IProduct>> => {
  const res = await clientAxios.patch<IResponse<ProductApiShape>>(
    productRoute(companyId, productId),
    productDetails,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return {
    ...res.data,
    data: normalizeProduct(res.data.data),
  };
};

export const deleteProduct = async (
  companyId: string,
  productId: string,
  token: string
): Promise<void> => {
  await clientAxios.delete(productRoute(companyId, productId), {
    headers: { Authorization: `Bearer ${token}` },
  });
};
