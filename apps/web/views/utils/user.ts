import { clientAxios } from '../../libs/axiosInstance';

export const fetchUserDetails = async (token: string) =>
// dispatch: AppDispatch,
{
  const res = await clientAxios.get(`/user/profile`, { headers: { Authorization: `Bearer ${token}` } });
  // dispatch(setUser(res.data.data));
  return res.data.data;
};
