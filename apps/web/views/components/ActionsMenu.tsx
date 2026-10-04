'use client';

import { LucideIcon, MoreVertical } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export interface ActionsMenuItem {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  disabled?: boolean;
  badge?: string;
  tone?: 'default' | 'warning' | 'danger';
  separated?: boolean;
}

interface ActionsMenuProps {
  items: ActionsMenuItem[];
  label?: string;
}

const MENU_WIDTH_PX = 224;
const MENU_ITEM_HEIGHT_PX = 40;
const MENU_OFFSET_PX = 6;

const toneClassNames: Record<NonNullable<ActionsMenuItem['tone']>, string> = {
  default:
    'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5',
  warning:
    'text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/30',
  danger:
    'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30',
};

export function ActionsMenu({
  items,
  label = 'More actions',
}: ActionsMenuProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const isOpen = position !== null;
  const close = () => setPosition(null);

  const handleToggle = () => {
    if (isOpen || !buttonRef.current) {
      close();
      return;
    }

    const rect = buttonRef.current.getBoundingClientRect();
    const estimatedHeight = items.length * MENU_ITEM_HEIGHT_PX + 16;
    const opensUpward =
      rect.bottom + MENU_OFFSET_PX + estimatedHeight > window.innerHeight;

    setPosition({
      top: opensUpward
        ? Math.max(8, rect.top - MENU_OFFSET_PX - estimatedHeight)
        : rect.bottom + MENU_OFFSET_PX,
      left: Math.max(8, rect.right - MENU_WIDTH_PX),
    });
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !menuRef.current?.contains(target) &&
        !buttonRef.current?.contains(target)
      ) {
        close();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        title={label}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition ${
          isOpen
            ? 'border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-400'
            : 'border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
        }`}
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {position && (
        <div
          ref={menuRef}
          role="menu"
          style={{
            top: position.top,
            left: position.left,
            width: MENU_WIDTH_PX,
          }}
          className="fixed z-50 overflow-hidden rounded-xl border border-gray-200 bg-white py-1.5 shadow-xl shadow-black/5 dark:border-gray-800 dark:bg-[#161616] dark:shadow-black/40"
        >
          {items.map((item) => (
            <div key={item.label}>
              {item.separated && (
                <div className="my-1.5 border-t border-gray-100 dark:border-gray-800" />
              )}
              <button
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  close();
                  item.onClick?.();
                }}
                className={`flex w-full items-center gap-3 px-3.5 py-2.5 text-left text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-transparent ${
                  toneClassNames[item.tone ?? 'default']
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:bg-white/10 dark:text-gray-400">
                    {item.badge}
                  </span>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
