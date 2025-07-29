'use server';
import { redirect } from "next/navigation";

import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import { getUserById } from "@/lib/firebase/user/userServer";

import EditUser from "@/components/editUser";

export default async function EditUserPage() {
  const { currentUser } = await getAuthenticatedAppForUser();
  if (!currentUser || !currentUser?.uid) redirect('/');

  const userData = await getUserById(currentUser.uid);
  if (!userData) redirect('/');

  return (
    <EditUser
      currentUserId={currentUser?.uid}
      username={userData.username}
      profileImage={userData.photoURL}
    />
  );
};

