'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading, setUser } from '../redux/slices/userSlice';
import { fetchUserDetails } from '../utils/user';
import Company from './Company';

const DashboardPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('invoicelyAppAuthToken') as string;
        dispatch(setLoading(true));
        const userDetails = await fetchUserDetails(token);
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
};

export default DashboardPage;
