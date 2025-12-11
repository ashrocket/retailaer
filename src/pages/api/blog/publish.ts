import type { APIRoute } from 'astro';
import { getSession } from '../../../lib/auth';

export const prerender = false;

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: string;
  authorId: string;
  status: 'draft' | 'published';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  coverImage?: string;
  carouselPreview?: {
    title?: string;
    excerpt?: string;
    meta?: string;
    icon?: string;
    backgroundGradient?: string;
  };
}

/**
 * Publish or save draft blog post via GitHub API
 * Works on Cloudflare Workers - no filesystem access needed
 */
export const POST: APIRoute = async ({ request, cookies, locals }) => {
  try {
    // Get session from blog_session cookie
    const session = getSession(cookies);

    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Not authenticated' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get GitHub token from environment
    const runtime = locals.runtime;
    const githubToken = runtime?.env?.GITHUB_TOKEN || import.meta.env.GITHUB_TOKEN;

    if (!githubToken) {
      console.error('GITHUB_TOKEN not configured');
      return new Response(
        JSON.stringify({ error: 'Publishing not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const { title, slug, content, excerpt, status, coverImage, carouselPreview, id } = body;

    // Validate required fields
    if (!title || !content) {
      return new Response(
        JSON.stringify({ error: 'Title and content are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate slug if not provided
    const postSlug = slug || generateSlug(title);

    // Generate or use existing ID
    const postId = id || Date.now().toString();

    const now = new Date().toISOString();

    // Build post object
    const post: BlogPost = {
      id: postId,
      title,
      slug: postSlug,
      content,
      excerpt: excerpt || generateExcerpt(content),
      author: session.name,
      authorId: session.authorId,
      status: status || 'draft',
      createdAt: body.createdAt || now,
      updatedAt: now,
    };

    // Add publishedAt if publishing
    if (status === 'published' && !body.publishedAt) {
      post.publishedAt = now;
    } else if (body.publishedAt) {
      post.publishedAt = body.publishedAt;
    }

    // Add optional fields
    if (coverImage) {
      post.coverImage = coverImage;
    }

    if (carouselPreview) {
      post.carouselPreview = carouselPreview;
    }

    // GitHub repo details
    const owner = 'ashrocket';
    const repo = 'retailaer';
    const branch = 'main';
    const filePath = `src/content/blog/${postId}.json`;

    // Check if file already exists (for updates)
    let existingSha: string | null = null;

    const fileCheckResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`,
      {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Retailaer-Blog-Editor',
        },
      }
    );

    if (fileCheckResponse.ok) {
      const fileData = await fileCheckResponse.json();
      existingSha = fileData.sha;
    }

    // Prepare file content
    const fileContent = JSON.stringify(post, null, 2);
    const base64Content = btoa(unescape(encodeURIComponent(fileContent)));

    // Commit to GitHub
    const commitBody: Record<string, unknown> = {
      message: status === 'published'
        ? `Publish: ${title}\n\nPublished by ${session.name} via Retailaer Blog Editor`
        : `Draft: ${title}\n\nSaved by ${session.name} via Retailaer Blog Editor`,
      content: base64Content,
      branch: branch,
      committer: {
        name: session.name,
        email: session.email || 'editor@retailaer.com',
      },
    };

    // Include SHA if updating existing file
    if (existingSha) {
      commitBody.sha = existingSha;
    }

    const commitResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Retailaer-Blog-Editor',
        },
        body: JSON.stringify(commitBody),
      }
    );

    if (!commitResponse.ok) {
      const errorText = await commitResponse.text();
      console.error('GitHub commit failed:', {
        status: commitResponse.status,
        statusText: commitResponse.statusText,
        error: errorText,
      });
      return new Response(
        JSON.stringify({
          error: 'Failed to save post',
          details: errorText.substring(0, 200)
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await commitResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        id: postId,
        slug: postSlug,
        status: post.status,
        message: status === 'published'
          ? 'Post published successfully! It will be live in 1-2 minutes after deployment.'
          : 'Draft saved successfully!',
        commit: {
          sha: result.commit.sha,
          url: result.commit.html_url,
        },
        post: {
          id: postId,
          title: post.title,
          slug: postSlug,
          status: post.status,
          url: status === 'published' ? `https://retailaer.us/blog/${postSlug}` : null,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Publish error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to publish post',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

/**
 * Generate URL-friendly slug from title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 60);
}

/**
 * Generate excerpt from HTML content
 */
function generateExcerpt(html: string, maxLength = 160): string {
  // Strip HTML tags
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  if (text.length <= maxLength) {
    return text;
  }

  // Cut at word boundary
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + '...';
}
