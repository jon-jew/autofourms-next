"use client";

import React, { useEffect, useState, useContext } from 'react';
import { redirect } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

import EditArticle from '@/components/editArticle/editArticle';
import { UserContext } from '@/contexts/userContext';
import { createCarArticle } from '@/lib/firebase/article';
import { getCar } from '@/lib/firebase/carServer';
import LoadingOverlay from '@/components/loadingOverlay';

interface Article {
  articleContent: string,
  title: string,
  thumbnailImage?: string,
};
interface Car {
  id: string,
  make: string,
  model: string,
  modelYear: string,
};

const initialData = {
  articleContent: '',
  title: '',
};

const NewArticlePage = () => {
  const searchParams = useSearchParams();
  const carId = searchParams ? searchParams.get('carId') : null;
  const { user, userLoading } = useContext(UserContext);
  const [carInfo, setCarInfo] = useState<Car | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCarData = async () => {
      const res = await getCar(carId);
      if (!res) redirect('/');
      if (res.userId !== user.uid) redirect('/');
      else {
        setCarInfo({
          id: res.id,
          make: res.make,
          model: res.model,
          modelYear: res.modelYear,
        });
        setLoading(false);
      }
    };
    if (!user && !userLoading) redirect('/');
    if (!userLoading && !carId) setLoading(false);
    if (carId && !userLoading) fetchCarData();
  }, [userLoading]);

  const onSave = async (value: Article) => {

    await createCarArticle(
      value.articleContent,
      value.title,
      user.uid,
      carInfo ? carInfo.id : null
    );
  };
  return (
    <div>
      <LoadingOverlay isLoading={userLoading || loading} />
      {!userLoading &&
        <div>
          <EditArticle
            data={initialData}
            onSave={onSave}
            carInfo={carInfo}
            articleId="newArticle"
          />
        </div>
      }
    </div>
  )
};

export default NewArticlePage;
