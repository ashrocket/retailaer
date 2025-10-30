import type { APIRoute } from 'astro';
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const post = await request.json();

    // Validate required fields
    if (!post.title || !post.slug || !post.author || !post.content) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const postData = {
      ...post,
      id: post.id || Date.now().toString(),
      createdAt: post.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to filesystem
    const contentDir = join(process.cwd(), 'src/content/blog');
    await mkdir(contentDir, { recursive: true });

    const filePath = join(contentDir, `${postData.id}.json`);
    await writeFile(filePath, JSON.stringify(postData, null, 2), 'utf-8');

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
