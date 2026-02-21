"use client";

import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface ScrollToCommentsProps {
  targetId: string;
}

export function ScrollToComments({ targetId }: ScrollToCommentsProps) {
  
  const handleClick = () => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <IconButton 
      onClick={handleClick}
      sx={{
        backgroundColor: '#f0f0f0',
        '&:hover': {
          backgroundColor: '#e0e0e0', 
        },
        padding: '8px', 
      }}
    >
      <ExpandMoreIcon titleAccess='scroll to comments' />
    </IconButton>
  );



}