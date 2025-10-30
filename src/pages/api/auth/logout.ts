/**
 * Logout endpoint - clears session cookie
 */

import type { APIRoute } from 'astro';
import { logout } from '../../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async ({ cookies, redirect }) => {
  logout(cookies);
  return redirect('/blog/login');
};

export const POST: APIRoute = async ({ cookies, redirect }) => {
  logout(cookies);
  return redirect('/blog/login');
};
