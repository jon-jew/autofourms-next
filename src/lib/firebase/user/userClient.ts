'use client';

import {
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { updateProfile } from 'firebase/auth';

import { db, storage, auth } from '../clientApp';

interface FormFields {
  photoURL?: string;
  profileImage?: string;
  username?: string;
};

export const editUserProfile = async ({ userUid, changes }:
  { userUid: string, changes: FormFields }
) => {
  console.log(changes)
  try {
    if (auth.currentUser !== null) {
      const profileChanges: FormFields = {};
      if (changes.username) profileChanges.username = changes.username;

      if (changes.profileImage && changes.profileImage !== '') {
        const imageRef = ref(storage, `userProfileImages/${userUid}`);
        await uploadString(imageRef, changes.profileImage, 'data_url');
        profileChanges.photoURL = await getDownloadURL(imageRef);
      }

      await updateProfile(auth.currentUser, profileChanges);
      
      const userRef = doc(db, "users", userUid);
      await updateDoc(userRef, {
        ...profileChanges,
        updated: Date.now(),
      })

      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};
