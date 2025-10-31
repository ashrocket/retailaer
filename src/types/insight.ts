export interface InsightPreview {
  title: string;
  excerpt: string;
  backgroundGradient: string;
  icon: 'plane' | 'document' | 'chart' | 'globe' | 'rocket';
  meta: 'ARTICLE' | 'REPORT' | 'CASE STUDY' | 'GUIDE' | 'BLOG POST';
}

export interface Insight {
  id: string;
  slug: string;
  type: 'article' | 'blog-post';

  // Content
  title: string;
  content: string;
  coverImage?: string;

  // Preview/Card display
  preview: InsightPreview;

  // Metadata
  author: string;
  authorEmail: string;
  publishedAt: string;
  updatedAt?: string;

  // Carousel management
  carouselOrder: number;
  isActive: boolean; // Show in carousel or not

  // Stats
  readTimeMinutes?: number;
  category?: string;
}

export interface InsightCarouselSettings {
  autoRotateInterval: number; // milliseconds (default: 15000)
  visibleCount: number; // how many cards visible at once (default: 3)
  rotateCount: number; // how many to rotate at a time (default: 1)
}
