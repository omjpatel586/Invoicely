import axios from 'axios';
import { API_BACKEND_URL } from '../../libs/axiosInstance';

export const loginUserClient = async (
  idToken: string
) => {
  return axios.post(
    `${API_BACKEND_URL}/auth/login/google`,
    {
      idToken,
    },
  );
};

export const logOutUserClient = async (token: string) => {
  await axios.post(
    `${API_BACKEND_URL}/auth/logout`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
