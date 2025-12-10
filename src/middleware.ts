import { defineMiddleware } from 'astro:middleware';

// Map URL prefixes to theme names
const themeMap: Record<string, string> = {
  '0': 'current',
  '1': 'design-1',
  '2': 'design-2',
};

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);

  // Check if the first path segment is a theme prefix
  if (pathParts.length > 0 && themeMap[pathParts[0]]) {
    const themePrefix = pathParts[0];
    const themeName = themeMap[themePrefix];

    // Remove the theme prefix from the path
    const newPath = '/' + pathParts.slice(1).join('/') || '/';

    // Store theme in locals for the page to use
    context.locals.theme = themeName;
    context.locals.themePrefix = themePrefix;

    // Create new request with original URL header (for fallback detection)
    const newUrl = new URL(newPath, url.origin);
    const headers = new Headers(context.request.headers);
    headers.set('x-original-url', url.pathname);

    const newRequest = new Request(newUrl, {
      method: context.request.method,
      headers: headers,
      body: context.request.method !== 'GET' && context.request.method !== 'HEAD'
        ? context.request.body
        : undefined,
    });

    // Use Astro.rewrite with the modified request
    return context.rewrite(newRequest);
  }

  // No theme prefix - use default
  context.locals.theme = 'current';
  context.locals.themePrefix = '';

  return next();
});
