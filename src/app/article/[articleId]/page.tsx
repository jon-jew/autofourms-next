"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import CloseIcon from '@mui/icons-material/Close';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import { getCarArticle } from '@/lib/firebase/article';

import './article.scss';

const Article = ({
  params,
}: {
  params: Promise<{ articleId: string }>
}) => {
  const [articleId, setArticleId] = useState(null);
  const [articleContent, setArticleContent] = useState(null);
  const [articleTitle, setArticleTitle] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchArticle = async () => {
      const param = (await params).articleId;
      await getCarArticle(
        param,
        ({ content, title }) => {
          setArticleContent(content);
          setArticleTitle(title);;
        }
      );
      setArticleId(param);
    };
    fetchArticle();
  }, []);
  
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
      <h1>{articleTitle}</h1>
      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: articleContent }}
      >

      </div>
    </div>
  )
}

export default Article;
