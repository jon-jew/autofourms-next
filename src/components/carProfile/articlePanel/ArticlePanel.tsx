"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@mui/material';

import EditNoteIcon from '@mui/icons-material/EditNote';

import { Article } from '@/lib/interfaces';

import './articlePanel.scss';

const getDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

const ArticlePanel = (
  {
    identifier,
    isUserOwner,
    pageType,
    articles,
  }:
    {
      identifier: string,
      isUserOwner: boolean,
      pageType: "car" | "user",
      articles: Article[],
    }
) => {

  const newAritcleLink = `/new-article${pageType === "car" ? `?carId=${identifier}` : ""}`;

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
      {articles.map((article: Article) =>
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
