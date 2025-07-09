'use client';

import { v4 as uuidv4 } from "uuid";
import _ from "lodash";

import {
  collection,
  doc,
  arrayUnion,
  serverTimestamp,
  addDoc,
  getDoc,
  getFirestore,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  getDocsFromCache,
  deleteDoc,
  setDoc,
  Timestamp,
  increment,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { ref, uploadString, deleteObject, getDownloadURL } from "firebase/storage";

import { db, storage } from '../clientApp';
import { toastError, toastSuccess } from "../../../components/utils";

import { BasicCar, Car } from "../../interfaces";

interface Image {
  name: string;
  value: string;
};

const uploadImages = async (images: Image[], carId: string) => {
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

export const createCar = async (changes: { [key: string]: any }, dirtyImages: Image[], userId: string) => {
  const uid = uuidv4();
  try {
    const imageUrls = await uploadImages(dirtyImages, uid);

    await setDoc(doc(db, "cars", uid), {
      ...changes,
      ...imageUrls,
      created: Date.now(),
      updated: Date.now(),
      userId,
    });

    toastSuccess("Created new car profile");
    return uid;
  } catch (e) {
    toastError("Failed to create new car profile");
    console.error(e);

    for (const image of dirtyImages) {
      const loc = image.name.replace(".", "/");
      const imageRef = ref(storage, `${uid}/${loc}`);
      if (image.value) deleteObject(imageRef);
    }

    return false;
  }
};

export const editCar = async (carId: string, changes: { [key: string]: any }, dirtyImages: Image[]) => {
  try {
    console.log(carId, changes)
    const carRef = doc(db, "cars", carId);
    const imageUrls = await uploadImages(dirtyImages, carId);

    await updateDoc(carRef, {
      ...imageUrls,
      ...changes,
      updated: Date.now(),
    });

    // toastSuccess("Updated car profile");
    return carId;
  } catch (error) {
    // toastError("Failed to update car profile");
    console.error(error);
    return false;
  }
};

export const handleLike = async (carId: string, userId: string) => {
  try {
    const carRef = doc(db, "cars", carId);
    const likesRef = collection(db, "carLikes", carId, "likes");
    const userLikeRef = doc(likesRef, userId);
    const likeSnap = await getDoc(userLikeRef);

    if (likeSnap.exists()) {
      await deleteDoc(userLikeRef);
      await updateDoc(carRef, {
        userLikes: increment(-1),
      });
    } else {
      await setDoc(userLikeRef, {
        createdOn: Timestamp.fromDate(new Date(Date.now())),
      });
      await updateDoc(carRef, {
        userLikes: increment(1),
      });
    }
 
  } catch (error) {
    console.error(error);
    return false;
  }
}