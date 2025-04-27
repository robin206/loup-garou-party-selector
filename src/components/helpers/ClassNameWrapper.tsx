
import React from 'react';

interface ClassNameWrapperProps<T = {}> {
  component: React.ComponentType<T & { className?: string }>;
  className?: string;
  [key: string]: any;
}

const ClassNameWrapper = <T extends {}>({ 
  component: Component, 
  className, 
  ...props 
}: ClassNameWrapperProps<T>) => {
  return <Component {...props as T} className={className} />;
};

export default ClassNameWrapper;
