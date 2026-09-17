"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { mockUserProfile, mockBrandLogo } from "@/lib/mock-data";
import { authClient } from "@/lib/auth-client";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className = "" }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/sign-up");
            router.refresh();
          },
        },
      });
    } catch {
      router.push("/sign-up");
    }
  };

  const displayName = session?.user?.name || mockUserProfile.name;
  const displayRole = session?.user?.email || mockUserProfile.role;
  const displayAvatar = session?.user?.image || mockUserProfile.avatar;

  const navigation = [
    {
      name: "แดชบอร์ด",
      href: "/dashboard",
      icon: "dashboard",
      current: pathname === "/dashboard",
    },
    {
      name: "รายชื่อผู้ติดต่อ",
      href: "/contacts",
      icon: "group",
      current: pathname === "/contacts",
    },
    {
      name: "เพิ่มผู้ติดต่อใหม่",
      href: "/contacts/new",
      icon: "person_add",
      current: pathname === "/contacts/new",
    },
    {
      name: "ปฏิทินติดตาม",
      href: "/calendar",
      icon: "calendar_month",
      current: pathname === "/calendar",
    },
    {
      name: "รายงาน & สรุปผล",
      href: "/reports",
      icon: "bar_chart",
      current: pathname === "/reports",
    },
    {
      name: "ตั้งค่าระบบ",
      href: "/settings",
      icon: "settings",
      current: pathname === "/settings",
    },
  ];

  return (
    <aside
      className={`flex h-full w-72 flex-col justify-between border-r border-slate-200/80 bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)] select-none dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="flex h-16 items-center gap-3 px-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mockBrandLogo.src}
              alt={mockBrandLogo.alt}
              className="h-8 w-auto object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-[15px] font-bold leading-none tracking-tight text-slate-900 dark:text-white">
              Follow-up Board
            </span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              CRM &amp; Task Tracker
            </span>
          </div>
        </div>

        {/* Section Title */}
        <div className="px-5 py-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            ระบบงานขาย
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1 px-3">
          {navigation.map((item) => {
            const isActive = item.current;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-all ${
                  isActive
                    ? "bg-[#4b41e1] font-semibold text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[20px] transition-transform group-hover:scale-105 ${
                    isActive ? "text-white" : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile Card at Bottom */}
      <div className="m-3 rounded-xl bg-slate-50 p-2.5 shadow-[0_1px_4px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center justify-between dark:bg-slate-800/60 dark:border-slate-700/60">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="relative flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayAvatar}
              alt={displayName}
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-[#009668] ring-2 ring-white dark:ring-slate-900" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="truncate text-[12px] font-semibold text-slate-800 dark:text-slate-100">
              {displayName}
            </span>
            <span className="truncate text-[10px] text-slate-400 dark:text-slate-500">
              {displayRole}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          aria-label="ออกจากระบบ"
          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors dark:hover:bg-slate-700 dark:hover:text-white"
          title="ออกจากระบบ"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
        </button>
      </div>
    </aside>
  );
}
