import {
  ICreateVendorRequest,
  IResponse,
  IVendor,
} from '@invoicely/api-interfaces';
import { clientAxios } from '../../libs/axiosInstance';

export type IUpdateVendorRequest = Partial<ICreateVendorRequest>;

const vendorRoute = (companyId: string, vendorId?: string) =>
  vendorId
    ? `/companies/${companyId}/vendors/${vendorId}`
    : `/companies/${companyId}/vendors`;

export const createVendor = async (
  companyId: string,
  vendorDetails: ICreateVendorRequest,
  token: string
): Promise<IResponse<IVendor>> => {
  const res = await clientAxios.post(vendorRoute(companyId), vendorDetails, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getVendors = async (
  companyId: string,
  token: string,
  search?: string
): Promise<IResponse<IVendor[]>> => {
  const res = await clientAxios.get(vendorRoute(companyId), {
    headers: { Authorization: `Bearer ${token}` },
    params: search?.trim() ? { search: search.trim() } : undefined,
  });
  return res.data;
};

export const getVendorById = async (
  companyId: string,
  vendorId: string,
  token: string
): Promise<IResponse<IVendor>> => {
  const res = await clientAxios.get(vendorRoute(companyId, vendorId), {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateVendor = async (
  companyId: string,
  vendorId: string,
  vendorDetails: IUpdateVendorRequest,
  token: string
): Promise<IResponse<IVendor>> => {
  const res = await clientAxios.patch(
    vendorRoute(companyId, vendorId),
    vendorDetails,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const deleteVendor = async (
  companyId: string,
  vendorId: string,
  token: string
): Promise<void> => {
  await clientAxios.delete(vendorRoute(companyId, vendorId), {
    headers: { Authorization: `Bearer ${token}` },
  });
};
