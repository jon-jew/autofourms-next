"use server";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db as serverDb } from "../serverApp";

export interface Article {
  id: string,
  created: number,
  updated: string,
  title: string,
  summary: string,
};

export const getCarArticle = async (articleId: string) => {
  try {
    const articleDocRef = doc(serverDb, "articles", articleId);
    const docSnap = await getDoc(articleDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const res = await fetch(data.articleUrl);
      const text = await res.text();
      return {
        ...data,
        content: text,
        title: data.title,
      };
    } else {
      console.error("article not found in db");
      return false;
    }

  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getArticlesByCarId = async (carId: string) => {
  try {
    const articleQuery = query(
      collection(serverDb, "articles"),
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
    console.error(e);
    return [];
  }
};

export const getArticlesByUserId = async (userId: string) => {
  try {
    const articleQuery = query(
      collection(serverDb, "articles"),
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
    console.error(error);
    return [];
  }
};
