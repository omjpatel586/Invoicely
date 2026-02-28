import { IUser } from '@invoicely/api-interfaces';
import Image from 'next/image';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import { FiLogOut } from 'react-icons/fi';
import MenuItem from './MenuItem';

interface HandleLogoutProps {
  handleLogoutClick: () => void;
  user: Pick<IUser, 'firstName' | 'lastName' | 'profile'>;
  isLoggedIn: boolean;
}

const UserMenu = ({
  handleLogoutClick,
  user,
  isLoggedIn,
}: HandleLogoutProps) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | globalThis.MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2"
      >
        <Image
          src={user.profile}
          width={100}
          height={100}
          alt={`Profile picture of ${user.firstName}`}
          className="w-8 h-8 max3xs:w-7 max3xs:h-7 rounded-full border-2 border-text-light dark:border-text-dark"
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 max2xs:w-52 bg-card-light dark:bg-card-dark rounded-xl shadow-lg z-50 overflow-hidden border border-secondary-light dark:border-secondary-dark">
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <Image
                src={user.profile}
                width={100}
                height={100}
                alt={`Profile picture of ${user.firstName}`}
                className="w-12 h-12 rounded-full border-2 border-text-light dark:border-text-dark object-cover"
              />
              <div>
                <p className="font-semibold">
                  {user.firstName + ' ' + user.lastName}
                </p>
                <p className="text-xs"></p>
              </div>
            </div>
          </div>

          {isLoggedIn && (
            <ul className="text-sm">
              <MenuItem
                icon={<FiLogOut />}
                label="Logout"
                onClick={handleLogoutClick}
              />
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default UserMenu;
