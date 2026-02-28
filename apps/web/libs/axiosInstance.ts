import axios from 'axios';

export const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL + '/api';

// ✅ 2. Client-side axios (for useEffect, client components, etc.)
export const clientAxios = axios.create({
  baseURL: API_BACKEND_URL,
  withCredentials: true, // ensures cookies are sent automatically
});
