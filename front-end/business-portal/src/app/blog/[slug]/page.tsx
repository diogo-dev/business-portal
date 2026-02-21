import { notFound } from 'next/navigation';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import { get } from '@/app/api';
import type { Post } from '@/app/_types/post.types';
import styles from './page.module.css';
import { CommentSection } from '@/app/_components/CommentSection/CommentSection';
import { ScrollToComments } from '@/app/_components/ScrollToComments/ScrollToComments';
import { DisplayCommentsWrapper } from '@/app/_components/DisplayCommentsWrapper/DisplayCommentsWrapper';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    const response = await get(`post/slug/${slug}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.log('Error fetching post:', error);
    return null;
  }
}

function formatDate(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const authorName = post.author?.userName || 'Anonymous';
  const authorAvatar = post.author?.profile?.avatarUrl;
  const publishDate = formatDate(post.publishedAt || post.createdAt);

  return (
    <Container maxWidth="md" className={styles.container}>
      <article className={styles.article}>
        
        <h1 className={styles.title}>{post.title}</h1>
        
        {post.summary && (
          <p className={styles.summary}>{post.summary}</p>
        )}

        {/* Author Info & Published Date */}
        <div className={styles.authorSection}>
          <div className={styles.authorInfo}>
            <Avatar 
              sx={{bgcolor: '#000000'}}
              src={authorAvatar} 
              alt={authorName}
              className={styles.avatar}
            >
              {authorName.charAt(0).toUpperCase()}
            </Avatar>
            <div className={styles.authorDetails}>
              <span className={styles.authorName}>{authorName}</span>
              <span className={styles.publishDate}>{publishDate}</span>
            </div>
          </div>

          <ScrollToComments targetId="comments-section" />
        </div>

        {/* Cover Image */}
        {post.coverImageUrl && (
          <div className={styles.coverImageContainer}>
            <img 
              src={post.coverImageUrl} 
              alt={post.title}
              className={styles.coverImage}
            />
          </div>
        )}

        {/* Content */}
        <div className={styles.content}>
          {post.content}
        </div>

        {/* Comment section */}
        <div id="comments-section" className={styles.commentSection}>
          <CommentSection initialCount={post.comments.length || 0} postId={post.id} >
            <DisplayCommentsWrapper postId={post.id} />
          </CommentSection>
        </div>
        
      </article>
    </Container>
  );
}