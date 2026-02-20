import { get } from '../../api';
import { PublicPostGrid } from '../PublicPostGrid/PublicPostGrid';
import styles from './PublicPostGridWrapper.module.css';

interface PublicPostGridWrapperProps {
  page: number;
  limit: number;
}

async function fetchPublicPosts(page: number, limit: number) {
  try {
    const response = await get(`/post?page=${page}&limit=${limit}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch public posts: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching public posts:', error);
  }
}

export async function PublicPostGridWrapper({ page, limit }: PublicPostGridWrapperProps) {
  const data = await fetchPublicPosts(page, limit);
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