'use client';

import Navbar from '@/components/NavBar/navbar';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const LayoutPersonal = ({ children }: LayoutProps) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default LayoutPersonal;
