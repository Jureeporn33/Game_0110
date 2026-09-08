# Cyber Logic Quest V2

Prototype V2 สำหรับทดสอบ Local ก่อนเชื่อมระบบออนไลน์

## สิ่งที่เพิ่มจาก V1
- Mobile-first สำหรับโทรศัพท์/iPad
- Pair Mode
- ระบุ Round / Pair
- AND / OR / XOR 10 ด่าน
- Binary answer แบบแตะ 0 ↔ 1 ไม่เปิด keyboard
- XOR + ASCII 2 รอบ สลับบทบาท
- Host Dashboard
- Leaderboard แยกตาม Round
- เก็บคะแนนใน localStorage สำหรับทดสอบ UX บนเครื่องเดียว

## สำคัญ
Host Dashboard รุ่นนี้ยังเป็น Local Prototype:
คะแนนจากโทรศัพท์หลายเครื่องยังไม่รวมกัน เพราะยังไม่มี Database กลาง
เมื่อ UX ผ่าน จะเชื่อม Backend/Database เพื่อให้ Host เห็นคะแนนทุกอุปกรณ์แบบ realtime

## Run
ติดตั้ง Node.js แล้ว:

npm install
npm run dev

Vite จะเปิด server แบบ --host 0.0.0.0

### ทดลองบนโทรศัพท์/iPad ใน Wi-Fi เดียวกัน
Terminal จะแสดง Network URL เช่น:
http://192.168.x.x:5173

เปิด URL นั้นจากโทรศัพท์/iPad

หากเปิดไม่ได้ ให้ตรวจ Windows Firewall ว่าอนุญาต Node.js / port 5173 ใน Private Network

## Build
npm run build
npm run preview
