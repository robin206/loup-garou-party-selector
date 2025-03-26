
import React from 'react';
import { Button as ShadcnButton } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'default',
  disabled = false,
  fullWidth = false,
  className = '',
}) => {
  return (
    <ShadcnButton
      onClick={onClick}
      variant={variant}
      disabled={disabled}
      className={cn(
        fullWidth && 'w-full',
        className
      )}
    >
      {children}
    </ShadcnButton>
  );
};

export default Button;
