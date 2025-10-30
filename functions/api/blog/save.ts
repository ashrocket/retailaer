import type { PagesFunction } from '@cloudflare/workers-types';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  author: string;
  excerpt?: string;
  content: string;
  status: 'draft' | 'published';
  createdAt?: string;
  updatedAt: string;
}

export const onRequestPost: PagesFunction = async (context) => {
  try {
    const post: BlogPost = await context.request.json();

    // Validate required fields
    if (!post.title || !post.slug || !post.author || !post.content) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Use KV storage if available, otherwise fallback to D1 or R2
    // For now, we'll use the filesystem approach during development
    const postData = {
      ...post,
      id: post.id || Date.now().toString(),
      createdAt: post.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // In production with Cloudflare, you'd use KV:
    // await context.env.BLOG_POSTS.put(
    //   `post:${postData.id}`,
    //   JSON.stringify(postData)
    // );

    // For development, we'll write to the filesystem
    // This will be handled by a separate Node.js endpoint during dev

    return new Response(
      JSON.stringify({
        success: true,
        id: postData.id,
        message: 'Post saved successfully',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error saving post:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to save post' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
