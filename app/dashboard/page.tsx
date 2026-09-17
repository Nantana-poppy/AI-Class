"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  mockWeeklyTarget,
  mockKpis,
  mockFollowUps,
  mockRecentActivities,
  mockChannelDistribution,
} from "@/lib/mock-data";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "morning" | "afternoon">("all");
  const [summarySent, setSummarySent] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-up");
    }
  }, [session, isPending, router]);

  const toggleTaskCompletion = (id: string) => {
    setCompletedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSendSummary = () => {
    setSummarySent(true);
    setTimeout(() => setSummarySent(false), 3000);
  };

  const filteredTasks = mockFollowUps.filter((task) => {
    if (activeTab === "morning") return task.slot === "morning";
    if (activeTab === "afternoon") return task.slot === "afternoon";
    return true;
  });

  const morningCount = mockFollowUps.filter((t) => t.slot === "morning").length;
  const afternoonCount = mockFollowUps.filter((t) => t.slot === "afternoon").length;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Page Header & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-[26px] sm:text-[30px] font-bold text-slate-900 tracking-tight dark:text-white">
              แดชบอร์ด &amp; ภาพรวมการติดตาม
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#e2dfff] text-[#0f0069] dark:bg-indigo-950 dark:text-indigo-300">
              Active Live
            </span>
          </div>
          <p className="text-[14px] text-slate-500 dark:text-slate-400">
            สวัสดีครับ, คุณ{session?.user?.name || "ผู้ใช้งาน"} 👋 ภาพรวมและรายการติดตามลูกค้าประจำวันนี้ พร้อมดำเนินการต่อได้ทันที
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            type="button"
            onClick={handleSendSummary}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all shadow-sm text-[13px] font-semibold dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <span className="material-symbols-outlined text-[18px] text-slate-400">
              {summarySent ? "check_circle" : "file_download"}
            </span>
            <span>{summarySent ? "ส่งสรุปสำเร็จ!" : "ส่งสรุปรายวัน"}</span>
          </button>

          <Link
            href="/contacts/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4b41e1] text-white hover:bg-[#3f36c5] transition-all shadow-sm text-[13px] font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>+ เพิ่มรายชื่อใหม่</span>
          </Link>
        </div>
      </div>

      {/* Key Metrics (KPIs) 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockKpis.map((kpi) => (
          <div
            key={kpi.id}
            className="relative overflow-hidden p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between dark:bg-slate-900 dark:border-slate-800"
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {kpi.label}
                </span>
                <span className="font-display text-[28px] font-bold text-slate-900 mt-1 leading-none dark:text-white">
                  {kpi.count}
                </span>
              </div>
              <span className={`p-2 rounded-xl ${kpi.iconBg} ${kpi.iconColor}`}>
                <span className="material-symbols-outlined text-[20px]">
                  {kpi.icon}
                </span>
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px]">
              {kpi.isUrgent ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ffdad6] text-[#93000a] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] animate-ping" />
                  {kpi.badgeText}
                </span>
              ) : kpi.dotColor ? (
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <span className={`w-2 h-2 rounded-full ${kpi.dotColor}`} />
                  <span>{kpi.subtext}</span>
                </div>
              ) : (
                <span className="inline-flex items-center gap-1 text-[#009668] font-semibold">
                  <span className="material-symbols-outlined text-[15px]">
                    trending_up
                  </span>
                  {kpi.badgeText}
                </span>
              )}

              {(kpi.isUrgent || kpi.id === "kpi-completed") && (
                <span className="text-slate-400 dark:text-slate-500">
                  {kpi.subtext}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Target Banner: Weekly Goal Progress */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#4b41e1] flex items-center justify-center text-white shadow-md">
            <span className="material-symbols-outlined text-[24px]">flag</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-display text-[16px] font-bold text-slate-900 dark:text-white">
                {mockWeeklyTarget.title}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#e2dfff] text-[#0f0069] text-[11px] font-semibold dark:bg-indigo-950 dark:text-indigo-300">
                {mockWeeklyTarget.badge}
              </span>
            </div>
            <span className="text-[13px] text-slate-500 dark:text-slate-400 truncate">
              {mockWeeklyTarget.description}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-80 flex-shrink-0">
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-[12px]">
              <span className="text-slate-500 dark:text-slate-400">
                {mockWeeklyTarget.progressLabel}
              </span>
              <span className="text-slate-900 font-semibold dark:text-white">
                {mockWeeklyTarget.progressText}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden dark:bg-slate-800">
              <div
                className="h-full bg-[#4b41e1] rounded-full transition-all duration-500"
                style={{ width: `${mockWeeklyTarget.percentage}%` }}
              />
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 min-w-[70px] border border-slate-100 dark:bg-slate-800/60 dark:border-slate-700/60">
            <span className="font-display text-[18px] text-[#4b41e1] font-bold leading-none dark:text-indigo-400">
              {mockWeeklyTarget.percentage}%
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5">สำเร็จ</span>
          </div>
        </div>
      </div>

      {/* 2-Column Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Follow-up List (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* List Header & Segmented Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-[16px] font-bold text-slate-900 dark:text-white">
                รายการที่ต้องติดตามวันนี้
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#4b41e1] text-white text-[11px] font-bold">
                {mockFollowUps.length}
              </span>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 text-slate-600 text-[12px] self-start sm:self-auto dark:bg-slate-800 dark:text-slate-400">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === "all"
                    ? "bg-white text-slate-900 shadow-sm font-semibold dark:bg-slate-700 dark:text-white"
                    : "hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                ทั้งหมด ({mockFollowUps.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("morning")}
                className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === "morning"
                    ? "bg-white text-slate-900 shadow-sm font-semibold dark:bg-slate-700 dark:text-white"
                    : "hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                ช่วงเช้า ({morningCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("afternoon")}
                className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === "afternoon"
                    ? "bg-white text-slate-900 shadow-sm font-semibold dark:bg-slate-700 dark:text-white"
                    : "hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                ช่วงบ่าย ({afternoonCount})
              </button>
            </div>
          </div>

          {/* Tasks List Stack */}
          <div className="flex flex-col gap-3">
            {filteredTasks.map((task) => {
              const isDone = completedTaskIds.includes(task.id);

              return (
                <div
                  key={task.id}
                  className={`p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 dark:bg-slate-900 dark:border-slate-800 ${
                    isDone ? "opacity-40 grayscale" : ""
                  }`}
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full ${task.initialBg} ${task.initialColor} flex items-center justify-center font-display text-[16px] font-bold`}
                    >
                      {task.initial}
                    </div>

                    <div className="flex flex-col min-w-0 gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`font-display text-[15px] font-bold text-slate-900 dark:text-white truncate ${
                            isDone ? "line-through" : ""
                          }`}
                        >
                          {task.name}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium dark:bg-slate-800 dark:text-slate-400">
                          {task.company}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${task.timeBadgeClass}`}
                        >
                          <span className="material-symbols-outlined text-[13px]">
                            {task.isUrgent ? "alarm" : "schedule"}
                          </span>
                          {task.time}
                        </span>
                      </div>

                      <p className="text-[13px] text-slate-600 dark:text-slate-300 line-clamp-1">
                        {task.subject}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">
                            {task.contactType === "tel"
                              ? "call"
                              : task.contactType === "line"
                              ? "chat_bubble"
                              : "mail"}
                          </span>
                          {task.contactValue}
                        </span>
                        {task.secondaryMeta && (
                          <>
                            <span>•</span>
                            <span
                              className={`flex items-center gap-1 font-semibold ${
                                task.secondaryMetaColor || "text-slate-600"
                              }`}
                            >
                              {task.secondaryMeta.includes("฿") && (
                                <span className="material-symbols-outlined text-[14px]">
                                  attach_money
                                </span>
                              )}
                              {task.secondaryMeta}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
                    {task.hasPhoneAction && (
                      <a
                        href={`tel:${task.contactValue}`}
                        title="โทรออกด่วน"
                        className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          call
                        </span>
                      </a>
                    )}
                    {task.hasChatAction && (
                      <button
                        type="button"
                        title="เปิด LINE คุย"
                        className="p-2 rounded-xl bg-slate-100 text-[#009668] hover:bg-[#6ffbbe]/40 transition-colors dark:bg-slate-800 dark:hover:bg-emerald-950"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          chat
                        </span>
                      </button>
                    )}
                    {task.hasCalendarAction && (
                      <button
                        type="button"
                        title="ส่งนัดหมายปฏิทิน"
                        className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          calendar_add_on
                        </span>
                      </button>
                    )}
                    {task.hasEmailAction && (
                      <button
                        type="button"
                        title="ส่งอีเมล"
                        className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          mail
                        </span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleTaskCompletion(task.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold transition-all ${
                        isDone
                          ? "bg-[#009668] text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-[#009668] hover:text-white dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        check_circle
                      </span>
                      <span>{isDone ? "เรียบร้อย" : "เสร็จสิ้น"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Summary Card / Footer note inside tasks area */}
          <div className="p-4 rounded-xl bg-slate-100 flex items-center justify-between border border-slate-200/60 dark:bg-slate-800/60 dark:border-slate-700/60">
            <div className="flex items-center gap-2.5 text-slate-600 text-[13px] dark:text-slate-300">
              <span className="material-symbols-outlined text-[18px] text-[#4b41e1] dark:text-indigo-400">
                tips_and_updates
              </span>
              <span>
                เคล็ดลับ: โทรติดตามลูกค้าช่วง 10:00 - 11:30 น. มีอัตราการรับสายสำเร็จสูงสุด 84%
              </span>
            </div>
            <button
              type="button"
              className="text-[12px] text-[#4b41e1] hover:underline font-semibold flex items-center gap-0.5 dark:text-indigo-400"
            >
              ดูตารางทั้งหมด
              <span className="material-symbols-outlined text-[15px]">
                arrow_forward
              </span>
            </button>
          </div>
        </div>

        {/* Right Column: Timeline & Analytics (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Section 1: Recent Activity Timeline */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col gap-4 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#4b41e1] dark:text-indigo-400">
                  history
                </span>
                <span className="font-display text-[15px] font-bold text-slate-900 dark:text-white">
                  ล่าสุดที่อัปเดต
                </span>
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                อัปเดตอัตโนมัติ
              </span>
            </div>

            <div className="flex flex-col gap-4 relative">
              {/* Timeline Vertical Track */}
              <div className="absolute left-3.5 top-3 bottom-3 w-0.5 bg-slate-100 -z-0 dark:bg-slate-800" />

              {mockRecentActivities.map((event) => (
                <div key={event.id} className="flex items-start gap-3 relative z-10">
                  <div
                    className={`w-7 h-7 rounded-full ${event.iconBg} ${event.iconColor} flex items-center justify-center flex-shrink-0 shadow-sm ring-4 ring-white dark:ring-slate-900`}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {event.icon}
                    </span>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-semibold text-slate-900 truncate dark:text-white">
                        {event.title}
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        {event.time}
                      </span>
                    </div>
                    <p className="text-[12px] text-slate-500 mt-0.5 leading-snug dark:text-slate-400">
                      {event.detail}{" "}
                      {event.highlightText && (
                        <span className="text-slate-900 font-bold dark:text-white">
                          {event.highlightText}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="w-full py-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-[12px] font-medium text-slate-600 text-center mt-1 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              ดูกิจกรรมทั้งหมด (38 รายการ)
            </button>
          </div>

          {/* Section 2: Channel Distribution */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col gap-4 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#4b41e1] dark:text-indigo-400">
                  pie_chart
                </span>
                <span className="font-display text-[15px] font-bold text-slate-900 dark:text-white">
                  สัดส่วนช่องทางติดต่อ
                </span>
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                เดือนนี้
              </span>
            </div>

            {/* Inline SVG Multi-segment Donut Graphic */}
            <div className="flex items-center justify-center py-2">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  {/* Background Circle */}
                  <path
                    className="text-slate-100 dark:text-slate-800"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  />
                  {/* Phone Segment: 45% (offset 0) */}
                  <path
                    className="text-[#4b41e1]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="45, 100"
                    strokeWidth="3.8"
                  />
                  {/* LINE Segment: 35% (offset -45) */}
                  <path
                    className="text-[#009668]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="35, 100"
                    strokeDashoffset="-45"
                    strokeWidth="3.8"
                  />
                  {/* Email Segment: 20% (offset -80) */}
                  <path
                    className="text-[#c3c0ff]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="20, 100"
                    strokeDashoffset="-80"
                    strokeWidth="3.8"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="font-display text-[18px] font-bold text-slate-900 leading-none dark:text-white">
                    100%
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    ช่องทางรวม
                  </span>
                </div>
              </div>
            </div>

            {/* Breakdown List with Progress Bars */}
            <div className="flex flex-col gap-3">
              {mockChannelDistribution.map((ch) => (
                <div key={ch.name} className="flex flex-col gap-1">
                  <div className="flex justify-between items-center text-[12px]">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: ch.color }}
                      />
                      <span className="text-slate-700 font-medium dark:text-slate-300">
                        {ch.name}
                      </span>
                    </div>
                    <span className="text-slate-900 font-semibold dark:text-white">
                      {ch.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden dark:bg-slate-800">
                    <div
                      className={`h-full ${ch.barColor} rounded-full transition-all duration-500`}
                      style={{ width: `${ch.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
