import { Sidebar } from "@/components/sidebar";
import { mockUserProfile, mockBrandLogo } from "@/lib/mock-data";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] dark:bg-slate-950 dark:text-slate-100">
      {/* Desktop Sidebar (w-72) */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col z-50">
        <Sidebar />
      </div>

      {/* Main Container */}
      <div className="flex flex-1 flex-col lg:pl-72">
        {/* Desktop Top Header Bar (Fixed) */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/70 bg-[#f7f9fb]/80 px-6 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] dark:border-slate-800 dark:bg-slate-900/80">
          {/* Mobile Brand / Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mockBrandLogo.src}
                alt={mockBrandLogo.alt}
                className="h-7 w-7 object-contain"
              />
            </div>
            <span className="font-display text-[15px] font-bold">
              Follow-up Board
            </span>
          </div>

          {/* Search & Date Filter (Desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="relative flex items-center w-80">
              <span className="material-symbols-outlined absolute left-3 text-slate-400 text-[18px] pointer-events-none">
                search
              </span>
              <input
                type="text"
                placeholder="ค้นหาผู้ติดต่อ, กิจกรรม, หรือดีล..."
                className="w-full rounded-lg border border-slate-200/80 bg-white py-2 pl-9 pr-14 text-[13px] placeholder:text-slate-400 focus:border-[#4b41e1] focus:outline-none focus:ring-2 focus:ring-[#4b41e1]/20 transition-all dark:border-slate-700 dark:bg-slate-800 dark:placeholder:text-slate-500"
              />
              <kbd className="absolute right-2.5 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                Ctrl K
              </kbd>
            </div>

            <div className="hidden xl:flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1.5 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <span className="material-symbols-outlined text-[16px] text-slate-500">
                event
              </span>
              <span className="text-[12px] font-medium">
                วันพุธที่ 24 พ.ค. 2024
              </span>
            </div>
          </div>

          {/* Top Right Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg bg-[#4b41e1] px-3.5 py-2 text-[12px] font-semibold text-white shadow-sm hover:opacity-95 transition-opacity"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>เพิ่มรายชื่อด่วน</span>
            </button>

            <button
              type="button"
              aria-label="การแจ้งเตือน"
              className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-200/60 transition-colors dark:hover:bg-slate-800 dark:text-slate-400"
            >
              <span className="material-symbols-outlined text-[20px]">
                notifications
              </span>
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#ba1a1a] ring-2 ring-[#f7f9fb] dark:ring-slate-900" />
            </button>

            <div className="flex items-center pl-1">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mockUserProfile.avatar}
                  alt={mockUserProfile.name}
                  className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                />
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-[#009668] ring-2 ring-[#f7f9fb] dark:ring-slate-900" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 px-6 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
