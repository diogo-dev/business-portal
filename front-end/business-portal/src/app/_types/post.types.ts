export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  coverImageUrl: string;
  status: string;
  createdAt: string;
  publishedAt?: string;
  updatedAt?: string;
}

export interface MetaData {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}


