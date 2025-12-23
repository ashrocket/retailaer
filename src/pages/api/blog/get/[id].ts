import type { APIRoute } from 'astro';

export const prerender = false;

// Import all blog posts at build time (Cloudflare Workers compatible)
const blogModules = import.meta.glob('../../../../content/blog/*.json', { eager: true });

// Build a map of posts by slug/id
const postsMap: Record<string, any> = {};
for (const [path, module] of Object.entries(blogModules)) {
  const data = (module as any).default || module;
  if (data && data.slug) {
    postsMap[data.slug] = data;
  }
}

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ error: 'Post ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const post = postsMap[id];

  if (!post) {
    return new Response(JSON.stringify({
      error: 'Post not found',
      availablePosts: Object.keys(postsMap)
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify(post), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
