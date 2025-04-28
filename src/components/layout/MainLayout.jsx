import React from 'react';
import AppSidebar from "@/components/layout/Sidebar";

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 overflow-auto">
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}