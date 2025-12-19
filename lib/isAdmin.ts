// Admin emails for showing mock data during development/testing
const ADMIN_EMAILS = [
  'nitheeshsudireddy@gmail.com',
  'reddynikhila07@gmail.com',
];

export function isAdminUser(email: string | undefined | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email);
}