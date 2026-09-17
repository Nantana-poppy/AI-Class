export interface FollowUpItem {
  id: string;
  initial: string;
  initialBg: string;
  initialColor: string;
  name: string;
  company: string;
  time: string;
  timeBadgeClass: string;
  isUrgent?: boolean;
  subject: string;
  contactType: "tel" | "line" | "email";
  contactValue: string;
  secondaryMeta?: string;
  secondaryMetaColor?: string;
  slot: "morning" | "afternoon";
  hasPhoneAction?: boolean;
  hasChatAction?: boolean;
  hasEmailAction?: boolean;
  hasCalendarAction?: boolean;
}

export interface ActivityItem {
  id: string;
  title: string;
  time: string;
  detail: string;
  highlightText?: string;
  icon: string;
  iconBg: string;
  iconColor: string;
}

export interface KpiCard {
  id: string;
  label: string;
  count: number;
  icon: string;
  iconBg: string;
  iconColor: string;
  badgeText: string;
  badgeClass: string;
  subtext: string;
  isUrgent?: boolean;
  dotColor?: string;
}

export interface ChannelShare {
  name: string;
  percentage: number;
  color: string;
  barColor: string;
}

export const mockBrandLogo = {
  src: "https://lh3.googleusercontent.com/aida/AEtjO1U1jf--Rkhsm2PXrjH_gGuOGJCjPjmUGJfGlF2KQjRUSytUyGMojQkJvmkPFK-Zzwi8zHwVFSbNOMwTHRcZHQiNvLe613nRbWirqNcjYyaIJ41s3rxcPm7etfQkgeR8f73MZ0pB4zaWwVOCOmSAEOkB5sohHL92kKixmVCEKaFk5UHQRkqY34jlwyV9M7Bl87FnRZa7lTYCmirb60y3Q8_PwfM60VVnmItAomev-bq3_bjI7g-oS60eOKs",
  alt: "Follow-up Board Logo",
};

export const mockUserProfile = {
  name: "คุณวีรภัทร",
  role: "ฝ่ายพัฒนาธุรกิจ / Admin",
  avatar:
    "https://lh3.googleusercontent.com/aida/AEtjO1WR_xMJiiux1Ombo9Akr0hKM_WB9JiOFCFjY58e6P1cvvxjKjtwaQal2CNM_UvohISwUR2VKUAJ8iyebYFgnPNkbWz6uxAhHGxTH7IvsyKdMA1heyV_m6rdhhe0_eP2Zr0K9SeB2DZxXGLY-JPUcKMN61mSNAxIPaKeo3EXkQBS5nn9VqW0-xPqdKpbPiHbgV2SWjkW0QJw2ivw_L_L1w7CC_Jf7ZIC141ghV4SnqXlnWRjoMw2OECVq6U",
};

export const mockWeeklyTarget = {
  title: "เป้าหมายประจำสัปดาห์",
  badge: "อีก 2 รายการ",
  description: "ปิดดีลอีก 2 รายการเพื่อแตะยอดประจำสัปดาห์ (เป้าหมาย 10 รายการ)",
  progressLabel: "ความคืบหน้ารวม",
  progressText: "8/10 ดีล (80%)",
  percentage: 80,
};

export const mockKpis: KpiCard[] = [
  {
    id: "kpi-today",
    label: "ต้องติดตามวันนี้",
    count: 5,
    icon: "notification_important",
    iconBg: "bg-[#e2dfff]",
    iconColor: "text-[#4b41e1]",
    badgeText: "เร่งด่วนใน 4 ชม.",
    badgeClass: "bg-[#ffdad6] text-[#93000a]",
    subtext: "เป้า 100%",
    isUrgent: true,
  },
  {
    id: "kpi-pending",
    label: "รอดำเนินการ",
    count: 12,
    icon: "schedule",
    iconBg: "bg-[#e6e8ea]",
    iconColor: "text-[#45464d]",
    badgeText: "",
    badgeClass: "",
    subtext: "รอการตอบกลับจากลูกค้า",
    dotColor: "bg-[#c6c6cd]",
  },
  {
    id: "kpi-in-progress",
    label: "กำลังติดตาม",
    count: 18,
    icon: "sync_saved_locally",
    iconBg: "bg-[#dae2fd]",
    iconColor: "text-[#131b2e]",
    badgeText: "",
    badgeClass: "",
    subtext: "อยู่ในไปป์ไลน์เจรจา",
    dotColor: "bg-[#4b41e1]",
  },
  {
    id: "kpi-completed",
    label: "สำเร็จ / ปิดการขาย",
    count: 34,
    icon: "verified",
    iconBg: "bg-[#6ffbbe]",
    iconColor: "text-[#002113]",
    badgeText: "+4 รายการวีคนี้",
    badgeClass: "text-[#009668] font-semibold",
    subtext: "อัตราสำเร็จ 68%",
  },
];

export const mockFollowUps: FollowUpItem[] = [
  {
    id: "task-1",
    initial: "ส",
    initialBg: "bg-[#e2dfff]",
    initialColor: "text-[#4b41e1]",
    name: "คุณสมชาย มุ่งมั่น",
    company: "บจก. เทค พลัส",
    time: "10:30 น.",
    timeBadgeClass: "bg-[#ffdad6] text-[#93000a]",
    isUrgent: true,
    subject: "ส่งใบเสนอราคา Cloud ERP และตอบคำถามฝ่ายไอทีเรื่อง SLA",
    contactType: "tel",
    contactValue: "081-234-5678",
    secondaryMeta: "ดีลมูลค่า ฿240,000",
    secondaryMetaColor: "text-[#4b41e1]",
    slot: "morning",
    hasPhoneAction: true,
    hasChatAction: true,
  },
  {
    id: "task-2",
    initial: "ก",
    initialBg: "bg-[#dae2fd]",
    initialColor: "text-[#131b2e]",
    name: "คุณกัญญาณัฐ เลิศวิทย์",
    company: "บริษัท สตาร์ทไอที จำกัด",
    time: "14:00 น.",
    timeBadgeClass: "bg-[#e2dfff] text-[#0f0069]",
    isUrgent: false,
    subject: "ตอบคำถามสัญญาความร่วมมือ พร้อมอัปเดตกำหนดการอบรมทีมงาน",
    contactType: "line",
    contactValue: "LINE: @kanyanat",
    secondaryMeta: "สถานะ: รอเอกสารแนบ",
    secondaryMetaColor: "text-[#009668]",
    slot: "afternoon",
    hasChatAction: true,
  },
  {
    id: "task-3",
    initial: "ป",
    initialBg: "bg-[#e6e8ea]",
    initialColor: "text-[#191c1e]",
    name: "คุณประวิทย์ ยอดเยี่ยม",
    company: "พีพี คอนสตรัคชั่น",
    time: "16:15 น.",
    timeBadgeClass: "bg-[#e0e3e5] text-[#45464d]",
    isUrgent: false,
    subject: "นัดตรวจรับมอบงานงวดแรก พร้อมส่งมอบเอกสารใบเสร็จรับเงิน",
    contactType: "email",
    contactValue: "prawit@ppconst.co.th",
    secondaryMeta: "สถานที่: ไซต์งานพระราม 9",
    secondaryMetaColor: "text-[#4b41e1]",
    slot: "afternoon",
    hasCalendarAction: true,
    hasEmailAction: true,
  },
  {
    id: "task-4",
    initial: "ธ",
    initialBg: "bg-[#e2dfff]",
    initialColor: "text-[#4b41e1]",
    name: "คุณธนกฤต มั่นคง",
    company: "Mangkang Logistics",
    time: "17:00 น.",
    timeBadgeClass: "bg-[#e0e3e5] text-[#45464d]",
    isUrgent: false,
    subject: "สรุป Requirement ระบบติดตามพัสดุและเตรียมเดโมระบบสัปดาห์หน้า",
    contactType: "tel",
    contactValue: "089-987-6543",
    secondaryMeta: "ความเร่งด่วน: ปานกลาง",
    secondaryMetaColor: "text-[#4b41e1]",
    slot: "afternoon",
    hasPhoneAction: true,
  },
];

export const mockRecentActivities: ActivityItem[] = [
  {
    id: "act-1",
    title: "ปิดการขายสำเร็จ 🎉",
    time: "15 นาทีที่แล้ว",
    detail: "บจก. สยามอินโนเวชั่น เซ็นสัญญา Package Enterprise",
    highlightText: "฿180,000",
    icon: "check",
    iconBg: "bg-[#6ffbbe]",
    iconColor: "text-[#002113]",
  },
  {
    id: "act-2",
    title: "บันทึกหมายเหตุใหม่",
    time: "1 ชม. ที่แล้ว",
    detail: "คุณธวัชชัย (เดอะเบสท์ มาร์เก็ตติ้ง) สนใจอัปเกรดโมดูลเพิ่มในไตรมาสถัดไป",
    icon: "edit_note",
    iconBg: "bg-[#e2dfff]",
    iconColor: "text-[#4b41e1]",
  },
  {
    id: "act-3",
    title: "เพิ่มผู้ติดต่อรายใหม่",
    time: "3 ชม. ที่แล้ว",
    detail: "ได้รับ Lead จากแบบฟอร์มเว็บไซต์: คุณอรทัย อารีพันธ์",
    icon: "person_add",
    iconBg: "bg-[#dae2fd]",
    iconColor: "text-[#131b2e]",
  },
];

export const mockChannelDistribution: ChannelShare[] = [
  {
    name: "โทรศัพท์โดยตรง",
    percentage: 45,
    color: "#4b41e1",
    barColor: "bg-[#4b41e1]",
  },
  {
    name: "LINE Official / Chat",
    percentage: 35,
    color: "#009668",
    barColor: "bg-[#009668]",
  },
  {
    name: "อีเมล (Email Propose)",
    percentage: 20,
    color: "#c3c0ff",
    barColor: "bg-[#c3c0ff]",
  },
];
