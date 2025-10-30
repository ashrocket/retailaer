import type { APIRoute } from 'astro';
import { readFile, unlink } from 'node:fs/promises';
import { join } from 'node:path';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  try {
    const id = params.id;
    const filePath = join(process.cwd(), 'src/content/blog', `${id}.json`);

    const content = await readFile(filePath, 'utf-8');
    const post = JSON.parse(content);

    return new Response(
      JSON.stringify(post),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error retrieving post:', error);
    return new Response(
      JSON.stringify({ error: 'Post not found' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const id = params.id;
    const filePath = join(process.cwd(), 'src/content/blog', `${id}.json`);

    await unlink(filePath);

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
