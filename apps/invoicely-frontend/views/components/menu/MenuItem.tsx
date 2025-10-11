import { ReactNode, MouseEventHandler } from 'react';
import clsx from 'clsx';

interface MenuItemProps {
  icon: ReactNode;
  label: ReactNode;
  onClick?: MouseEventHandler<HTMLLIElement>;
  pxClass?: string;
}

const MenuItem = ({
  icon,
  label,
  onClick,
  pxClass = 'px-4',
}: MenuItemProps) => (
  <li
    className={clsx(
      'flex items-center py-3 cursor-pointer hover:bg-hover-light hover:dark:bg-hover-dark transition-colors duration-200',
      pxClass
    )}
    onClick={onClick}
  >
    <span className="mr-3">{icon}</span>
    {label}
  </li>
);

export default MenuItem;
