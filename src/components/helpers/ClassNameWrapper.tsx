
import React from 'react';

interface ClassNameWrapperProps {
  component: React.ComponentType;
  className?: string;
  [key: string]: any;
}

const ClassNameWrapper: React.FC<ClassNameWrapperProps> = ({ 
  component: Component, 
  className, 
  ...props 
}) => {
  return <Component {...props} className={className} />;
};

export default ClassNameWrapper;
