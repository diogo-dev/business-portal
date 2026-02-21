"use client";
import { Avatar, Typography, Box, Divider } from '@mui/material';
import { Comment } from '@/app/_types/comment.types';

interface DisplayCommentsProps {
  comments: Comment[];
}

export function DisplayComments({ comments }: DisplayCommentsProps) {
  if (comments.length === 0) {
    return <Typography color="textSecondary">No comments yet. Be the first!</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, marginLeft: '8px' }}>
      {comments.map((comment) => (
        <Box key={comment.id} sx={{ display: 'flex', gap: 2 }}>
          <Avatar 
            src={comment.author?.profile?.avatarUrl} 
            sx={{ bgcolor: '#000000', width: 30, height: 30 }}
          >
            {comment.author?.userName?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                {comment.author?.userName}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {new Date(comment.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#333', lineHeight: 1.6 }}>
              {comment.content}
            </Typography>
          </Box>
        </Box>
      ))}
      <Divider sx={{ my: 2 }} />
    </Box>
  );
}