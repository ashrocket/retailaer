import type { PagesFunction } from '@cloudflare/workers-types';

// GET - Retrieve a single post
export const onRequestGet: PagesFunction = async (context) => {
  try {
    const id = context.params.id as string;

    // In production with Cloudflare KV:
    // const post = await context.env.BLOG_POSTS.get(`post:${id}`, 'json');

    // For development, return placeholder
    return new Response(
      JSON.stringify({
        id,
        title: 'Sample Post',
        slug: 'sample-post',
        author: 'Retailaer Team',
        excerpt: 'This is a sample post',
        content: '# Sample Post\n\nThis is sample content.',
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error retrieving post:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to retrieve post' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// DELETE - Delete a post
export const onRequestDelete: PagesFunction = async (context) => {
  try {
    const id = context.params.id as string;

    // In production with Cloudflare KV:
    // await context.env.BLOG_POSTS.delete(`post:${id}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Post deleted successfully',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error deleting post:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete post' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
