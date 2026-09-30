"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";

export function DashboardShell({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <img 
            src="/logo.jpg" 
            alt="CivicGrid Logo" 
            className="w-8 h-8 rounded-lg object-cover"
          />
          <span className="font-bold text-slate-900">CivicGrid</span>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-md"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Wrapper */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        {sidebar}
        {/* Close Button (Mobile Only) */}
        {sidebarOpen && (
          <button
            className="absolute top-4 right-4 md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md z-50"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        )}
      </div>

      <div className="main-content">
        {children}
      </div>
    </div>
  );
}
