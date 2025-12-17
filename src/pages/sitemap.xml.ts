import type { APIRoute } from 'astro';

export const prerender = false;

// Static pages with their priorities and change frequencies
const staticPages = [
  { url: '/', priority: 1.0, changefreq: 'weekly' },
  { url: '/solutions', priority: 0.9, changefreq: 'monthly' },
  { url: '/company', priority: 0.8, changefreq: 'monthly' },
  { url: '/contact', priority: 0.9, changefreq: 'monthly' },
  { url: '/insights', priority: 0.8, changefreq: 'weekly' },
  { url: '/faq', priority: 0.7, changefreq: 'monthly' },
  { url: '/privacy', priority: 0.3, changefreq: 'yearly' },
  { url: '/terms', priority: 0.3, changefreq: 'yearly' },
  { url: '/cookies', priority: 0.3, changefreq: 'yearly' },
];

export const GET: APIRoute = async () => {
  const baseUrl = 'https://retailaer.com';
  const now = new Date().toISOString().split('T')[0];

  // Load blog posts dynamically
  let blogUrls: { url: string; lastmod: string; priority: number; changefreq: string }[] = [];

  try {
    // Import blog posts at runtime
    const blogModules = import.meta.glob('../content/blog/*.json', { eager: true });

    blogUrls = Object.values(blogModules)
      .map((module: any) => module.default || module)
      .filter(post => post && post.status === 'published')
      .map(post => ({
        url: `/blog/${post.slug}`,
        lastmod: post.updatedAt || post.publishedAt || now,
        priority: 0.6,
        changefreq: 'monthly'
      }));
  } catch (error) {
    console.error('Error loading blog posts for sitemap:', error);
  }

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
${blogUrls.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
    }
  });
};
