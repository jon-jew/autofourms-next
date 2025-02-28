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
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { ref, uploadString, deleteObject, getDownloadURL } from "firebase/storage";

import { storage, db } from "./clientApp";
import { toastError, toastSuccess } from "../../components/utils";
import { getUsername, uploadImages } from "./utils";

export const getCarImages = async (carId: string) => {
  interface ImageEntry {
    id: string;
    caption?: string;
    carId: string;
    created: number;
    image: string;
    userId: string;
  };

  const imageList: ImageEntry[] = [];
  try {
    const imageQuery = query(
      collection(db, "images"),
      where("carId", "==", carId),
      orderBy("created", "desc"),
    );
    const images = await getDocs(imageQuery);

    images.forEach((doc) => {
      const { caption, carId, created, image, userId } = doc.data();
      imageList.push({
        id: doc.id,
        caption,
        carId,
        created,
        image,
        userId,
      });
    });

    return imageList;
  } catch (error) {
    console.error(error)
    toastError("Failed to fetch images");
    return false;
  }
}

export const createCarImage = async (
  carId: string,
  userId: string,
  image: string,
  caption?: string,
) => {
  const imageUid = uuidv4();
  let imageUrl = "";

  try {
    const imageRef = ref(storage, `/${carId}/images/${imageUid}`);
    const uploadRes = await uploadString(imageRef, image, "data_url");
    if (!uploadRes) return false;
    imageUrl = await getDownloadURL(imageRef);
    if (!imageUrl) return false;

    const imageData = {
      created: Date.now(),
      userId: userId,
      carId: carId,
      image: imageUrl,
      caption: caption,
    };

    const imageEntry = await addDoc(collection(db, "images"), imageData);
    if (!imageEntry) return false;

    toastSuccess("Uploaded new image");
    return true;
  } catch (error) {
    console.error(error);
    toastError("Failed to upload new image");
    return false;
  }
};

export const editCarCaption = async (imageId: string, editedCaption: string) => {
  try {
    const imageDocRef = doc(db, "images", imageId);
    const docSnap = await getDoc(imageDocRef)

    if (docSnap.exists()) {
      await updateDoc(imageDocRef, { caption: editedCaption });
      toastSuccess("Updated caption successfully");
      return true;
    } else {
      console.error("Image not found");
      toastError("Failed to update caption")
      return false;
    }
  } catch (error) {
    console.error(error);
    toastError("Failed to update caption")
    return false;
  }
}

export const deleteCarImage = async (imageId: string, userId: string) => {
  try {
    const imageDocRef = doc(db, "images", imageId);
    const docSnap = await getDoc(imageDocRef);

    if (docSnap.exists()) {
      const { image, userId: imageUserId } = docSnap.data();
      if (userId !== imageUserId) {
        toastError("Failed to delete image");
        return false;
      }
      const imageLoc = image.split("?")[0].split("/")[7].replaceAll("%2F", "/");

      const imageStorageRef = ref(storage, imageLoc);
      await deleteObject(imageStorageRef);
      await deleteDoc(imageDocRef);
      toastSuccess("Deleted image");
      return true;
    } else {
      toastError("Failed to delete image");
      return false;
    }
  } catch (error) {
    console.error(error);
    toastError("Failed to delete image");
    return false;
  }
};
