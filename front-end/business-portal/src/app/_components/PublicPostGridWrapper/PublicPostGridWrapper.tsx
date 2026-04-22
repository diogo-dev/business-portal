import { get } from '../../api';
import { PublicPostGrid } from '../PublicPostGrid/PublicPostGrid';
import styles from './PublicPostGridWrapper.module.css';

interface PublicPostGridWrapperProps {
  page: number;
  limit: number;
  sort: 'asc' | 'desc';
  categories: string[];
}

async function fetchPublicPosts(page: number, limit: number, sort: string = 'desc', categories: string[] = []) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sort,
    });

    categories.forEach((categorySlug) => {
      params.append('categories', categorySlug);
    });

    const response = await get(`/post?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch public posts: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching public posts:', error);
  }
}

export async function PublicPostGridWrapper({ page, limit, sort, categories }: PublicPostGridWrapperProps) {
  const data = await fetchPublicPosts(page, limit, sort, categories);
  const { posts, meta } = data;

  if (!posts || posts.length === 0) {
    return (
      <div className={styles.noDataMessageStyle}>
          <p>No posts created yet.</p>
      </div>
    );
  }

  return (
    <div>
      <PublicPostGrid 
        posts={posts}
        metaData={meta}
      />
    </div>
  );
}