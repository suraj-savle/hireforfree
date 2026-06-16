"use client";

import { useState } from "react";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Menu } from "lucide-react";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Sidebar Component with active state injection */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Container view wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Responsive Desktop & Mobile Quick Top-Bar Control */}
        <header className="h-16 border-b border-[#272d68]/10 bg-white flex items-center px-4 md:px-8 shrink-0 justify-between md:justify-end">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 rounded-xl text-[#272d68] hover:bg-[#ceeeed]/40 transition-colors lg:hidden"
            aria-label="Open navigation sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 bg-[#272d68]/5 text-[#272d68] rounded-md">
              Secure Session
            </span>
          </div>
        </header>

        {/* Scrollable Core Content area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 text-[#272d68]">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}