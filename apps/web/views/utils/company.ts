import { IResponse, IVerifyGSTNumberRequest, IVerifyGSTNumberResponse } from "shared/api-interfaces/src";
import { clientAxios } from "../../libs/axiosInstance";

export const verifyGSTNumber = async ({gstNumber}: IVerifyGSTNumberRequest): Promise<IResponse<IVerifyGSTNumberResponse>> =>
  // dispatch: AppDispatch,
  {
    const res = await clientAxios.get(`/company/gst/verify?gstNumber=${gstNumber}`);
    // dispatch(setUser(res.data.data));
    return res.data;
  };