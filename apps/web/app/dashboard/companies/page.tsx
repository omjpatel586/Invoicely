'use client';

import Company from '@/views/dashboardPage/Company';
import { setLoading, setUser } from '@/views/redux/slices/userSlice';
import { fetchUserDetails } from '@/views/utils/user';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function CompanyView() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        dispatch(setLoading(true));
        const userDetails = await fetchUserDetails();
        dispatch(setUser(userDetails));
      } catch (err) {
        console.error('Failed to fetch user:', err);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchProfile();
  }, [dispatch]);

  return <Company />;
}
