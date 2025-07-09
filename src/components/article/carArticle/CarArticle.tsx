"use client";

import React, { useState } from 'react';
import Link from 'next/link';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const CarArticle = (
  { content, title, articleId }:
    { content: string, title: string, articleId: string }
) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="article-container">
      <div className="button-container">
        <IconButton
          onClick={handleClick}
        >
          <MoreHorizIcon />
        </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <Link href={`/edit-article/${articleId}`}>
            <MenuItem>Edit</MenuItem>
          </Link>
          <MenuItem sx={{ color: 'red' }} >Delete</MenuItem>
        </Menu>
      </div>
      <h1>{title}</h1>
      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: content }}
      >

      </div>
    </div>
  )
}

export default CarArticle;
