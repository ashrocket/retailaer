import type { APIRoute } from 'astro';
import { getSession } from '../../lib/auth';

export const prerender = false;

/**
 * Fetch an article URL and extract Open Graph metadata.
 * Works on Cloudflare Workers — just fetch() + regex parsing.
 */
export const POST: APIRoute = async ({ request, cookies }) => {
  const session = getSession(cookies);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: { url: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { url } = body;
  if (!url || !url.startsWith('http')) {
    return new Response(JSON.stringify({ error: 'A valid URL is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Retailaer/1.0)',
        'Accept': 'text/html',
      },
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Failed to fetch URL (${response.status})` }),
        { status: 502, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const html = await response.text();

    const title = extractMeta(html, 'og:title') || extractTitle(html);
    const description = extractMeta(html, 'og:description') || extractMeta(html, 'description');
    const image = extractMeta(html, 'og:image');
    const siteName = extractMeta(html, 'og:site_name');

    // Extract body HTML for client-side screenshot capture (strip scripts for safety)
    const bodyHtml = extractBodyHtml(html, url);

    return new Response(
      JSON.stringify({ title, description, image, siteName, bodyHtml }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('fetch-article error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch article' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};

/** Extract content from <meta property="..." content="..."> or <meta name="..." content="..."> */
function extractMeta(html: string, name: string): string | null {
  // Match both property= and name= attributes, in either order with content=
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${escapeRegex(name)}["'][^>]+content=["']([^"']*)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${escapeRegex(name)}["']`, 'i'),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeHtmlEntities(match[1]);
  }
  return null;
}

/** Extract text from <title> tag */
function extractTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match?.[1] ? decodeHtmlEntities(match[1].trim()) : null;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Extract <body> content, strip scripts, and resolve relative URLs */
function extractBodyHtml(html: string, baseUrl: string): string | null {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch?.[1]) return null;

  let body = bodyMatch[1];
  // Strip all <script> tags and their contents
  body = body.replace(/<script[\s\S]*?<\/script>/gi, '');
  // Strip inline event handlers
  body = body.replace(/\s+on\w+="[^"]*"/gi, '');
  body = body.replace(/\s+on\w+='[^']*'/gi, '');

  // Extract <head> content for stylesheets
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  let styles = '';
  if (headMatch?.[1]) {
    // Pull out <link rel="stylesheet"> and <style> tags
    const linkMatches = headMatch[1].match(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi) || [];
    const styleMatches = headMatch[1].match(/<style[\s\S]*?<\/style>/gi) || [];
    styles = [...linkMatches, ...styleMatches].join('\n');
  }

  // Build a self-contained HTML doc with <base> for resolving relative URLs
  return `<!DOCTYPE html><html><head><base href="${baseUrl}">${styles}</head><body>${body}</body></html>`;
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}
