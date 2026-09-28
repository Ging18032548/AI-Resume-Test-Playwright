# AI CV Analyzer — Playwright E2E Test Suite (TypeScript)

ครอบคลุม: Authentication (Register/Login/Password Reset/Logout), Resume Upload (PDF/DOCX + validation),
AI Analysis (Score/Feedback/Keyword Matching), Profile & Settings — รันบน 4 devices

## โครงสร้าง
```
playwright.config.ts      # 4 projects, screenshot/video/trace, HTML reporter
.env.example              # BASE_URL, API_BASE_URL, TEST_EMAIL, TEST_PASSWORD
pages/  BasePage.ts  LoginPage.ts  DashboardPage.ts  ProfilePage.ts
tests/e2e/e2e-flow.spec.ts        # AUTH / UPLOAD / ANALYSIS / PROFILE
tests/api/backend-health.spec.ts  # Health check + /analyze schema
utils/  testData.ts  testFiles.ts # env, unique email, PDF/DOCX/invalid/oversized fixtures
```

## ติดตั้งและรัน
```bash
npm install
npx playwright install --with-deps
cp .env.example .env            # ใส่ BASE_URL, TEST_EMAIL, TEST_PASSWORD

npm run test:all-devices        # ทุก device
npm run test:chrome             # Desktop Chrome 1920x1080
npm run test:firefox            # Desktop Firefox 1920x1080
npm run test:mobile-safari      # iPhone 14 Pro
npm run test:mobile-chrome      # Pixel 5
npm run test:auth               # เฉพาะกลุ่ม Authentication (upload/analysis/profile ก็มี)
npm run report                  # เปิด HTML Report ล่าสุด
```
HTML Report ฝัง screenshot, video และ trace ไว้ในหน้าเดียว (เปิดอัตโนมัติเมื่อมีเทสต์ล้ม เมื่อรันในเครื่อง)
ภาพที่แนบด้วย `attachScreenshot()` จะเห็นในรายงานแม้เทสต์ผ่าน

## ต้องปรับก่อนรันกับระบบจริง
Locator เขียนจากรูปแบบมาตรฐาน (role/label + `data-testid` สำรอง) เพราะยังตรวจ DOM จริงของแอปไม่ได้
1. ปรับ path (`/login`, `/register`, `/dashboard`, `/profile`) และ `data-testid` ใน `pages/*.ts`
2. ปรับข้อความ error ที่คาดหวัง (regex) ให้ตรงกับข้อความจริงของแอป
3. ปรับ `MAX_UPLOAD_MB` ใน `utils/testData.ts` ให้ตรงกับเพดานจริง
4. ถ้าแอปบังคับยืนยันอีเมลหลังสมัคร AUTH-01 ต้องปรับให้สอดคล้อง
5. ถ้า Login ใช้ Google OAuth อย่างเดียว ให้ใช้ `storageState` แทนการกรอกฟอร์ม
