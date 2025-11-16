import axios from 'axios';

export const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL + '/api';
export const NEXT_API_URL = '/api';

export const loginUserClient = async (
  // dispatch: AppDispatch,
  idToken: string
) => {
  return axios.post(
    `${API_BACKEND_URL}/auth/login/google`,
    {
      idToken,
    },
    { withCredentials: true } // ✅ REQUIRED
  );
  // dispatch(setUser(res.data.data));
};

export const loginUserNextJSClient = async (
  // dispatch: AppDispatch,
  idToken: string
) => {
  await axios.post(
    `${NEXT_API_URL}/auth`,
    {
      idToken,
    },
    { withCredentials: true } // ✅ REQUIRED
  );
  // dispatch(setUser(res.data.data));
};

export const logOutUserClient = async () =>
  // dispatch: AppDispatch,
  {
    await axios.post(
      `${API_BACKEND_URL}/auth/logout`,
      {},
      { withCredentials: true } // ✅ REQUIRED
    );
    // dispatch(setUser(res.data.data));
  };
