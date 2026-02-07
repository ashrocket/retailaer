/**
 * Screenshot API - Stub
 * Playwright requires a real browser runtime and cannot run on Cloudflare Workers.
 * Use the local dev server with playwright installed for screenshot functionality.
 */

import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async () => {
  return new Response(JSON.stringify({
    error: 'Screenshot API is not available in production (requires browser runtime)'
  }), {
    status: 501,
    headers: { 'Content-Type': 'application/json' }
  });
};
