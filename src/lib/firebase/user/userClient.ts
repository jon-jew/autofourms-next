'use client';

import {
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { updateProfile } from 'firebase/auth';

import { db, storage, auth } from '../clientApp';

export const editUserProfile = async ({ userUid, username, profileImage }:
  { userUid: string, username: string, profileImage?: string }
) => {
  try {
    if (auth.currentUser !== null) {
      let imageUrl = '';
      if (profileImage && profileImage !== '') {
        const imageRef = ref(storage, `userProfileImages/${userUid}`);
        await uploadString(imageRef, profileImage, 'data_url');
        imageUrl = await getDownloadURL(imageRef);
      }

      const userRef = doc(db, "users", userUid);
      await updateProfile(auth.currentUser, {
        displayName: username, photoURL: imageUrl,
      });
      await updateDoc(userRef, {
        username: username,
        profileImage: imageUrl,
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
