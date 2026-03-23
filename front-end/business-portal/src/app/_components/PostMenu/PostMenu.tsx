"use client";

import { useState } from 'react';
import { useRouter } from "next/navigation";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';


export default function PostMenu() {
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = () => {
    router.push('/manage-post/category');
    handleClose();
  }

  return (
    <>
      <IconButton
        id='basic-icon'
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        aria-controls={open ? 'basic-menu' : undefined}
        onClick={handleClick}
        sx={{
          color: "rgb(227, 227, 227)",
          transition: '0.3s',
          '&:hover': {
            backgroundColor: 'success.dark'
          }
        }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button',
          },
        }}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
        transformOrigin={{vertical: 'top', horizontal: 'right'}}
      >
        <MenuItem onClick={handleMenuItemClick}>Post Category</MenuItem>
      </Menu>
    </>
  );
}