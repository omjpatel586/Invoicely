'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading, setUser } from '../redux/slices/userSlice';
import { fetchUserDetails } from '../utils/user';

const DashboardPage = ({ token }: { token?: string }) => {
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

  return <></>;
};

export default DashboardPage;
