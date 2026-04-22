import styles from './PostGridWrapper.module.css';
import { getServer } from '../../api';
import PostForm  from '../PostForm/PostForm';
import PostGridClient  from '../PostGridClient/PostGridClient';
import { cookies } from 'next/headers';

interface PostGridWrapperProps {
  activeTab: 'form' | 'draft' | 'published' | 'archived';
  page: number;
  sort: 'asc' | 'desc';
}

async function fetchPosts(page: number, status: string, sort: 'asc' | 'desc', limit: number = 9) {
  try {
    const cookieStore = await cookies();
    const response = await getServer(
      `/post/status?page=${page}&limit=${limit}&status=${status}&sort=${sort}`,
      cookieStore.toString(),
    );

    if (!response.ok) {
      throw new Error(response.statusText || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Failed to fetch posts:', message);
    return { posts: [], meta: null };
  }
}

export default async function PostGridWrapper({ activeTab, page, sort }: PostGridWrapperProps) {
  if (activeTab === 'form') {
    return <PostForm />;
  }

  const data = await fetchPosts(page, activeTab, sort);
  const { posts, meta } = data;

  if (!posts || posts.length === 0) {
    return (
      <div className={styles.noDataMessageStyle}>
          <p>No posts created yet.</p>
      </div>
    );
  }

  return (
    <PostGridClient 
      posts={posts}
      metaData={meta}
      postStatus={activeTab}
    />
  );

}