import React from 'react';
import { redirect } from 'next/navigation';

import EditArticle from '@/components/editArticle';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';

import { getCar } from '@/lib/firebase/car/carServer';

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
  const initialData = {
    content: '',
    title: '',
    userId: currentUser.uid,
  };
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
    <EditArticle
      data={initialData}
      carInfo={carInfo}
      currentUserId={currentUser.uid}
      articleId="newArticle"
    />
  );
};

export default NewArticlePage;
