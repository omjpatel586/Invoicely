import {
  ICreateProductRequest,
  IProduct,
  IResponse,
} from '@invoicely/api-interfaces';
import { clientAxios } from '../../libs/axiosInstance';

export type IUpdateProductRequest = Partial<ICreateProductRequest>;

type ProductApiShape = Omit<IProduct, 'unitPrice'> & {
  unitPrice:
    | string
    | number
    | null
    | {
        $numberDecimal?: string;
      };
};

const productRoute = (companyId: string, productId?: string) =>
  productId
    ? `/companies/${companyId}/products/${productId}`
    : `/companies/${companyId}/products`;

const normalizeDecimal = (
  value: ProductApiShape['unitPrice']
): string => {
  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number') {
    return value.toString();
  }

  if (value && typeof value === 'object' && '$numberDecimal' in value) {
    return value.$numberDecimal || '0';
  }

  return '0';
};

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
