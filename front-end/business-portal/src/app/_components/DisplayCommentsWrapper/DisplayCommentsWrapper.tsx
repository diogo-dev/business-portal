// DisplayCommentsWrapper.tsx (Server Component)
import { get } from '../../api';
import { DisplayComments } from '../DisplayComments/DisplayComments';

async function getComments(postId: string) {
  try {
    const response = await get(`post-comment/${postId}`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

interface WrapperProps {
  postId: string;
}

export async function DisplayCommentsWrapper({ postId }: WrapperProps) {
  const comments = await getComments(postId); // await necessário aqui

  return (
    <div style={{ marginTop: '2rem' }}>
      <DisplayComments comments={comments} />
    </div>
  );
}