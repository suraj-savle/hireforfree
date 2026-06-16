"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Briefcase, 
  PlusCircle, 
  LogOut, 
  X,
  FileCheck2
} from "lucide-react";

const menuItems = [
  { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Pending Companies", href: "/admin/dashboard/pending-company", icon: FileCheck2 },
  { label: "All Companies", href: "/admin/dashboard/all-company", icon: Building2 },
  { label: "Students", href: "/admin/dashboard/students", icon: Users },
  { label: "Jobs", href: "/admin/dashboard/jobs", icon: Briefcase },
  { label: "Create Job", href: "/admin/dashboard/create-job", icon: PlusCircle },
  { label: "Applications", href: "/admin/dashboard/applications", icon: FileCheck2 },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <>
      {/* Mobile Dark Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-[#272d68]/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Main Sidebar Panel container block */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-[#272d68] text-white flex flex-col z-50 transition-transform duration-300 ease-in-out shrink-0
        lg:static lg:translate-x-0 border-r border-white/10
        ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
      `}>
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white">
              HireForFree
            </h1>
            <p className="text-xs font-semibold text-[#ceeeed]/60 mt-0.5">
              Admin Control Center
            </p>
          </div>
          
          {/* Close Sidebar Trigger Button (Mobile Viewports Only) */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 text-[#ceeeed] hover:bg-white/10 hover:text-white transition-colors lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation links list block */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 mt-4">
          <ul className="space-y-1.5">
            {menuItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose} // Closes sheet layout on selection paths
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 group ${
                      active
                        ? "bg-[#08a4a3] text-white shadow-md shadow-[#08a4a3]/20"
                        : "text-[#ceeeed]/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${active ? 'text-white' : 'text-[#ceeeed]/50 group-hover:text-white'}`} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Sticky Bottom Section */}
        <div className="p-4 border-t border-white/10 bg-[#212658]">
          <button
            onClick={logout}
            className="w-full rounded-xl bg-white/5 hover:bg-rose-500/10 hover:text-rose-400 border border-white/5 hover:border-rose-500/20 px-4 py-3 text-sm font-bold text-[#ceeeed] transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
          >
            <LogOut className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>
    </>
  );
}