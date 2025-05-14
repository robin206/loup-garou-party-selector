
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
  type?: "button" | "submit" | "reset";
  size?: "default" | "sm" | "lg" | "icon";
  title?: string;
  href?: string;
  target?: string;
  rel?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'default',
  disabled = false,
  fullWidth = false,
  className = '',
  type = 'button',
  size = 'default',
  title,
  href,
  target,
  rel,
}) => {
  return (
    <ShadcnButton
      onClick={onClick}
      variant={variant}
      disabled={disabled}
      type={type}
      size={size}
      title={title}
      className={cn(
        fullWidth && 'w-full',
        variant === 'outline' && 'text-foreground',
        className
      )}
      asChild={!!href}
    >
      {href ? (
        <a href={href} target={target} rel={rel}>
          {children}
        </a>
      ) : (
        children
      )}
    </ShadcnButton>
  );
};

export default Button;
