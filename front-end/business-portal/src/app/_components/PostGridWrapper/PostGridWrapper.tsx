import styles from './PostGridWrapper.module.css';
import { get } from '../../api';
import { PostForm } from '../PostForm/PostForm';
import { PostGridClient } from '../PostGridClient/PostGridClient';

interface PostGridWrapperProps {
  activeTab: 'form' | 'draft' | 'published' | 'archived';
  page: number;
}

async function fetchPosts(page: number, status: string, limit: number = 9) {
  try {
    const response = await get(`/post/status?page=${page}&limit=${limit}&status=${status}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
}

export async function PostGridWrapper({ activeTab, page }: PostGridWrapperProps) {
  if (activeTab === 'form') {
    return <PostForm />;
  }

  const data = await fetchPosts(page, activeTab);
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
      currentPage={page}
    />
  );

}