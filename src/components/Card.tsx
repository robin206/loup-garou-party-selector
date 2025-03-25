
import React from 'react';
import { Card as ShadcnCard, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  className = '',
}) => {
  return (
    <ShadcnCard className={className}>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        {children}
      </CardContent>
    </ShadcnCard>
  );
};

export default Card;
