import dotenv from 'dotenv';

dotenv.config();

export const env = {
  baseUrl:
    process.env.BASE_URL || 'http://localhost:5173',

  apiBaseUrl:
    process.env.API_BASE_URL || 'http://localhost:5000',

  testEmail:
    process.env.TEST_EMAIL || '',

  testPassword:
    process.env.TEST_PASSWORD || '',

  registrationName:
    process.env.REGISTRATION_NAME || '',

  registrationEmail:
    process.env.REGISTRATION_EMAIL || '',

  registrationPassword:
    process.env.REGISTRATION_PASSWORD || '',
};

export const baseUrl = env.baseUrl;

export const apiBaseUrl = env.apiBaseUrl;

export const testEmail = env.testEmail;

export const testPassword = env.testPassword;

export function hasRegistrationAccount(): boolean {
  return Boolean(
    env.registrationName &&
    env.registrationEmail &&
    env.registrationPassword
  );
}

export function uniqueEmail(): string {
  return `test_${Date.now()}@example.com`;
}

export function uniqueRegistrationEmail(): string {
  const configuredEmail = env.registrationEmail.trim().toLowerCase();
  const separator = configuredEmail.includes('@') ? configuredEmail.indexOf('@') : -1;

  if (separator > 0) {
    const localPart = configuredEmail.slice(0, separator);
    const domain = configuredEmail.slice(separator + 1);
    return `${localPart}+pw-${Date.now()}@${domain}`;
  }

  return uniqueEmail();
}

export const STRONG_PASSWORD =
  'Str0ng!Passw0rd#2026';

export const MAX_UPLOAD_MB = 5;

export function hasTestAccount(): boolean {
  return Boolean(env.testEmail && env.testPassword);
}