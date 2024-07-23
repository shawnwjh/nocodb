"use client"
import React, { useEffect, useState } from 'react';
import {User} from "@nextui-org/react";
import {
  LogIn,
  LogOut,
  Newspaper,
  ChevronDown,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import axiosInstance from '@/axios/axiosMiddleware';

interface Table {
  id: string;
  source_id: string;
  base_id: string;
  table_name: string;
  title: string;
  type: string;
  meta: {
    hasNonDefaultViews: boolean;
  };
  schema: null;
  enabled: boolean;
  mm: boolean;
  tags: null;
  pinned: null;
  deleted: null;
  order: number;
  created_at: string;
  updated_at: string;
  description: null;
}

interface Base {
  is_meta: boolean;
  id: string;
  title: string;
  prefix: string;
  status: null;
  description: null;
  meta: string;
  color: null;
  uuid: null;
  password: null;
  roles: null;
  deleted: boolean;
  order: number;
  created_at: string;
  updated_at: string;
  sources: any[];
  tables?: Table[];  // Optional to allow initial absence
}

const Sidebar: React.FC = () => {
  const token = process.env.NEXT_PUBLIC_NOCODB_API_KEY;

  const [bases, setBases] = useState<Base[]>([]);

  useEffect(() => {
    const fetchBases = async () => {
      try {
        const basesResponse = await axiosInstance.get('/meta/bases');
        const bases: Base[] = basesResponse.data.list;

        const fetchTables = bases.map(async (base) => {
          const tablesResponse = await axiosInstance.get(`/meta/bases/${base.id}/tables`);
          return {
            ...base,
            tables: tablesResponse.data.list,
          };
        });

        const basesWithTables = await Promise.all(fetchTables);
        setBases(basesWithTables);
      }
      catch (error) {
        console.error("Failed to fetch bases or tables: ", error);
      }
    };

    fetchBases();
  }, [])

  return (
    <aside
      id="default-sidebar"
      className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          {bases.map((base) => (
            <li key={base.id} className="flex">
              <a href={base.id} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <Newspaper className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" />
                <span className="ms-3">{base.title}</span>
              </a>
              <div className="cursor-pointer flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger><ChevronDown /></DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>{base.title}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {base.tables && base.tables.map((table) => (
                      <a href="#" className="cursor-pointer" key={table.id}>
                        <DropdownMenuItem>{table.title}</DropdownMenuItem>
                      </a>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </li>
          ))}
          <li>
            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
              <LogIn className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" />
              <span className="flex-1 ms-3 whitespace-nowrap">Sign In</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
              <LogOut className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" />
              <span className="flex-1 ms-3 whitespace-nowrap">Sign Up</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
              <User   
                name="Jane Doe"
                description="Editor"
                avatarProps={{
                  src: "https://i.pravatar.cc/150?u=a04258114e29026702d"
                }}
              />
            </a>
          </li>
        </ul>

      </div>
    </aside>
  );
};

export default Sidebar;
