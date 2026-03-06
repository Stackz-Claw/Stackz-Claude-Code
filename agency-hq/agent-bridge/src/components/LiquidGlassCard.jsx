import { FC, PropsWithChildren } from 'react';
import clsx from 'clsx';

export const LiquidGlassCard: FC<PropsWithChildren> = ({ children }) => (
  <div
    className={clsx(
      'relative',
      'rounded-md',
      'overflow-hidden',
      'bg-white/20',
      'backdrop-blur-lg',
      'border border-white/10',
      'p-4',
      'hover:cursor-pointer',
      'transition-all duration-200 ease-in-out'
    )}
  >
    {children}
  </div>
);
