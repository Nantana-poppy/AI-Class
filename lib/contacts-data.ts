export type ContactStatus = "รายการใหม่" | "กำลังคุย" | "รอติดตาม" | "ปิดงาน";

export interface Contact {
  id: string;
  name: string;
  englishName?: string;
  company: string;
  position?: string;
  email: string;
  phone: string;
  lineId?: string;
  channel: "โทรศัพท์" | "LINE" | "อีเมล" | "พบตัวต่อตัว";
  interestedIn: string;
  status: ContactStatus;
  followUpDate: string; // e.g. "2024-05-24"
  followUpTime?: string; // e.g. "10:30"
  timeRemaining?: string; // e.g. "เหลือ 2 ชม."
  notes: string;
  noteAuthor?: string;
  noteDate?: string;
  avatarUrl?: string;
  avatarInitial: string;
  avatarBg: string;
  avatarColor: string;
  dealValue?: string;
}

export const initialContacts: Contact[] = [
  {
    id: "ct-1",
    name: "คุณสมชาย มุ่งมั่น",
    englishName: "Somchai M.",
    company: "บจก. ไทย เทค พลัส",
    position: "ผู้จัดการฝ่ายไอที",
    email: "somchai@thaitech.co.th",
    phone: "081-234-5678",
    lineId: "somchai_tt",
    channel: "โทรศัพท์",
    interestedIn: "Cloud ERP แพ็กเกจ Enterprise",
    status: "รอติดตาม",
    followUpDate: "2024-05-24",
    followUpTime: "10:30 น.",
    timeRemaining: "เหลือ 2 ชม.",
    notes: "ลูกค้าสนใจ Cloud ERP แพ็กเกจ Enterprise ขอดูข้อเสนอราคาพิเศษและ SLA",
    noteAuthor: "วีรภัทร",
    noteDate: "เมื่อวาน 16:45 น.",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuClf13WR8j7FRyfn5S3ucW7DhTzyDxHZ3AEsDGOeUKCu1VAIOZRFlidiYs0WIIDfc0uAApnBUd90lTSeFA2XFhbjeZuCod7a0ZQeBQ1Fd7rphj8bROmxywfAw9Uh8vBfXfMGmxkCvZUumseWy5FcvXBcTjpnalbv86u80Kn_hAaG_vseD47MaK6KB_AA07TeeInUF2S-2sBMtzOTO7tAcvv-7CO5fAwI9YsAG5pp2P_RabnPyUypVk7",
    avatarInitial: "ส",
    avatarBg: "bg-[#ffdad6]",
    avatarColor: "text-[#ba1a1a]",
    dealValue: "฿240,000",
  },
  {
    id: "ct-2",
    name: "คุณพิมลวรรณ สุขประเสริฐ",
    englishName: "Pimonwan S.",
    company: "บจก. กรีน รีเทล",
    position: "ผู้อำนวยการจัดซื้อ",
    email: "pimonwan@greenretail.co.th",
    phone: "089-876-5432",
    channel: "โทรศัพท์",
    interestedIn: "ระบบจัดการคลังสินค้า Warehouse Pro",
    status: "กำลังคุย",
    followUpDate: "2024-05-25",
    followUpTime: "13:00 น.",
    timeRemaining: "เหลือ 1 วัน",
    notes: "รอสรุปความต้องการจากฝ่ายจัดซื้อเรื่องระบบจัดการคลังสินค้า เตรียมส่ง Proposal ฉบับแก้ไข",
    noteAuthor: "วีรภัทร",
    noteDate: "22 พ.ค.",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCx9IzOuH5kmWEz7DVHbZGhfnJHQzqGvUO4bRv_aZdTFJDjlR0GPFpP4jFpVbXwGyadi-TPKYQt7kDYU329SXSeoIYPhw2CsEj6jmOXyM_XoHShax7yQFHYqYlb5f9m-hjUbUsRAz3HKMV92FECrE9-rQfXnB52NHF_DOxUyXOzVY5gGCXygO5Pgfvy0hDU9EoRYOFtl5Lz3RK4XZLg4ojD5W2SiaD_vpyYlm0FCHrlNuVsQImR3AOJ",
    avatarInitial: "พ",
    avatarBg: "bg-[#e2dfff]",
    avatarColor: "text-[#4b41e1]",
    dealValue: "฿450,000",
  },
  {
    id: "ct-3",
    name: "คุณธนกฤต มั่นคง",
    englishName: "Thanakrit M.",
    company: "Mangkang Logistics",
    position: "COO / หุ้นส่วน",
    email: "thanakrit@mangkanglog.com",
    phone: "092-111-2233",
    lineId: "tk_logistics",
    channel: "LINE",
    interestedIn: "API เชื่อมต่อระบบติดตามพัสดุ",
    status: "รายการใหม่",
    followUpDate: "2024-05-28",
    followUpTime: "10:00 น.",
    timeRemaining: "เหลือ 4 วัน",
    notes: "เตรียมนัดประชุมออนไลน์ผ่าน Google Meet เพื่อเปิด Demo และตอบคำถามทางเทคนิค",
    noteAuthor: "วีรภัทร",
    noteDate: "21 พ.ค.",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDy6MADeKUVHNHOFSHEzOBSN08Jqm5WP2dxDFpVQfNnG6gP92RwlEEB_RyRB_4q7PP-RMjNFnJCA_uVRFSr50da7asATnmCTGPEDne5eEQKyFancNAKmza8BzY24nScEoRorpRZuU1cFS9c1VO7XKe0HbjgDBMaaiEAsqmdmB1XTV586z3gLzbgQWWO13qNMtpbnl6X9e25SCJ3OfuDRSsyejcYXCwLR7WoaGjaUJQDHjECADCMv_4k",
    avatarInitial: "ธ",
    avatarBg: "bg-[#e6e8ea]",
    avatarColor: "text-[#191c1e]",
    dealValue: "฿180,000",
  },
  {
    id: "ct-4",
    name: "คุณอรทัย แสงสว่าง",
    englishName: "Orathai S.",
    company: "บจก. สยามอินโนเวชั่น",
    position: "ประธานเจ้าหน้าที่บริหาร (CEO)",
    email: "orathai@siaminnov.com",
    phone: "086-333-7890",
    lineId: "orathai_bright",
    channel: "LINE",
    interestedIn: "ระบบ CRM & Follow-up Board Enterprise",
    status: "ปิดงาน",
    followUpDate: "2024-05-22",
    followUpTime: "ปิดดีลแล้ว",
    notes: "ชำระเงินมัดจำเรียบร้อยแล้ว ส่งมอบระบบและเริ่ม onboarding ผู้ใช้งาน 15 Users",
    noteAuthor: "วีรภัทร",
    noteDate: "22 พ.ค.",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB7tIxb60C1FYxPz7jQG6-irhHArnfUw1tcJYA15z1en8yAfKtiXM1kUj9IQ6amVUyJ27NkOtr85HUA8Xf28YgBDufb8RoutgzPVwvX0mKVsca-Tdkm3UYw9-0hFc6DK9gclDfAS16oXJ5fZ1p7rZ0Yew1ERMriAg2XtUn9pJk9hO-F1g69vqwcwnHOCwKh7NIuIexnBOVXU1NaNWG-fBzt6k39aCTt8PLh475QAZDkruW0wAnwCpB4",
    avatarInitial: "อ",
    avatarBg: "bg-[#6ffbbe]",
    avatarColor: "text-[#002113]",
    dealValue: "฿320,000",
  },
  {
    id: "ct-5",
    name: "คุณธีรเดช กิตติคุณ",
    englishName: "Theeradech K.",
    company: "นครหลวงการช่าง",
    position: "กรรมการผู้จัดการ",
    email: "theeradech@nakornchoke.co.th",
    phone: "084-555-1212",
    channel: "โทรศัพท์",
    interestedIn: "ระบบติดตามสถานะสัญญาและชำระเงิน",
    status: "กำลังคุย",
    followUpDate: "2024-05-29",
    followUpTime: "14:00 น.",
    timeRemaining: "เหลือ 5 วัน",
    notes: "รอตรวจสอบสัญญาจัดซื้อจัดจ้างจากฝ่ายกฎหมาย คาดว่าจะพร้อมลงนามภายในสัปดาห์หน้า",
    noteAuthor: "วีรภัทร",
    noteDate: "19 พ.ค.",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCycLyxMWbQqxpwgsf40l24QyMI99-kIku4P6YpkpJeaj1JUUzlD8iFf9hlmDwAxABw1vwNwrn3BP9Yyw-SUBYi5YSAgoq6u71QGpURGSlWFOgac2Kqcw5IYbcmLWtL4CH4WfSrZtf5YNkBF980PSm3pycuaY3HvHSYqayy-S1H8PAg0FxsSpJbbXUQyeAet4paEH_8_6Xgn77c1_eXeoQBL7UsKPDhZp3s_0NGx9fSL9DnZpfESjrK",
    avatarInitial: "ธ",
    avatarBg: "bg-[#dae2fd]",
    avatarColor: "text-[#131b2e]",
    dealValue: "฿560,000",
  },
  {
    id: "ct-6",
    name: "คุณกัญญาณัฐ เลิศวิทย์",
    englishName: "Kanyanat L.",
    company: "บริษัท สตาร์ทไอที จำกัด",
    position: "Business Development Manager",
    email: "kanyanat@startit.co.th",
    phone: "082-999-8877",
    lineId: "kanyanat_biz",
    channel: "LINE",
    interestedIn: "ระบบแจ้งเตือนผ่าน LINE OA",
    status: "รอติดตาม",
    followUpDate: "2024-05-24",
    followUpTime: "14:00 น.",
    timeRemaining: "วันนี้",
    notes: "ตอบคำถามสัญญาความร่วมมือ พร้อมอัปเดตกำหนดการอบรมทีมงาน",
    noteAuthor: "วีรภัทร",
    noteDate: "เมื่อวาน",
    avatarInitial: "ก",
    avatarBg: "bg-[#e2dfff]",
    avatarColor: "text-[#4b41e1]",
    dealValue: "฿120,000",
  },
];

export function getStatusBadgeStyle(status: ContactStatus) {
  switch (status) {
    case "รายการใหม่":
      return {
        badgeClass: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
        dotColor: "bg-blue-500",
      };
    case "กำลังคุย":
      return {
        badgeClass: "bg-[#e2dfff] text-[#0f0069] dark:bg-indigo-950 dark:text-indigo-300",
        dotColor: "bg-[#4b41e1]",
      };
    case "รอติดตาม":
      return {
        badgeClass: "bg-[#ffdad6] text-[#93000a] dark:bg-rose-950 dark:text-rose-300",
        dotColor: "bg-[#ba1a1a]",
      };
    case "ปิดงาน":
      return {
        badgeClass: "bg-[#d1fae5] text-[#047857] dark:bg-emerald-950 dark:text-emerald-300",
        dotColor: "bg-[#10b981]",
      };
    default:
      return {
        badgeClass: "bg-slate-100 text-slate-700",
        dotColor: "bg-slate-400",
      };
  }
}

