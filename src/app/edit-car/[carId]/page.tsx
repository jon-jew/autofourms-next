'use server';

import { redirect } from 'next/navigation';

import EditPanel from '@/components/editPanel';

import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { getCar } from '@/lib/firebase/car/carServer';

export default async function EditPage({
  params,
}: {
  params: Promise<{ carId: string }>
}) {

  const { currentUser } = await getAuthenticatedAppForUser();
  if (!currentUser) redirect('/');
  const carId = (await params).carId;
  if (!carId) redirect('/');
  const carData = await getCar(carId);
  if (!carData) redirect('/');
  if (carData.userId !== currentUser.uid) redirect('/');

  return <EditPanel data={carData} carId={carId} currentUserId={currentUser.uid} />;
};
