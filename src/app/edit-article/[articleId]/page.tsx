'use server';
import { notFound, redirect } from 'next/navigation';

import { getCarArticle } from '@/lib/firebase/article/articleServer';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import EditArticle from '@/components/editArticle/editArticle';

const EditArticlePage = async ({
  params,
}: {
  params: Promise<{ articleId: string }>
}) => {
  const articleId = (await params).articleId
  const { currentUser } = await getAuthenticatedAppForUser();
  if (!currentUser) redirect('/');

  const { article: initialData, res } = await getCarArticle(articleId);
  if (!res) notFound();
  
  return (
    <EditArticle currentUserId={currentUser?.uid} data={initialData} articleId={articleId} />
  );
};

export default EditArticlePage;
