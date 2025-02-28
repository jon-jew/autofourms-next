import { headers } from "next/headers";
import { initializeServerApp, getApps } from "firebase/app";
import { firebaseConfig } from "./config";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
export const firebaseApp =
  getApps().length === 0 ? initializeServerApp(firebaseConfig, {}) : getApps()[0];
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

export async function getAuthenticatedAppForUser() {
  const header = await headers();
  const idToken = header.get("Authorization")?.split("Bearer ")[1];

  const firebaseServerApp = initializeServerApp(
    firebaseConfig,
    idToken
      ? {
          authIdToken: idToken,
        }
      : {}
  );

  const auth = getAuth(firebaseServerApp);
  await auth.authStateReady();

  return { firebaseServerApp, currentUser: auth.currentUser };
}
