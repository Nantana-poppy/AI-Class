---
name: prisma-schema-workflow
description: กฏและขั้นตอนปฏิบัติเมื่อปรับเปลี่ยนโครงสร้างข้อมูล (Database Schema) ด้วย Prisma
---

# Prisma Schema Management Workflow

เมื่อปรับเปลี่ยนโครงสร้างข้อมูล (Database Schema):
1. ให้ใช้คำสั่ง `npx prisma db push` เท่านั้น
2. **ห้าม**ใช้คำสั่ง `npx prisma migrate dev` โดยเด็ดขาด
3. ให้ใช้คำสั่ง `npx prisma generate` เสมอ

