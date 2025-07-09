"use server";
import { notFound } from "next/navigation";

import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import { getCarsByUserId } from '@/lib/firebase/car/carServer';
import { getUserById } from "@/lib/firebase/user/userServer";

import UserProfile from '@/components/userProfile';

const UserProfilePage = async ({
  params,
}: {
  params: Promise<{ userId: string }>
}) => {
  const { currentUser } = await getAuthenticatedAppForUser();
  const currentUserId = currentUser?.uid;

  const userId = (await params).userId;
  console.log(userId)
  if (!userId) notFound();
  const userInfo = await getUserById(userId);
  console.log(userInfo)
  if (!userInfo) notFound();
  const carList = await getCarsByUserId(userId);

  return (
    <UserProfile carList={carList} username={userInfo.username} userId={userId} />
  )
};

export default UserProfilePage;