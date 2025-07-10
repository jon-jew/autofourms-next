import { notFound, redirect } from 'next/navigation';

import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
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
  if (!articleId) notFound();
  const { currentUser } = await getAuthenticatedAppForUser();

  const articleRes: Article | boolean = await getCarArticle(articleId);
  if (!articleRes || typeof articleRes === "boolean") notFound();

  return (
    <CarArticle articleId={articleId} currentUserId={currentUser?.uid} {...articleRes} />
  );
};

export default ArticlePage;
