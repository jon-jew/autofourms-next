import React from 'react';
import { redirect } from 'next/navigation';

import EditArticle from '@/components/editArticle/editArticle';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';

import { getCar } from '@/lib/firebase/car/carServer';

interface Article {
  content: string,
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
  content: '',
  title: '',
};

const NewArticlePage = async (
  { params, }:
    { params: Promise<{ carId: string }> }
) => {
  const carId = (await params).carId;
  const { currentUser } = await getAuthenticatedAppForUser();
  let carInfo = {
    id: '',
    make: '',
    model: '',
    modelYear: '',
  };

  if (!currentUser) redirect('/');
  if (currentUser && carId) {
    const res = await getCar(carId);
    if (!res) redirect('/');
    if (res.userId !== currentUser.uid) redirect('/');
    else {
      carInfo = {
        id: res.id,
        make: res.make,
        model: res.model,
        modelYear: res.modelYear,
      };
    }
  }

  return (
    <div>
      <EditArticle
        data={initialData}
        carInfo={carInfo}
        currentUserId={currentUser.uid}
        articleId="newArticle"
      />
    </div>
  );
};

export default NewArticlePage;
