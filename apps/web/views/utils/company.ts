import { ICreateCompanyRequest, IGetCompanyResponse, IResponse, IVerifyGSTNumberRequest, IVerifyGSTNumberResponse } from "@invoicely/api-interfaces";
import { clientAxios } from "../../libs/axiosInstance";

export const verifyGSTNumber = async ({ gstNumber }: IVerifyGSTNumberRequest, token: string): Promise<IResponse<IVerifyGSTNumberResponse>> => {
  const res = await clientAxios.get(`/company/gst/verify?gstNumber=${gstNumber}`, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};

export const createCompany = async (companyDetails: ICreateCompanyRequest, token: string): Promise<IResponse<IGetCompanyResponse>> => {
  const res = await clientAxios.post('/user/company', companyDetails, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};

export const getUserCompanies = async (token: string): Promise<IResponse<IGetCompanyResponse[]>> => {
  const res = await clientAxios.get('/user/companies', { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};