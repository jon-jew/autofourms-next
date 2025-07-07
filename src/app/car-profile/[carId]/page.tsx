'use server';

import CarProfile from '@/components/carPage/carProfile';
import { getCar } from '@/lib/firebase/carServer';
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";

import './carPage.scss'

export default async function CarPage({
  params,
  searchParams,
}: {
  params: Promise<{ carId: string }>,
  searchParams?: Promise<{ tab?: string }>;
}) {
  const { currentUser } = await getAuthenticatedAppForUser();
  const currentUserId = currentUser?.uid;

  const carId = (await params).carId;
  if (!carId) return null;
  const data = await getCar(carId, currentUserId);
  if (!data) return null;

  const tab = searchParams ? (await searchParams).tab : 'images';

  return (
    <CarProfile
      data={data}
      tab={tab}
      carId={carId}
      currentUserId={currentUserId}
    />
  );
}
