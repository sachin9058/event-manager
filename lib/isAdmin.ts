// lib/isAdmin.ts
import { currentUser } from "@clerk/nextjs/server";

export async function isAdmin(): Promise<boolean> {
  const user = await currentUser();
  
  if (!user) {
    return false;
  }

  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()) || [];
  const userEmail = user.emailAddresses[0]?.emailAddress || '';
  
  return adminEmails.includes(userEmail);
}

export async function requireAdmin() {
  const admin = await isAdmin();
  
  if (!admin) {
    throw new Error('Unauthorized: Admin access required');
  }
  
  return true;
}
