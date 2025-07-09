'use client';
import { v4 as uuidv4 } from "uuid";

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
} from "firebase/firestore";
import { getStorage, ref, uploadString, deleteObject, getDownloadURL } from "firebase/storage";

import { storage as clientStorage, db as clientDb } from "../clientApp";
import { toastError, toastSuccess } from "../../../components/utils";

export interface Article {
  id: string,
  created: number,
  updated: string,
  title: string,
  summary: string,
};

const getArticleSummary = (content: string) => content.replace(/<img[^>]*>/g, "").replace(/<\/?[^>]+(>|$)/g, "").slice(0, 150);

export const createCarArticle = async (
  articleContent: string,
  articleTitle: string,
  userId: string,
  carId: string | null,
) => {
  try {
    const articleId = uuidv4();
    const summary = getArticleSummary(articleContent);
    const storageRef = ref(clientStorage, `articles/${articleId}`);
    await uploadString(storageRef, articleContent);

    const articleUrl = await getDownloadURL(storageRef);

    await setDoc(doc(clientDb, "articles", articleId), {
      created: Date.now(),
      updated: Date.now(),
      articleUrl,
      title: articleTitle,
      carId,
      userId,
      summary,
    });

    toastSuccess("Posted new article");
    return true;
  } catch (error) {
    console.error(error);
    toastError("Failed to create article");
    return false;
  }
};

export const editCarArticle = async (articleId: string, editedTitle: string, editedArticle: string) => {
  try {
    const summary = getArticleSummary(editedArticle);

    const storageRef = ref(clientStorage, `articles/${articleId}`);
    await uploadString(storageRef, editedArticle);
    const articleUrl = await getDownloadURL(storageRef);

    const articleRef = doc(clientDb, "articles", articleId);
    await updateDoc(articleRef, {
      updated: Date.now(),
      articleUrl,
      summary,
      title: editedTitle,
    });

    toastSuccess("Saved changes to article");
    return true;

  } catch (error) {
    console.error(error);
    toastError("Failed to save article");
    return false;
  }
};
