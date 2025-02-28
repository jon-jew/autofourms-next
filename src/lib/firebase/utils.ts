'use server';

import { doc, getDoc } from "firebase/firestore";
import { ref, uploadString, deleteObject, getDownloadURL } from "firebase/storage";

import { storage, db } from "./serverApp";

interface Image {
  name: string;
  value: string;
};

export const uploadImages = async (images: Image[], carId: string) => {
  const imageUrls: { [key: string]: string | null } = {};
  for (const image of images) {
    const loc = image.name.replace(".", "/");
    const imageRef = ref(storage, `${carId}/${loc}`);
    if (image.value) {
      try {
        await uploadString(imageRef, image.value, "data_url");
        const imageUrl = await getDownloadURL(imageRef);
        // _.set(data, image.name, imageUrl);
        imageUrls[image.name] = imageUrl;
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        await deleteObject(imageRef);
        // _.set(data, image.name, null);
        imageUrls[image.name] = null;
      } catch (error: any) {
        if (error.code !== "storage/object-not-found")
          console.error(error);
      }
    }
  }
  return imageUrls;
};

export const getUsername = async (userId: string) => {
  try {
    if (!userId) return null;
    const userRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userRef);
    if (userDocSnap.exists()) {
      const { username } = userDocSnap.data();
      return username;
    } else {
      console.error('User not found');
      return null;
    }
  } catch (error) {
    console.error('Failed to get user', error, userId);
    return null;
  }
};