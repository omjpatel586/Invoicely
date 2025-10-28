import { clientAxios } from '../../libs/axiosInstance';

export const API_BACKEND_URL = 'http://localhost:4000' + '/api';

export const fetchUserDetails = async () =>
  // dispatch: AppDispatch,
  {
    const res = await clientAxios.get(`${API_BACKEND_URL}/user/profile`);
    // dispatch(setUser(res.data.data));
    return res.data.data;
  };
