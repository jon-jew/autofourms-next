"use client";

import React, { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import { Button } from '@mui/material';

import EditNoteIcon from '@mui/icons-material/EditNote';

import { UserContext } from '@/contexts/userContext';
import { getArticlesByCarId, Article, getArticlesByUserId } from '@/lib/firebase/article';
import './articlePanel.scss';

const getDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

const ArticlePanel = (
  { identifier, isUserOwner, pageType, }:
  { identifier: string, isUserOwner: boolean, pageType: "car" | "user", }
) => {
  const [articles, setArticles] = useState<Article[]>([]);

  const newAritcleLink = `/new-article${pageType === "car" ? `?carId=${identifier}` : ""}`;

  const fetchCarArticles = async () => {
    const res = await getArticlesByCarId(identifier);
    if (res) setArticles(res);
  };
  const fetchUserArticles = async () => {
    const res = await getArticlesByUserId(identifier);
    if (res) setArticles(res);
  };

  useEffect(() => {
    if (pageType === "car") fetchCarArticles();
    else if (pageType === "user") fetchUserArticles();
  }, []);

  return (
    <div className="articles-container">
      <div className="top-button-container">
        {isUserOwner &&
          <Link href={newAritcleLink}>
            <Button startIcon={<EditNoteIcon />} size="small" variant="contained">
              New Article
            </Button>
          </Link>
        }
      </div>
      {articles.map((article) =>
        <Link key={article.id} href={`/article/${article.id}`}>
          <div className="article-preview">
            <div className="article-date">
              {getDate(article.created)}
            </div>
            <div>
              <h2>{article.title}</h2>
              <p className="article-summary">{article.summary}</p>
            </div>
          </div>
        </Link>
      )}
    </div>
  )
};

export default ArticlePanel;
