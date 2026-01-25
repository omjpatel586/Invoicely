import axios from 'axios';

// ✅ 2. Client-side axios (for useEffect, client components, etc.)
export const clientAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // ensures cookies are sent automatically
});
