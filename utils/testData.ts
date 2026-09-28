import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const baseUrl = process.env.BASE_URL || 'https://town-blanket-franchise-ranking.trycloudflare.com';

/** ค่าจาก .env รวมไว้ที่เดียว เพื่อไม่ให้ spec/page อ่าน process.env กระจัดกระจาย */
export const env = {
  baseUrl,
  apiBaseUrl: process.env.API_BASE_URL || `${baseUrl}/api`,
  testEmail: process.env.TEST_EMAIL || 'qa.automation@example.com',
  testPassword: process.env.TEST_PASSWORD || 'ChangeMe123!',
};

/** สร้างอีเมลไม่ซ้ำสำหรับทดสอบ Register ทุกครั้งที่รัน (กัน "email already exists") */
export function uniqueEmail(prefix = 'qa.register'): string {
  return `${prefix}+${Date.now()}${Math.floor(Math.random() * 1000)}@example.com`;
}

/** รหัสผ่านที่ผ่านกฎความแข็งแรงทั่วไป (ตัวใหญ่/เล็ก/ตัวเลข/สัญลักษณ์ ≥ 8 ตัว) */
export const STRONG_PASSWORD = 'Str0ng!Passw0rd#2026';

/** ขนาดไฟล์สูงสุดที่ฝั่ง UI ควรรับ (MB) ปรับให้ตรงกับระบบจริง */
export const MAX_UPLOAD_MB = 10;
