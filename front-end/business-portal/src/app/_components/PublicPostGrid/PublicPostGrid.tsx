"use client";
import styles from './PublicPostGrid.module.css';
import { PostCard } from '../PostCard/PostCard';
import Pagination from '@mui/material/Pagination';
import { Post, MetaData } from '../../_types/post.types';
import { useRouter, useSearchParams } from 'next/navigation';


interface PublicPostGridProps {
  posts: Post[];
  metaData: MetaData;
}

export function PublicPostGrid({ posts, metaData }: PublicPostGridProps) {

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleOnPageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/blog?${params.toString()}`);
  }

  return (
    <div className={styles.container}>
      <div className={styles.postsGrid}>
        {posts.map(post => (
          <PostCard 
            key={post.id}
            imageUrl={post.coverImageUrl}
            title={post.title}
            slug={post.slug}
            summary={post.summary || post.content.substring(0, 150) + '...'}
            date={new Date(post.publishedAt || post.createdAt).toLocaleDateString('pt-BR')}
            updatedAt={post.updatedAt ? new Date(post.updatedAt).toLocaleDateString('pt-BR') : undefined}
            showUpdatedDate={post.status === 'published' && post.updatedAt ? new Date(post.updatedAt).getTime() > new Date(post.publishedAt || post.createdAt).getTime() : false}
          />
        ))}
      </div>

      <div className={styles.paginationContainer}>
        {metaData && (
          <Pagination
            count={metaData.totalPages}
            page={metaData.currentPage}
            onChange={(_, page) => handleOnPageChange(page)}
            shape='rounded'
            color='primary'
            size='medium'
          />
        )}
      </div>
    </div>
  );
}