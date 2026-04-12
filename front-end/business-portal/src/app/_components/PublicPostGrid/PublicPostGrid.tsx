"use client";
import styles from './PublicPostGrid.module.css';
import { PostCard } from '../PostCard/PostCard';
import Pagination from '@mui/material/Pagination';
import { Post } from '../../_types/post.types';
import { MetaData } from '../../_types/metadata.type';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchBar from '../SearchBar/SearchBar';


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

      <div className={styles.sortingAndSearchContainer}>
        <SearchBar 
          placeholder='Search for posts'
        />

        <div className={styles.sorting}>
          <p>Ordenar por: </p>
          <select>
            <option value="newest">Mais Novos</option>
            <option value="oldest">Mais Antigos</option>
          </select>
        </div>
      </div>

      <div className={styles.postsGrid}>
        {posts.map(post => (
          <PostCard 
            key={post.id}
            status='published'
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
            size='medium'
            sx={{
                '& .MuiPaginationItem-root': {
                  color: 'success.main',

                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'primary.dark',
                  },

                  '&.Mui-selected': {
                    backgroundColor: 'primary.dark',
                    color: 'primary.contrastText',  

                    '&:hover': {
                      backgroundColor: 'primary.light',
                      color: 'primary.dark',
                    }
                  }
                }             
             }}
          />
        )}
      </div>
    </div>
  );
}