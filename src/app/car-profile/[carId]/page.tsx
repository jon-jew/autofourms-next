'use server';
import { notFound } from "next/navigation";

import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import { getArticlesByCarId } from '@/lib/firebase/article/articleServer';
import { Article } from "@/lib/interfaces";
import { getCar } from '@/lib/firebase/car/carServer';

import CarProfile from '@/components/carProfile';

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
  if (!carId) notFound();
  const data = await getCar(carId, currentUserId);
  if (!data) notFound();
  const articles: Article[] = await getArticlesByCarId(carId);

  const tab = searchParams ? (await searchParams).tab : 'images';

  return (
    <CarProfile
      data={data}
      tab={tab}
      carId={carId}
      currentUserId={currentUserId}
      articles={articles}
    />
  );
}
