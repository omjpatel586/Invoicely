import axios from 'axios';

export const API_BACKEND_URL = 'http://localhost:4000' + '/api';

export const loginUserClient = async (
  // dispatch: AppDispatch,
  idToken: string
) => {
  await axios.post(
    `${API_BACKEND_URL}/auth/login/google`,
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
