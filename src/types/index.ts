export interface PostCard {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl: string;
  views: number;
  clicks: number;
  isFeatured: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface PostDetail extends PostCard {
  description: string | null;
  externalUrl: string;
  status: string;
  tags: Array<{
    tag: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
}

export interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: { posts: number };
}

export interface DashboardStats {
  totalPublished: number;
  totalDrafts: number;
  totalCategories: number;
  totalViews: number;
  totalClicks: number;
}
