import { currentUser } from '@clerk/nextjs/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export type UserRole = 'student' | 'club-owner' | 'admin';

const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];

export async function getUserRole(clerkId: string): Promise<UserRole> {
  await connectDB();
  
  const user = await User.findOne({ clerkId });
  if (!user) {
    return 'student'; // Default role
  }
  
  // Override with admin if email is in admin list
  if (ADMIN_EMAILS.includes(user.email)) {
    if (user.role !== 'admin') {
      await User.findOneAndUpdate({ clerkId }, { role: 'admin' });
    }
    return 'admin';
  }
  
  return user.role;
}

export async function updateUserRole(clerkId: string, role: UserRole): Promise<boolean> {
  try {
    await connectDB();
    
    const user = await User.findOne({ clerkId });
    if (!user) return false;
    
    // Prevent removing admin role if email is in admin list
    if (ADMIN_EMAILS.includes(user.email) && role !== 'admin') {
      return false;
    }
    
    await User.findOneAndUpdate({ clerkId }, { role });
    return true;
  } catch (error) {
    console.error('Error updating user role:', error);
    return false;
  }
}

export async function checkUserRole(requiredRole: UserRole | UserRole[]): Promise<boolean> {
  try {
    const user = await currentUser();
    if (!user) return false;
    
    const userRole = await getUserRole(user.id);
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(userRole);
    }
    
    // Admin has access to everything
    if (userRole === 'admin') return true;
    
    // Club owner has access to club-owner and student features
    if (userRole === 'club-owner' && requiredRole === 'student') return true;
    
    return userRole === requiredRole;
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
}

export async function requireRole(requiredRole: UserRole | UserRole[]) {
  const hasRole = await checkUserRole(requiredRole);
  
  if (!hasRole) {
    throw new Error('Insufficient permissions');
  }
  
  return true;
}

export function getRolePermissions(role: UserRole) {
  const permissions = {
    student: {
      canJoinClubs: true,
      canCreateClubs: false,
      canManageClubs: false,
      canViewAllUsers: false,
      canManageUsers: false,
      canAccessAdmin: false,
    },
    'club-owner': {
      canJoinClubs: true,
      canCreateClubs: true,
      canManageClubs: true,
      canViewAllUsers: false,
      canManageUsers: false,
      canAccessAdmin: false,
    },
    admin: {
      canJoinClubs: true,
      canCreateClubs: true,
      canManageClubs: true,
      canViewAllUsers: true,
      canManageUsers: true,
      canAccessAdmin: true,
    },
  };
  
  return permissions[role];
}
