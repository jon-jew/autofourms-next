"use server";

import { Suspense } from 'react'
import CarProfile from '@/components/carPage/carProfile';
import { getCar } from '@/lib/firebase/car';

import './carPage.scss'

export default async function CarPage({
  params,
  searchParams,
}: {
  params: Promise<{ carId: string }>,
  searchParams?: Promise<{ tab?: string }>;
}) {
  const carId = (await params).carId;
  if (!carId) return null;
  const data = await getCar(carId);
  if (!data) return null;

  const tab = searchParams ? (await searchParams).tab : 'images';

  return (
    <CarProfile data={data} tab={tab} carId={carId} />
  );
}
