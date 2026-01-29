import type { InputHTMLAttributes, ReactNode } from 'react';

export interface HeadlingProps extends InputHTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  appearence?: 'client' | 'admin'; 
}