'use client';

import { useEffect, useState } from 'react';
import useWindowSize from '../hooks/useWindowSize';
import ThemeToggle from '../theme/ThemeToggle';
import UserMenu from './menu/UserMenu';
import { IoMdClose, IoMdMenu } from 'react-icons/io';
import Sidebar from './Sidebar';

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const windowSize = useWindowSize();

  useEffect(() => {
    if (windowSize.width > 1024) {
      setSidebarOpen(false);
    }
  }, [windowSize.width]);

  const handleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleLogoutClick = () => {};
  const handleLoginClick = () => {};

  const renderAuthUI = () => {
    return (
      <>
        <ThemeToggle />
        <UserMenu handleLogoutClick={handleLogoutClick} />
      </>
    );
  };

  return (
    <>
      <header className="fixed top-0 z-50 px-8 max2xs:px-4 h-14 w-full bg-primary-light dark:bg-primary-dark border-b-4 border-b-secondary-light dark:border-b-secondary-dark transition-colors duration-300">
        <nav className="flex justify-between items-center h-full">
          <a href="/">
            <h1 className="text-2xl max2xs:text-xl max3xs:text-base font-semibold tracking-widest">
              <span className="text-secondary-light dark:text-secondary-dark">
                In
              </span>
              voicely
            </h1>
          </a>

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
                handleLoginClick={handleLoginClick}
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
