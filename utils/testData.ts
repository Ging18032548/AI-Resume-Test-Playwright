import dotenv from 'dotenv';

dotenv.config();

export const env = {
  baseUrl:
    process.env.BASE_URL || 'http://localhost:3000',

  apiBaseUrl:
    process.env.API_BASE_URL || 'http://localhost:5000',

  testEmail:
    process.env.TEST_EMAIL || '',

  testPassword:
    process.env.TEST_PASSWORD || '',
};

export const baseUrl = env.baseUrl;

export const apiBaseUrl = env.apiBaseUrl;

export const testEmail = env.testEmail;

export const testPassword = env.testPassword;

export function uniqueEmail(): string {
  return `test_${Date.now()}@example.com`;
}

export const STRONG_PASSWORD =
  'Str0ng!Passw0rd#2026';

export const MAX_UPLOAD_MB = 10;