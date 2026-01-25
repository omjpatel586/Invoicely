import { clientAxios } from '../../libs/axiosInstance';

export const fetchUserDetails = async () =>
  // dispatch: AppDispatch,
  {
    const res = await clientAxios.get(`/user/profile`);
    // dispatch(setUser(res.data.data));
    return res.data.data;
  };
