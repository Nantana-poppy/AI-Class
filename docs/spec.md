## Follow-up Board
Webapp สำหรับจัดการรายชื่อผู้ติดต่อ แสดง สถานะและวัน ติดตาม

## Techstack
-Node.js
-Typescirpt
-Prisma ใช้ PG Adaptor ด้วย ใช้ Client ด้วย
-Supabase PostgreSQL
-Better Auth
-Vitest ใช้ ui ด้วย

## setup  Roles
-ใช้packageเวอชั่นล่าสุด
-ห้ามใช้ Beta canary Expriment version
-หากจำเป็นต้องใช้ package ให้ตรวจสอบความเข้ากัน Next.js 

## Working Rule
-ทำเฉพาะงานที่สั่ง ในแต่ละครั้ง
-ห้ามเพิ่ม feature logic หรือ ui
-ห้าม แก้ไข ส่วนที่ไม่เกี่ยวข้องกับงานเดิม
-หากข้อมูลไม่พอหรือจำเป้นต้องขยายขอบเขต ให้ถามก่อนทำ
-ไม่ต้อง npm run buildเด๊่ยวทดสอบเอง

## Access
-จะเข้าดูข้อมูลหน้าภายในได้ ต้องเป็น user ที่ล็อคอินอยู่
-ผู้ใช้ที่ดู เพิ่ม แก้ไข และลบได้เฉพาะข้อมูลของ contact ตัวเอง