# กฏการใช้ Prisma

เมื่อปรับเปลี่ยนโครงสร้างข้อมูล (Database Schema):
- ให้ใช้คำสั่ง `npx prisma db push` เท่านั้น
- **ห้าม**ใช้คำสั่ง `npx prisma migrate dev` โดยเด็ดขาด
- ให้ใช้คำสั่ง `npx prisma generate` เสมอ

