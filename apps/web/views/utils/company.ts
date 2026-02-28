import { ICreateCompanyRequest, IGetCompanyResponse, IResponse, IVerifyGSTNumberRequest, IVerifyGSTNumberResponse } from "@invoicely/api-interfaces";
import { clientAxios } from "../../libs/axiosInstance";

export const verifyGSTNumber = async ({ gstNumber }: IVerifyGSTNumberRequest): Promise<IResponse<IVerifyGSTNumberResponse>> => {
  const res = await clientAxios.get(`/company/gst/verify?gstNumber=${gstNumber}`);
  return res.data;
};

export const createCompany = async (companyDetails: ICreateCompanyRequest): Promise<IResponse<IGetCompanyResponse>> => {
  const res = await clientAxios.post('/user/company', companyDetails);
  return res.data;
};

export const getUserCompanies = async (): Promise<IResponse<IGetCompanyResponse[]>> => {
  const res = await clientAxios.get('/user/companies');
  return res.data;
};