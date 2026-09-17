"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Contact,
  ContactStatus,
  getStatusBadgeStyle,
} from "@/lib/contacts-data";

export default function ContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ทั้งหมด");
  const [sortBy, setSortBy] = useState<string>("date");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Fetch contacts from Supabase API on mount
  useEffect(() => {
    let isMounted = true;
    const loadContacts = async () => {
      try {
        const res = await fetch("/api/contacts");
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setContacts(data.contacts || []);
          }
        } else {
          console.error("Failed to fetch contacts, status:", res.status);
          if (res.status === 401 && isMounted) {
            router.push("/sign-up");
          }
        }
      } catch (err) {
        console.error("Failed to fetch contacts:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadContacts();

    return () => {
      isMounted = false;
    };
  }, [router]);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Contact | null>(null);

  // Form states
  const [formData, setFormData] = useState<Partial<Contact>>({
    name: "",
    englishName: "",
    company: "",
    position: "",
    email: "",
    phone: "",
    lineId: "",
    channel: "โทรศัพท์",
    interestedIn: "",
    status: "รายการใหม่",
    followUpDate: "2024-05-26",
    followUpTime: "10:00 น.",
    notes: "",
  });

  // Filter & Search Logic
  const filteredContacts = useMemo(() => {
    return contacts
      .filter((contact) => {
        // Status filter
        if (selectedStatus !== "ทั้งหมด" && contact.status !== selectedStatus) {
          return false;
        }
        // Search filter
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          contact.name.toLowerCase().includes(q) ||
          (contact.englishName && contact.englishName.toLowerCase().includes(q)) ||
          contact.company.toLowerCase().includes(q) ||
          contact.phone.toLowerCase().includes(q) ||
          contact.email.toLowerCase().includes(q) ||
          contact.interestedIn.toLowerCase().includes(q) ||
          (contact.lineId && contact.lineId.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (sortBy === "name") {
          return a.name.localeCompare(b.name, "th");
        }
        if (sortBy === "date") {
          return a.followUpDate.localeCompare(b.followUpDate);
        }
        return 0;
      });
  }, [contacts, selectedStatus, searchQuery, sortBy]);

  // Status counts
  const statusCounts = useMemo(() => {
    return {
      all: contacts.length,
      new: contacts.filter((c) => c.status === "รายการใหม่").length,
      talking: contacts.filter((c) => c.status === "กำลังคุย").length,
      waiting: contacts.filter((c) => c.status === "รอติดตาม").length,
      closed: contacts.filter((c) => c.status === "ปิดงาน").length,
    };
  }, [contacts]);

  // Checkbox handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredContacts.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingContact(null);
    setFormData({
      name: "",
      englishName: "",
      company: "",
      position: "",
      email: "",
      phone: "",
      lineId: "",
      channel: "โทรศัพท์",
      interestedIn: "",
      status: "รายการใหม่",
      followUpDate: new Date().toISOString().split("T")[0],
      followUpTime: "10:00 น.",
      notes: "",
    });
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({ ...contact });
    setIsFormModalOpen(true);
  };

  // Save Form (Create or Update via Supabase Database)
  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.company || !formData.phone || !formData.email) {
      alert("กรุณากรอกข้อมูลที่จำเป็น (ชื่อ, บริษัท, อีเมล, เบอร์โทรศัพท์)");
      return;
    }

    try {
      setIsSaving(true);
      if (editingContact) {
        // Update via API
        const res = await fetch(`/api/contacts/${editingContact.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          const { contact: updated } = await res.json();
          setContacts((prev) =>
            prev.map((c) => (c.id === updated.id ? updated : c))
          );
          setIsFormModalOpen(false);
        } else {
          alert("เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
        }
      } else {
        // Create new via API
        const res = await fetch("/api/contacts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          const { contact: created } = await res.json();
          setContacts((prev) => [created, ...prev]);
          setIsFormModalOpen(false);
        } else {
          alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
      }
    } catch (err) {
      console.error("Failed to save contact:", err);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Action via Supabase Database
  const handleDeleteConfirm = async () => {
    if (deleteCandidate) {
      try {
        const res = await fetch(`/api/contacts/${deleteCandidate.id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setContacts((prev) => prev.filter((c) => c.id !== deleteCandidate.id));
          setSelectedIds((prev) => prev.filter((id) => id !== deleteCandidate.id));
        } else {
          alert("เกิดข้อผิดพลาดในการลบข้อมูล");
        }
      } catch (err) {
        console.error("Failed to delete contact:", err);
        alert("เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล");
      } finally {
        setDeleteCandidate(null);
      }
    }
  };

  // Batch Delete Action via Supabase Database
  const handleBatchDelete = async () => {
    if (confirm(`ยืนยันการลบ ${selectedIds.length} รายการที่เลือก?`)) {
      try {
        await Promise.all(
          selectedIds.map((id) =>
            fetch(`/api/contacts/${id}`, { method: "DELETE" })
          )
        );
        setContacts((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
        setSelectedIds([]);
      } catch (err) {
        console.error("Failed to batch delete:", err);
        alert("เกิดข้อผิดพลาดในการลบข้อมูลบางรายการ");
      }
    }
  };

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: ผู้ติดต่อทั้งหมด */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between dark:bg-slate-900 dark:border-slate-800">
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">
              ผู้ติดต่อทั้งหมด
            </span>
            <span className="font-display text-[28px] font-bold text-slate-900 mt-1 leading-none dark:text-white">
              {contacts.length}
            </span>
            <span className="text-[12px] text-[#009668] flex items-center gap-1 mt-1 font-semibold">
              <span className="material-symbols-outlined text-[15px]">trending_up</span>
              +12% จากเดือนก่อน
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-[#4b41e1] dark:bg-slate-800">
            <span className="material-symbols-outlined text-[24px]">groups</span>
          </div>
        </div>

        {/* Card 2: ต้องติดตามวันนี้ */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between dark:bg-slate-900 dark:border-slate-800">
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold text-[#ba1a1a] uppercase tracking-wider">
              ต้องติดตามวันนี้
            </span>
            <span className="font-display text-[28px] font-bold text-[#ba1a1a] mt-1 leading-none">
              {statusCounts.waiting}
            </span>
            <span className="text-[12px] text-slate-500 flex items-center gap-1 mt-1 dark:text-slate-400">
              <span className="material-symbols-outlined text-[15px]">schedule</span>
              มี 2 เคสด่วนใกล้ครบกำหนด
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a]">
            <span className="material-symbols-outlined text-[24px]">notifications_active</span>
          </div>
        </div>

        {/* Card 3: กำลังเจรจา / ติดตาม */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between dark:bg-slate-900 dark:border-slate-800">
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold text-[#4b41e1] uppercase tracking-wider dark:text-indigo-400">
              กำลังเจรจา / ติดตาม
            </span>
            <span className="font-display text-[28px] font-bold text-[#4b41e1] mt-1 leading-none dark:text-indigo-400">
              {statusCounts.talking}
            </span>
            <span className="text-[12px] text-slate-500 flex items-center gap-1 mt-1 dark:text-slate-400">
              <span className="material-symbols-outlined text-[15px]">swap_horiz</span>
              มูลค่าดีลรวม ฿1.45M
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#e2dfff] flex items-center justify-center text-[#4b41e1] dark:bg-indigo-950">
            <span className="material-symbols-outlined text-[24px]">sync</span>
          </div>
        </div>

        {/* Card 4: ปิดการขายสำเร็จ */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between dark:bg-slate-900 dark:border-slate-800">
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold text-[#009668] uppercase tracking-wider">
              ปิดการขายสำเร็จ (เดือนนี้)
            </span>
            <span className="font-display text-[28px] font-bold text-[#009668] mt-1 leading-none">
              {statusCounts.closed}
            </span>
            <span className="text-[12px] text-[#009668] flex items-center gap-1 mt-1 font-semibold">
              <span className="material-symbols-outlined text-[15px]">check_circle</span>
              บรรลุ 94% ของเป้าหมาย
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#6ffbbe] flex items-center justify-center text-[#002113]">
            <span className="material-symbols-outlined text-[24px]">verified</span>
          </div>
        </div>
      </div>

      {/* Page Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-display text-[26px] sm:text-[30px] font-bold text-slate-900 tracking-tight dark:text-white">
              รายชื่อผู้ติดต่อ
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[12px] font-medium dark:bg-slate-800 dark:text-slate-300">
              {contacts.length} รายชื่อทั้งหมด
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#e2dfff] text-[#0f0069] text-[11px] font-semibold flex items-center gap-1 dark:bg-indigo-950 dark:text-indigo-300">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4b41e1] animate-ping" />
              อัปเดตล่าสุด 5 นาทีที่แล้ว
            </span>
          </div>
          <p className="text-[14px] text-slate-500 mt-1 dark:text-slate-400">
            จัดการ ค้นหา ติดตามสถานะ และบันทึกประวัติการติดต่อลูกค้าทั้งหมดแบบรวมศูนย์
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-[13px] font-semibold shadow-sm transition-all dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <span className="material-symbols-outlined text-[18px] text-slate-400">
              file_download
            </span>
            <span>ส่งออก Excel/CSV</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-[13px] font-semibold shadow-sm transition-all dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <span className="material-symbols-outlined text-[18px] text-slate-400">
              upload_file
            </span>
            <span>นำเข้าข้อมูล (Import)</span>
          </button>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4b41e1] text-white hover:bg-[#3f36c5] text-[13px] font-semibold shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>เพิ่มผู้ติดต่อใหม่</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar Card */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col gap-4 dark:bg-slate-900 dark:border-slate-800">
        {/* Row 1: Search + Sort + View Mode */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-xl">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาด้วยชื่อ, เบอร์โทรศัพท์, บริษัท, หรือสิ่งที่สนใจ..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 rounded-xl text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#4b41e1]/20 border border-slate-200/60 transition-all dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:placeholder:text-slate-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* Controls: Sort + View mode */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Sorting */}
            <div className="relative inline-flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-slate-400 text-[18px] pointer-events-none">
                sort
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="เรียงลำดับรายการ"
                className="pl-9 pr-8 py-2 bg-slate-50 text-slate-700 text-[12px] font-medium rounded-xl appearance-none cursor-pointer focus:outline-none border border-slate-200/60 hover:bg-slate-100 transition-colors dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
              >
                <option value="date">เรียงตาม: วันที่ต้องติดตามใกล้สุด</option>
                <option value="name">เรียงตาม: ชื่อ ก-ฮ</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 text-slate-400 text-[16px] pointer-events-none">
                expand_more
              </span>
            </div>

            {/* View Mode */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                  viewMode === "table"
                    ? "bg-white text-[#4b41e1] shadow-sm dark:bg-slate-700 dark:text-indigo-400"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">table_rows</span>
                <span>ตาราง</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-[#4b41e1] shadow-sm dark:bg-slate-700 dark:text-indigo-400"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">view_kanban</span>
                <span>การ์ด</span>
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none">
          {[
            { label: "ทั้งหมด", count: statusCounts.all, dot: null },
            { label: "รายการใหม่", count: statusCounts.new, dot: "bg-blue-500" },
            { label: "กำลังคุย", count: statusCounts.talking, dot: "bg-[#4b41e1]" },
            { label: "รอติดตาม", count: statusCounts.waiting, dot: "bg-[#ba1a1a]" },
            { label: "ปิดงาน", count: statusCounts.closed, dot: "bg-[#009668]" },
          ].map((tab) => {
            const isActive = selectedStatus === tab.label;
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => setSelectedStatus(tab.label)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#4b41e1] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                {tab.dot && (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isActive ? "bg-white" : tab.dot
                    }`}
                  />
                )}
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Batch Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-[#131b2e] text-white px-5 py-3 rounded-2xl flex items-center justify-between shadow-md transition-all">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-indigo-400">
              checklist
            </span>
            <span className="text-[13px] font-semibold">
              เลือกแล้ว {selectedIds.length} รายการ
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBatchDelete}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[12px] font-semibold flex items-center gap-1 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
              <span>ลบที่เลือก</span>
            </button>
          </div>
        </div>
      )}

      {/* View Mode: Table View */}
      {viewMode === "table" ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col dark:bg-slate-900 dark:border-slate-800">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 text-[11px] font-semibold uppercase tracking-wider dark:bg-slate-800/60 dark:border-slate-800 dark:text-slate-400 select-none">
                  <th className="py-3.5 px-4 w-12 text-center">
                    <input
                      type="checkbox"
                      aria-label="เลือกทั้งหมด"
                      checked={
                        filteredContacts.length > 0 &&
                        selectedIds.length === filteredContacts.length
                      }
                      onChange={handleSelectAll}
                      className="rounded text-[#4b41e1] focus:ring-0 cursor-pointer w-4 h-4"
                    />
                  </th>
                  <th className="py-3.5 px-4 min-w-[240px]">ผู้ติดต่อ &amp; บริษัท</th>
                  <th className="py-3.5 px-4 min-w-[200px]">ช่องทางติดต่อ</th>
                  <th className="py-3.5 px-4 min-w-[130px]">สถานะ</th>
                  <th className="py-3.5 px-4 min-w-[170px]">กำหนดการติดตาม</th>
                  <th className="py-3.5 px-4 min-w-[240px]">สิ่งที่สนใจ / หมายเหตุ</th>
                  <th className="py-3.5 px-4 min-w-[140px] text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[13px] dark:divide-slate-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <span className="w-6 h-6 border-2 border-[#4b41e1]/20 border-t-[#4b41e1] rounded-full animate-spin" />
                        <span className="text-[13px] font-medium text-slate-500">กำลังดึงข้อมูลจาก Supabase...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      ไม่พบรายชื่อผู้ติดต่อที่ตรงกับเงื่อนไข
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map((contact) => {
                    const badge = getStatusBadgeStyle(contact.status);
                    const isSelected = selectedIds.includes(contact.id);

                    return (
                      <tr
                        key={contact.id}
                        className={`hover:bg-slate-50/80 transition-colors group dark:hover:bg-slate-800/50 ${
                          isSelected ? "bg-indigo-50/50 dark:bg-indigo-950/20" : ""
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-3.5 px-4 text-center">
                          <input
                            type="checkbox"
                            aria-label={`เลือก ${contact.name}`}
                            checked={isSelected}
                            onChange={() => handleSelectOne(contact.id)}
                            className="rounded text-[#4b41e1] focus:ring-0 cursor-pointer w-4 h-4"
                          />
                        </td>

                        {/* Contact & Company */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative flex-shrink-0">
                              {contact.avatarUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={contact.avatarUrl}
                                  alt={contact.name}
                                  className="w-10 h-10 rounded-full object-cover shadow-sm ring-1 ring-slate-100 dark:ring-slate-800"
                                />
                              ) : (
                                <div
                                  className={`w-10 h-10 rounded-full ${contact.avatarBg} ${contact.avatarColor} flex items-center justify-center font-display text-[15px] font-bold shadow-sm`}
                                >
                                  {contact.avatarInitial}
                                </div>
                              )}
                              <span
                                className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${badge.dotColor}`}
                              />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span
                                  onClick={() => handleOpenEditModal(contact)}
                                  className="font-display text-[14px] font-semibold text-slate-900 truncate hover:text-[#4b41e1] cursor-pointer dark:text-white dark:hover:text-indigo-400"
                                >
                                  {contact.name}
                                </span>
                                {contact.englishName && (
                                  <span className="text-[11px] text-slate-400 font-normal">
                                    ({contact.englishName})
                                  </span>
                                )}
                              </div>
                              <span className="text-[12px] text-slate-500 truncate dark:text-slate-400">
                                {contact.company}{" "}
                                {contact.position && `• ${contact.position}`}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Contact Channels */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col gap-1 text-[12px]">
                            <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                              <span className="material-symbols-outlined text-[15px] text-slate-400">
                                call
                              </span>
                              <a
                                href={`tel:${contact.phone}`}
                                className="font-mono hover:text-[#4b41e1] dark:hover:text-indigo-400"
                              >
                                {contact.phone}
                              </a>
                            </div>
                            {contact.email && (
                              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                                <span className="material-symbols-outlined text-[15px] text-slate-400">
                                  mail
                                </span>
                                <span
                                  className="truncate max-w-[160px]"
                                  title={contact.email}
                                >
                                  {contact.email}
                                </span>
                              </div>
                            )}
                            {contact.lineId && (
                              <div className="flex items-center gap-1">
                                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center gap-1 dark:bg-slate-800 dark:text-slate-300">
                                  <span className="text-[#009668]">LINE</span>{" "}
                                  {contact.lineId}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${badge.badgeClass}`}
                          >
                            <span className={`w-2 h-2 rounded-full ${badge.dotColor}`} />
                            {contact.status}
                          </span>
                        </td>

                        {/* Follow-up Date */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col text-[12px]">
                            <div className="flex items-center gap-1 text-slate-900 font-medium dark:text-slate-200">
                              <span className="material-symbols-outlined text-[15px] text-slate-400">
                                event
                              </span>
                              <span>
                                {contact.followUpDate}{" "}
                                {contact.followUpTime && `• ${contact.followUpTime}`}
                              </span>
                            </div>
                            {contact.timeRemaining && (
                              <div className="mt-1">
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                                    contact.status === "รอติดตาม"
                                      ? "bg-[#ffdad6] text-[#93000a]"
                                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                                  }`}
                                >
                                  <span className="material-symbols-outlined text-[12px]">
                                    timer
                                  </span>
                                  {contact.timeRemaining}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Notes / Interest */}
                        <td className="py-3.5 px-4 max-w-[260px]">
                          <div className="flex flex-col gap-1">
                            {contact.interestedIn && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4b41e1] dark:text-indigo-400">
                                <span className="material-symbols-outlined text-[13px]">
                                  star
                                </span>
                                {contact.interestedIn}
                              </span>
                            )}
                            <p
                              className="text-[12px] text-slate-600 dark:text-slate-300 line-clamp-1"
                              title={contact.notes}
                            >
                              {contact.notes || "-"}
                            </p>
                            {contact.noteAuthor && (
                              <span className="text-[10px] text-slate-400">
                                {contact.noteAuthor} {contact.noteDate && `• ${contact.noteDate}`}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <a
                              href={`tel:${contact.phone}`}
                              title="โทรหาผู้ติดต่อ"
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors dark:hover:bg-slate-800 dark:hover:text-white"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                call
                              </span>
                            </a>
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(contact)}
                              title="แก้ไขข้อมูล"
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-[#4b41e1] transition-colors dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                edit
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteCandidate(contact)}
                              title="ลบผู้ติดต่อ"
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors dark:hover:bg-rose-950/40"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                delete
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Footer */}
          <div className="p-4 bg-white border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 select-none dark:bg-slate-900 dark:border-slate-800">
            <span className="text-[12px] text-slate-500 dark:text-slate-400">
              แสดง <strong className="text-slate-900 dark:text-white">{filteredContacts.length}</strong> จาก{" "}
              <strong className="text-slate-900 dark:text-white">{contacts.length}</strong> รายการ
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="หน้าก่อนหน้า"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-lg bg-[#4b41e1] text-white text-[12px] font-semibold flex items-center justify-center shadow-sm"
              >
                1
              </button>
              <button
                type="button"
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="หน้าถัดไป"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* View Mode: Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact) => {
            const badge = getStatusBadgeStyle(contact.status);
            return (
              <div
                key={contact.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between gap-4 hover:shadow-md transition-all dark:bg-slate-900 dark:border-slate-800"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full ${contact.avatarBg} ${contact.avatarColor} flex items-center justify-center font-display text-[15px] font-bold`}
                    >
                      {contact.avatarInitial}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-display text-[15px] font-bold text-slate-900 dark:text-white truncate">
                        {contact.name}
                      </span>
                      <span className="text-[12px] text-slate-500 truncate dark:text-slate-400">
                        {contact.company}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${badge.badgeClass}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${badge.dotColor}`} />
                    {contact.status}
                  </span>
                </div>

                <div className="flex flex-col gap-2 rounded-xl bg-slate-50 p-3 text-[12px] dark:bg-slate-800/60">
                  <div className="flex items-center gap-1 text-slate-700 font-medium dark:text-slate-300">
                    <span className="material-symbols-outlined text-[15px] text-[#4b41e1]">
                      star
                    </span>
                    <span>สนใจ: {contact.interestedIn || "-"}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                    <span className="material-symbols-outlined text-[15px] text-slate-400">
                      event
                    </span>
                    <span>ติดตาม: {contact.followUpDate} ({contact.followUpTime})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-[12px] text-slate-500 font-mono flex items-center gap-1 hover:text-[#4b41e1]"
                  >
                    <span className="material-symbols-outlined text-[15px]">call</span>
                    {contact.phone}
                  </a>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(contact)}
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                      title="แก้ไข"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteCandidate(contact)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                      title="ลบ"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Contact Modal Dialog */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden dark:bg-slate-900 dark:border-slate-800">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#e2dfff] flex items-center justify-center text-[#4b41e1] dark:bg-indigo-950 dark:text-indigo-400">
                  <span className="material-symbols-outlined text-[20px]">
                    {editingContact ? "edit" : "person_add"}
                  </span>
                </div>
                <h3 className="font-display text-[18px] font-bold text-slate-900 dark:text-white">
                  {editingContact ? "แก้ไขข้อมูลผู้ติดต่อ" : "เพิ่มผู้ติดต่อใหม่"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors dark:hover:bg-slate-800"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveContact} className="p-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
              {/* Row 1: Name & English Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1 dark:text-slate-300">
                    ชื่อ-นามสกุล *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="เช่น คุณสมชาย มุ่งมั่น"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4b41e1]/20 focus:bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1 dark:text-slate-300">
                    ชื่อภาษาอังกฤษ
                  </label>
                  <input
                    type="text"
                    value={formData.englishName}
                    onChange={(e) =>
                      setFormData({ ...formData, englishName: e.target.value })
                    }
                    placeholder="เช่น Somchai M."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4b41e1]/20 focus:bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Row 2: Company & Position */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1 dark:text-slate-300">
                    บริษัทหรือองค์กร *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    placeholder="เช่น บจก. ไทย เทค พลัส"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4b41e1]/20 focus:bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1 dark:text-slate-300">
                    ตำแหน่งงาน
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    placeholder="เช่น ผู้จัดการฝ่ายจัดซื้อ"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4b41e1]/20 focus:bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Row 3: Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1 dark:text-slate-300">
                    เบอร์โทรศัพท์ *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="เช่น 081-234-5678"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4b41e1]/20 focus:bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1 dark:text-slate-300">
                    อีเมล
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="เช่น somchai@example.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4b41e1]/20 focus:bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Row 4: Channel & LINE ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1 dark:text-slate-300">
                    ช่องทางติดต่อหลัก
                  </label>
                  <select
                    value={formData.channel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        channel: e.target.value as Contact["channel"],
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4b41e1]/20 focus:bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  >
                    <option value="โทรศัพท์">โทรศัพท์</option>
                    <option value="LINE">LINE</option>
                    <option value="อีเมล">อีเมล</option>
                    <option value="พบตัวต่อตัว">พบตัวต่อตัว</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1 dark:text-slate-300">
                    LINE ID
                  </label>
                  <input
                    type="text"
                    value={formData.lineId}
                    onChange={(e) => setFormData({ ...formData, lineId: e.target.value })}
                    placeholder="เช่น somchai_tt"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4b41e1]/20 focus:bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Row 5: Interested in & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1 dark:text-slate-300">
                    สิ่งที่สนใจ (สินค้า/บริการ)
                  </label>
                  <input
                    type="text"
                    value={formData.interestedIn}
                    onChange={(e) =>
                      setFormData({ ...formData, interestedIn: e.target.value })
                    }
                    placeholder="เช่น Cloud ERP, ระบบคลังสินค้า"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4b41e1]/20 focus:bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1 dark:text-slate-300">
                    สถานะการติดตาม
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as ContactStatus,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4b41e1]/20 focus:bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  >
                    <option value="รายการใหม่">รายการใหม่</option>
                    <option value="กำลังคุย">กำลังคุย</option>
                    <option value="รอติดตาม">รอติดตาม</option>
                    <option value="ปิดงาน">ปิดงาน</option>
                  </select>
                </div>
              </div>

              {/* Row 6: Follow-up Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1 dark:text-slate-300">
                    วันที่ต้อง Follow-up
                  </label>
                  <input
                    type="date"
                    value={formData.followUpDate}
                    onChange={(e) =>
                      setFormData({ ...formData, followUpDate: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4b41e1]/20 focus:bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1 dark:text-slate-300">
                    เวลาที่นัดหมาย
                  </label>
                  <input
                    type="text"
                    value={formData.followUpTime}
                    onChange={(e) =>
                      setFormData({ ...formData, followUpTime: e.target.value })
                    }
                    placeholder="เช่น 10:30 น."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4b41e1]/20 focus:bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Row 7: Notes */}
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1 dark:text-slate-300">
                  หมายเหตุ / บันทึกประวัติ
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="บันทึกข้อตกลง หรือสิ่งที่ต้องเตรียมก่อนคุยกับลูกค้า..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4b41e1]/20 focus:bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-[13px] font-semibold transition-colors dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-[#4b41e1] text-white hover:bg-[#3f36c5] text-[13px] font-semibold shadow-sm transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>กำลังบันทึก...</span>
                    </>
                  ) : (
                    <span>{editingContact ? "บันทึกการแก้ไข" : "เพิ่มผู้ติดต่อ"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 flex flex-col items-center text-center dark:bg-slate-900 dark:border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[26px]">delete</span>
            </div>
            <h3 className="font-display text-[17px] font-bold text-slate-900 dark:text-white">
              ยืนยันการลบผู้ติดต่อ?
            </h3>
            <p className="text-[13px] text-slate-500 mt-1 mb-6 dark:text-slate-400">
              คุณต้องการลบรายชื่อ <strong className="text-slate-900 dark:text-white">&quot;{deleteCandidate.name}&quot;</strong> ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
            </p>
            <div className="flex items-center gap-2.5 w-full">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-[13px] font-semibold transition-colors dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[13px] font-semibold shadow-sm transition-all"
              >
                ยืนยันลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

