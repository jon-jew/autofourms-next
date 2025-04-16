'use server';

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

import { db, storage } from './serverApp';
import { db as clientDb } from './clientApp';
import { toastError, toastSuccess } from "../../components/utils";
import { getUsername, uploadImages } from "./utils";

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

export const getCarById = async (carId: string) => {
  try {
    const carRef = doc(db, "cars", carId);
    const carDoc = await getDoc(carRef);

    if (carDoc.exists()) {
      return carDoc.data();
    } else {
      // toastError("Failed to get car data");
      return false;
    }
  } catch (error) {
    console.error(error);
    // toastError("Failed to get car data");

    return false;
  }
};

export const getCarsByMake = async (make: string) => {
  try {
    const carQuery = query(
      collection(db, "cars"),
      where("make", "==", make)
    );

    const carDocs = await getDocs(carQuery);
    const carList = [];
    carDocs.forEach((doc) => {
      carList.push(doc.data());
    });

    return carList;
  } catch (error) {
    console.error()
  }
}

export const getCarsByMakeModel = async (make: string, model: string) => {
  try {
    const carQuery = query(
      collection(db, "cars"),
      where("make", "==", make),
      where("model", "==", model)
    );

    const carDocs = await getDocs(carQuery);
    const carList = [];
    carDocs.forEach((doc) => {
      carList.push(doc.data());
    });

    return carList;
  } catch (error) {
    console.error(error);
    return false;
  }
}

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
      // toastError("Car info not found");
      return false;
    }
  } catch (error) {
    // toastError("Failed to get car info");
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
    // toastError("Failed to get car data");
    console.error(error);
    return false;
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
    // toastError("Failed to retreive car data");
    return false;
  }
};
