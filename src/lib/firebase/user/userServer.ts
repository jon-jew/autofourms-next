'use server';

import _ from "lodash";

import { doc, getDoc } from "firebase/firestore";

import { db, storage } from '../serverApp';

export const getUserById = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);

    return false;
  }
};