"use client"
import React, { useState } from 'react';

import Sidebar from "@/components/sidebar";
import SidebarButton from "@/components/sidebar-button";


export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className={`App ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <SidebarButton toggleSidebar={toggleSidebar} />
        <Sidebar />
      </div>
    </main>
  );
}
