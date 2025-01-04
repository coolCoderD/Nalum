import React from 'react';
import { useAuth } from '../../context/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}


export function DashboardLayout({ children, sidebar }: DashboardLayoutProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col  gap-8">
          {sidebar && (
            <div className="w-full  flex-shrink-0">
              {sidebar}
            </div>
          )}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}