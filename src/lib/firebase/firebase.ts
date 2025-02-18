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
import { getStorage, ref, uploadString, deleteObject, getDownloadURL } from "firebase/storage";

import { storage, db } from "./clientApp";
import { toastError, toastSuccess } from "../../components/utils";

import { BasicCar, Car } from "../interfaces";

interface Image {
  name: string;
  value: string;
};

const getCarProperties = (snapshot:  QueryDocumentSnapshot<DocumentData, DocumentData>) =>{
  const {
    userId,
    created,
    updated,
    modelYear,
    make,
    model,
    submodel,
    description,
    previewImage,
    tags,
    thumbnails,
    wheelTire,
    brakes,
    drivetrain,
    exhaust,
    exterior,
    interior,
    powertrain,
    specification,
    suspension,
  } = snapshot.data();

  return {
    id: snapshot.id,
    created,
    updated,
    userId,
    modelYear,
    make,
    model,
    submodel,
    description,
    previewImage,
    tags,
    thumbnails,
    wheelTire,
    brakes,
    drivetrain,
    exhaust,
    exterior,
    interior,
    powertrain,
    specification,
    suspension,
  };
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

export const getCarById = async (carId: string) => {
  try {
    const carRef = doc(db, "cars", carId);
    const carDoc = await getDoc(carRef);

    if (carDoc.exists()) {
      return carDoc.data();
    } else {
      toastError("Failed to get car data");
      return false;
    }
  } catch (error) {
    console.error(error);
    toastError("Failed to get car data");

    return false;
  }
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
    console.log(dirtyImages);
    const carRef = doc(db, "cars", carId);
    const imageUrls = await uploadImages(dirtyImages, carId);

    await updateDoc(carRef, {
      ...imageUrls,
      ...changes,
      updated: Date.now(),
    });

    toastSuccess("Updated car profile");
    return true;
  } catch (error) {
    toastError("Failed to update car profile");
    console.error(error);
    return false;
  }
};

export const getUsername = async (userId: string) => {
  try {
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

export const getCar = async (carId: string) => {
  try {
    const carRef = doc(db, "cars", carId);
    const docSnap = await getDoc(carRef);
    if (docSnap.exists()) {
      const carData = getCarProperties(docSnap);
      const username = await getUsername(carData.userId);
      return {
        ...carData,
        username,
      };
    } else {
      toastError("Car info not found");
      return false;
    }
  } catch (error) {
    toastError("Failed to get car info");
    console.error(error);
    return false;
  }
};


export const getCars = async () => {
  try {
    const carList: Car[] = [];
    const snapshot = await getDocs(collection(db, "cars"));
    const userDict: { [key: string]: string } = {};
    for (const carSnapshot of snapshot.docs) {
      const carData = getCarProperties(carSnapshot);
      let username = '';
      if (!userDict.hasOwnProperty(carData.userId) && carData.userId) {
        username = await getUsername(carData.userId);
      } else {
        username = userDict[carData.userId];
      }
      carList.push({
        ...carData,
        username,
      });
    }

    return carList;
  } catch (error) {
    toastError("Failed to get car data");
    console.error(error);
    return null;
  }
};

export const getCarsByUserId = async (userId: string) => {
  try {
    const carList: Car[] = [];
    const carQuery = query(
      collection(db, "cars"),
      where("userId", "==", userId)
    );
    const cars = await getDocs(carQuery);

    cars.forEach((doc) => {
      const carData = getCarProperties(doc);
      carList.push(carData);
    });

    return carList;
  } catch (error) {
    console.error("failed to retreive car data", error);
    toastError("Failed to retreive car data");
    return false;
  }
};

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
