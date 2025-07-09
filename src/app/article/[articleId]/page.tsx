
import React from 'react';

import { getCarArticle } from '@/lib/firebase/article/articleServer';
import CarArticle from '@/components/article/carArticle';

import './article.scss';

interface Article {
  title: string;
  content: string;
};

const ArticlePage = async ({
  params,
}: {
  params: Promise<{ articleId: string }>
}) => {
  const articleId = (await params).articleId;
  let articleRes: Article = {
    title: '',
    content: '',
  }
  await getCarArticle(
    articleId,
    (res: Article) => {
      articleRes = res;
    }
  );

  return (
    <CarArticle articleId={articleId} {...articleRes} />
  );
};

export default ArticlePage;
