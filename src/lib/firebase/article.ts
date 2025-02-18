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

import { storage, db } from "./clientApp";
import { toastError, toastSuccess } from "../../components/utils";

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
    const storageRef = ref(storage, `articles/${articleId}`);
    await uploadString(storageRef, articleContent);

    const articleUrl = await getDownloadURL(storageRef);

    await setDoc(doc(db, "articles", articleId), {
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

export const getCarArticle = async (articleId: string, cb: Function) => {
  try {
    const articleDocRef = doc(db, "articles", articleId);
    const docSnap = await getDoc(articleDocRef);

    if (docSnap.exists()) {
      console.log(docSnap.data())
      const data = docSnap.data();
      const xhr = new XMLHttpRequest();
      xhr.responseType = "blob";
      xhr.onload = async (event) => {
        const blob = xhr.response;
        const text = await blob.text();
        cb({
          content: text,
          ...data,
        });
      };
      xhr.open("GET", data.articleUrl);
      xhr.send();
    } else {
      console.error("article not found in db");
      toastError("Failed to get article");
      return false;
    }

  } catch (error) {
    console.error(error);
    toastError("Failed to get article");
    return false;
  }
};

export const getArticlesByCarId = async (carId: string) => {
  try {
    const articleQuery = query(
      collection(db, "articles"),
      where("carId", "==", carId)
    );
    const articleDocs = await getDocs(articleQuery);
    const articles: Article[] = [];
    articleDocs.forEach((doc) => {
      const { summary, created, updated, title } = doc.data();
      articles.push({ id: doc.id, summary, created, updated, title });
    });
    return articles;
  } catch (e) {
    toastError("Failed to get articles");
    console.error(e);
  }
};

export const getArticlesByUserId = async (userId: string) => {
  try {
    const articleQuery = query(
      collection(db, "articles"),
      where("userId", "==", userId)
    );
    const articleDocs = await getDocs(articleQuery);
    const articles: Article[] = [];
    articleDocs.forEach((doc) => {
      const { summary, created, updated, title } = doc.data();
      articles.push({ id: doc.id, summary, created, updated, title });
    });
    return articles;
  } catch (error) {
    toastError("Failed to get articles");
    console.error(error);
  }
};

export const editCarArticle = async (articleId: string, editedTitle: string, editedArticle: string) => {
  try {
    const summary = getArticleSummary(editedArticle);

    const storageRef = ref(storage, `articles/${articleId}`);
    await uploadString(storageRef, editedArticle);
    const articleUrl = await getDownloadURL(storageRef);

    const articleRef = doc(db, "articles", articleId);
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
