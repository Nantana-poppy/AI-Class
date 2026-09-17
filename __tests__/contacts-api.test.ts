/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock dependencies before importing routes
vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    contact: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { GET, POST } from "@/app/api/contacts/route";
import { PUT, DELETE } from "@/app/api/contacts/[id]/route";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

describe("Contacts API Routes & Access Control", () => {
  const mockUser = {
    id: "user-test-123",
    name: "วีรภัทร ยอดขวัญ",
    email: "weerapat@example.com",
  };

  const mockSession = {
    user: mockUser,
    session: {
      id: "session-123",
      userId: mockUser.id,
      expiresAt: new Date(Date.now() + 86400000),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/contacts", () => {
    it("ต้องคืนค่า 401 Unauthorized หากยังไม่ได้ล็อกอิน", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

      const response = await GET();
      expect(response.status).toBe(401);

      const data = await response.json();
      expect(data.error).toBe("Unauthorized");
    });

    it("ต้องคืนค่าเฉพาะ contacts ที่ผูกกับ userId ของผู้ใช้ที่ล็อกอิน", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValueOnce(mockSession as any);
      const mockContacts = [
        { id: "c1", userId: mockUser.id, name: "ลูกค้า A", company: "บจก. A" },
        { id: "c2", userId: mockUser.id, name: "ลูกค้า B", company: "บจก. B" },
      ];
      vi.mocked(prisma.contact.findMany).mockResolvedValueOnce(mockContacts as any);

      const response = await GET();
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.contacts).toHaveLength(2);
      expect(prisma.contact.findMany).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
        orderBy: { createdAt: "desc" },
      });
    });
  });

  describe("POST /api/contacts", () => {
    it("ต้องคืนค่า 401 Unauthorized หากยังไม่ได้ล็อกอิน", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

      const req = new Request("http://localhost:3000/api/contacts", {
        method: "POST",
        body: JSON.stringify({ name: "ทดสอบ" }),
      });

      const response = await POST(req);
      expect(response.status).toBe(401);
    });

    it("ต้องคืนค่า 400 หากข้อมูลจำเป็นไม่ครบถ้วน", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValueOnce(mockSession as any);

      // ขาด phone และ email
      const req = new Request("http://localhost:3000/api/contacts", {
        method: "POST",
        body: JSON.stringify({ name: "ทดสอบ", company: "บจก. A" }),
      });

      const response = await POST(req);
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toContain("กรุณากรอกข้อมูลที่จำเป็น");
    });

    it("ต้องสร้าง contact ใหม่และผูก userId ของผู้ใช้สำเร็จ (201 Created)", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValueOnce(mockSession as any);
      const newContactData = {
        name: "คุณสมพงษ์ ยอดเยี่ยม",
        company: "บจก. ยอดเยี่ยมการค้า",
        email: "sompong@yodyiem.co.th",
        phone: "089-123-4567",
        channel: "โทรศัพท์",
        interestedIn: "ระบบ CRM",
        status: "รายการใหม่",
      };

      vi.mocked(prisma.contact.create).mockResolvedValueOnce({
        id: "c-new-1",
        userId: mockUser.id,
        ...newContactData,
      } as any);

      const req = new Request("http://localhost:3000/api/contacts", {
        method: "POST",
        body: JSON.stringify(newContactData),
      });

      const response = await POST(req);
      expect(response.status).toBe(201);

      const data = await response.json();
      expect(data.contact.id).toBe("c-new-1");
      expect(prisma.contact.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: mockUser.id,
            name: "คุณสมพงษ์ ยอดเยี่ยม",
            email: "sompong@yodyiem.co.th",
          }),
        })
      );
    });
  });

  describe("PUT /api/contacts/[id]", () => {
    it("ต้องคืนค่า 401 Unauthorized หากยังไม่ได้ล็อกอิน", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

      const req = new Request("http://localhost:3000/api/contacts/c1", {
        method: "PUT",
        body: JSON.stringify({ status: "กำลังคุย" }),
      });

      const response = await PUT(req, { params: Promise.resolve({ id: "c1" }) });
      expect(response.status).toBe(401);
    });

    it("ต้องคืนค่า 404 หากพยายามแก้ไข contact ที่ไม่ใช่ของตัวเอง", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValueOnce(mockSession as any);
      // findFirst คืนค่า null เนื่องจากไม่ใช่เจ้าของ
      vi.mocked(prisma.contact.findFirst).mockResolvedValueOnce(null);

      const req = new Request("http://localhost:3000/api/contacts/c-other", {
        method: "PUT",
        body: JSON.stringify({ status: "ปิดงาน" }),
      });

      const response = await PUT(req, { params: Promise.resolve({ id: "c-other" }) });
      expect(response.status).toBe(404);
    });

    it("ต้องอัปเดตข้อมูลสำเร็จเมื่อเป็น contact ของตัวเอง", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValueOnce(mockSession as any);
      const existingContact = {
        id: "c1",
        userId: mockUser.id,
        name: "สมชาย",
        status: "รายการใหม่",
      };
      vi.mocked(prisma.contact.findFirst).mockResolvedValueOnce(existingContact as any);
      vi.mocked(prisma.contact.update).mockResolvedValueOnce({
        ...existingContact,
        status: "กำลังคุย",
      } as any);

      const req = new Request("http://localhost:3000/api/contacts/c1", {
        method: "PUT",
        body: JSON.stringify({ status: "กำลังคุย" }),
      });

      const response = await PUT(req, { params: Promise.resolve({ id: "c1" }) });
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.contact.status).toBe("กำลังคุย");
      expect(prisma.contact.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "c1" },
          data: expect.objectContaining({ status: "กำลังคุย" }),
        })
      );
    });
  });

  describe("DELETE /api/contacts/[id]", () => {
    it("ต้องคืนค่า 401 Unauthorized หากยังไม่ได้ล็อกอิน", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

      const req = new Request("http://localhost:3000/api/contacts/c1", {
        method: "DELETE",
      });

      const response = await DELETE(req, { params: Promise.resolve({ id: "c1" }) });
      expect(response.status).toBe(401);
    });

    it("ต้องคืนค่า 404 หากพยายามลบ contact ที่ไม่ใช่ของตัวเอง", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValueOnce(mockSession as any);
      vi.mocked(prisma.contact.findFirst).mockResolvedValueOnce(null);

      const req = new Request("http://localhost:3000/api/contacts/c-other", {
        method: "DELETE",
      });

      const response = await DELETE(req, { params: Promise.resolve({ id: "c-other" }) });
      expect(response.status).toBe(404);
    });

    it("ต้องลบ contact สำเร็จเมื่อเป็น contact ของตัวเอง", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValueOnce(mockSession as any);
      vi.mocked(prisma.contact.findFirst).mockResolvedValueOnce({
        id: "c1",
        userId: mockUser.id,
      } as any);
      vi.mocked(prisma.contact.delete).mockResolvedValueOnce({ id: "c1" } as any);

      const req = new Request("http://localhost:3000/api/contacts/c1", {
        method: "DELETE",
      });

      const response = await DELETE(req, { params: Promise.resolve({ id: "c1" }) });
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(prisma.contact.delete).toHaveBeenCalledWith({
        where: { id: "c1" },
      });
    });
  });
});
