/**
 * Authentication utilities for blog editor
 */

import type { AstroCookies } from 'astro';
import { getAuthorById } from '../config/authors';

export interface Session {
  authorId: string;
  name: string;
  email?: string;
  linkedinUsername: string;
  picture?: string;
  exp: number;
}

/**
 * Get current session from cookie
 */
export function getSession(cookies: AstroCookies): Session | null {
  const sessionToken = cookies.get('blog_session')?.value;

  if (!sessionToken) {
    return null;
  }

  try {
    const sessionData = JSON.parse(atob(sessionToken)) as Session;

    // Check if session expired
    if (sessionData.exp < Date.now()) {
      return null;
    }

    return sessionData;
  } catch (error) {
    console.error('Invalid session token:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(cookies: AstroCookies): boolean {
  return getSession(cookies) !== null;
}

/**
 * Require authentication - returns session or null
 * Pages should check the result and redirect manually if needed
 */
export function requireAuth(cookies: AstroCookies): Session | null {
  return getSession(cookies);
}

/**
 * Logout - clear session cookie
 */
export function logout(cookies: AstroCookies): void {
  cookies.delete('blog_session', { path: '/' });
}
