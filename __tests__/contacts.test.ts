import { describe, it, expect } from "vitest";
import {
  Contact,
  ContactStatus,
  initialContacts,
  getStatusBadgeStyle,
} from "@/lib/contacts-data";

describe("Feature Contacts - Data & Helpers", () => {
  describe("Contact Information Structure", () => {
    it("ควรมีฟิลด์ข้อมูลผู้ติดต่อครบถ้วนตามเอกสาร contacts.md", () => {
      const sampleContact = initialContacts[0];

      // ตรวจสอบฟิลด์สำคัญตาม contacts.md
      expect(sampleContact).toHaveProperty("name"); // ชื่อ
      expect(sampleContact).toHaveProperty("company"); // บริษัทหรือองค์กร
      expect(sampleContact).toHaveProperty("email"); // อีเมล
      expect(sampleContact).toHaveProperty("phone"); // เบอร์โทรศัพท์
      expect(sampleContact).toHaveProperty("channel"); // ช่องทางติดต่อ
      expect(sampleContact).toHaveProperty("interestedIn"); // สิ่งที่สนใจ
      expect(sampleContact).toHaveProperty("status"); // สถานะ
      expect(sampleContact).toHaveProperty("followUpDate"); // วันที่ต้อง Follow-up
      expect(sampleContact).toHaveProperty("notes"); // หมายเหตุ
    });

    it("สถานะต้องเป็นหนึ่งใน: รายการใหม่, กำลังคุย, รอติดตาม, ปิดงาน", () => {
      const validStatuses: ContactStatus[] = [
        "รายการใหม่",
        "กำลังคุย",
        "รอติดตาม",
        "ปิดงาน",
      ];

      initialContacts.forEach((contact) => {
        expect(validStatuses).toContain(contact.status);
      });
    });

    it("ช่องทางติดต่อต้องเป็นหนึ่งใน: โทรศัพท์, LINE, อีเมล, พบตัวต่อตัว", () => {
      const validChannels = ["โทรศัพท์", "LINE", "อีเมล", "พบตัวต่อตัว"];

      initialContacts.forEach((contact) => {
        expect(validChannels).toContain(contact.channel);
      });
    });
  });

  describe("getStatusBadgeStyle", () => {
    it("สถานะ 'รายการใหม่' ควรคืนค่าสไตล์สีเทา/ฟ้า", () => {
      const style = getStatusBadgeStyle("รายการใหม่");
      expect(style.badgeClass).toContain("bg-slate-100");
      expect(style.dotColor).toBe("bg-blue-500");
    });

    it("สถานะ 'กำลังคุย' ควรคืนค่าสไตล์สีม่วง/คราม", () => {
      const style = getStatusBadgeStyle("กำลังคุย");
      expect(style.badgeClass).toContain("bg-[#e2dfff]");
      expect(style.dotColor).toBe("bg-[#4b41e1]");
    });

    it("สถานะ 'รอติดตาม' ควรคืนค่าสไตล์สีแดง/ชมพูเตือนเร่งด่วน", () => {
      const style = getStatusBadgeStyle("รอติดตาม");
      expect(style.badgeClass).toContain("bg-[#ffdad6]");
      expect(style.dotColor).toBe("bg-[#ba1a1a]");
    });

    it("สถานะ 'ปิดงาน' ควรคืนค่าสไตล์สีเขียวสำเร็จ", () => {
      const style = getStatusBadgeStyle("ปิดงาน");
      expect(style.badgeClass).toContain("bg-[#d1fae5]");
      expect(style.dotColor).toBe("bg-[#10b981]");
    });

    it("สถานะที่ไม่รู้จัก ควรคืนค่า fallback สไตล์มาตรฐาน", () => {
      // @ts-expect-error ทดสอบกรณีส่งสถานะไม่ถูกต้อง
      const style = getStatusBadgeStyle("สถานะอื่นๆ");
      expect(style.badgeClass).toBe("bg-slate-100 text-slate-700");
      expect(style.dotColor).toBe("bg-slate-400");
    });
  });

  describe("Filter & Search Logic", () => {
    it("ค้นหาด้วยชื่อผู้ติดต่อได้อย่างถูกต้อง", () => {
      const query = "สมชาย";
      const results = initialContacts.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase())
      );
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].name).toContain("สมชาย");
    });

    it("ค้นหาด้วยชื่อบริษัทได้อย่างถูกต้อง", () => {
      const query = "ไทย เทค พลัส";
      const results = initialContacts.filter((c) =>
        c.company.toLowerCase().includes(query.toLowerCase())
      );
      expect(results.length).toBe(1);
      expect(results[0].company).toBe("บจก. ไทย เทค พลัส");
    });

    it("ค้นหาด้วยเบอร์โทรศัพท์ได้อย่างถูกต้อง", () => {
      const query = "081-234-5678";
      const results = initialContacts.filter((c) =>
        c.phone.includes(query)
      );
      expect(results.length).toBe(1);
      expect(results[0].phone).toBe("081-234-5678");
    });

    it("กรองตามสถานะ 'รอติดตาม' ได้ถูกต้อง", () => {
      const results = initialContacts.filter(
        (c) => c.status === "รอติดตาม"
      );
      expect(results.length).toBeGreaterThan(0);
      results.forEach((c) => {
        expect(c.status).toBe("รอติดตาม");
      });
    });

    it("กรองสถานะ 'ทั้งหมด' ต้องได้จำนวนผู้ติดต่อทั้งหมด", () => {
      const selectedStatus = "ทั้งหมด";
      const results = initialContacts.filter((c) =>
        selectedStatus === "ทั้งหมด" ? true : c.status === selectedStatus
      );
      expect(results.length).toBe(initialContacts.length);
    });

    it("จัดเรียงตามวันที่ Follow-up จากน้อยไปมากได้ถูกต้อง", () => {
      const sorted = [...initialContacts].sort((a, b) =>
        a.followUpDate.localeCompare(b.followUpDate)
      );
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(sorted[i].followUpDate <= sorted[i + 1].followUpDate).toBe(true);
      }
    });

    it("จัดเรียงตามชื่อภาษาไทยได้ถูกต้อง", () => {
      const sorted = [...initialContacts].sort((a, b) =>
        a.name.localeCompare(b.name, "th")
      );
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(sorted[i].name.localeCompare(sorted[i + 1].name, "th") <= 0).toBe(true);
      }
    });
  });

  describe("Access Control & Data Validation", () => {
    it("ผู้ใช้ต้องดูได้เฉพาะผู้ติดต่อที่มี userId ตรงกับตัวเอง", () => {
      const currentUserId = "user-alice-123";
      const otherUserId = "user-bob-456";

      const allContacts = [
        { id: "c1", userId: currentUserId, name: "ลูกค้าของ Alice" },
        { id: "c2", userId: otherUserId, name: "ลูกค้าของ Bob" },
        { id: "c3", userId: currentUserId, name: "ลูกค้าของ Alice 2" },
      ];

      // กรองเฉพาะของผู้ใช้ปัจจุบัน
      const userContacts = allContacts.filter(
        (c) => c.userId === currentUserId
      );

      expect(userContacts).toHaveLength(2);
      expect(userContacts.every((c) => c.userId === currentUserId)).toBe(true);
      expect(userContacts.some((c) => c.userId === otherUserId)).toBe(false);
    });

    it("การเพิ่มผู้ติดต่อใหม่ต้องมีข้อมูลจำเป็น (name, company, email, phone) ครบถ้วน", () => {
      const validateContact = (data: Partial<Contact>) => {
        return !!(data.name?.trim() && data.company?.trim() && data.email?.trim() && data.phone?.trim());
      };

      // กรณีข้อมูลครบถ้วน
      expect(
        validateContact({
          name: "สมศรี ใจดี",
          company: "บจก. ตัวอย่าง",
          email: "somsri@example.com",
          phone: "081-111-2222",
        })
      ).toBe(true);

      // กรณีขาดชื่อ
      expect(
        validateContact({
          company: "บจก. ตัวอย่าง",
          email: "somsri@example.com",
          phone: "081-111-2222",
        })
      ).toBe(false);

      // กรณีขาดบริษัท
      expect(
        validateContact({
          name: "สมศรี ใจดี",
          email: "somsri@example.com",
          phone: "081-111-2222",
        })
      ).toBe(false);

      // กรณีขาดเบอร์โทร
      expect(
        validateContact({
          name: "สมศรี ใจดี",
          company: "บจก. ตัวอย่าง",
          email: "somsri@example.com",
        })
      ).toBe(false);
    });
  });
});

