'use client';

import { IUser } from '@invoicely/api-interfaces';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IoMdClose, IoMdMenu } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import useWindowSize from '../hooks/useWindowSize';
import { setUser } from '../redux/slices/userSlice';
import { RootState } from '../redux/store';
import ThemeToggle from '../theme/ThemeToggle';
import { logOutUserClient } from '../utils/auth';
import UserMenu from './menu/UserMenu';
import Sidebar from './Sidebar';

const Header = () => {
  const dispatch = useDispatch();
  const { data: user } = useSelector((state: RootState) => state.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userDetails: Pick<IUser, 'firstName' | 'lastName' | 'profile'> = {
    firstName: user?.firstName || 'Om J',
    lastName: user?.lastName || 'Patel',
    profile:
      user?.profile || 'https://avatars.githubusercontent.com/u/119939918?v=4',
  };

  const windowSize = useWindowSize();

  useEffect(() => {
    if (windowSize.width > 1024) {
      setSidebarOpen(false);
    }
  }, [windowSize.width]);

  const handleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleLogoutClick = async () => {
    dispatch(setUser(null));
    await logOutUserClient();
    redirect('/auth/signin');
  };

  const renderAuthUI = () => {
    return (
      <>
        <ThemeToggle />
        <UserMenu
          handleLogoutClick={handleLogoutClick}
          user={userDetails}
          isLoggedIn={!!user}
        />
      </>
    );
  };

  return (
    <>
      <header className="fixed top-0 z-50 px-8 max2xs:px-4 h-14 w-full bg-primary-light dark:bg-primary-dark border-b-4 border-b-secondary-light dark:border-b-secondary-dark transition-colors duration-300">
        <nav className="flex justify-between items-center h-full">
          <Link href="/">
            <h1 className="text-2xl max2xs:text-xl max3xs:text-base font-semibold tracking-widest">
              <span className="text-secondary-light dark:text-secondary-dark">
                In
              </span>
              voicely
            </h1>
          </Link>

          <div className="flex items-center gap-2">
            {renderAuthUI()}

            <div
              onClick={handleSidebar}
              className="hidden maxLg:block ml-1 text-3xl max2xs:text-2xl cursor-pointer"
            >
              {sidebarOpen ? <IoMdClose /> : <IoMdMenu />}
            </div>
          </div>

          {sidebarOpen && (
            <>
              <Sidebar
                handleLogoutClick={handleLogoutClick}
                sidebarOpen={sidebarOpen}
              />
            </>
          )}
        </nav>
      </header>
    </>
  );
};

export default Header;
