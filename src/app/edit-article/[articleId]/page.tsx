"use client";

import React, { useEffect, useState, useContext } from 'react';
import { redirect } from 'next/navigation';

import EditArticle from '@/components/editArticle/editArticle';
import { UserContext } from '@/contexts/userContext';
import { editCarArticle, getCarArticle } from '@/lib/firebase/article';
import LoadingOverlay from '@/components/loadingOverlay';

const EditArticlePage = ({
  params,
}: {
  params: Promise<{ articleId: string }>
}) => {
  const { user } = useContext(UserContext);
  const [carInfo, setCarInfo] = useState(null);
  const [articleId, setArticleId] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      const param = (await params).articleId;
      await getCarArticle(
        param,
        ({ content, title }) => setInitialData({ articleContent: content, title })
      );
      setArticleId(param);
      setLoading(false);
    };
    fetchArticle();
  }, []);

  const onSave = async (value, carData) => {
    await editCarArticle(articleId, value.title, value.articleContent);
    redirect(`/article/${articleId}`);
  };
  return (
    <div>
      <LoadingOverlay isLoading={loading} />
      {initialData &&
        <div>
          <EditArticle data={initialData} onSave={onSave} articleId={articleId} />
        </div>
      }
    </div>
  )
};

export default EditArticlePage;
