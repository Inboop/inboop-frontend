// Admin email for showing mock data during development/testing
const ADMIN_EMAIL = 'nitheeshsudireddy@gmail.com';

export function isAdminUser(email: string | undefined | null): boolean {
  return email === ADMIN_EMAIL;
}