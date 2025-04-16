import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged as _onAuthStateChanged,
  onIdTokenChanged as _onIdTokenChanged,
  NextOrObserver,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { auth, db } from "@/lib/firebase/clientApp";
import { toastSuccess, toastError } from "@/components/utils";

export function onAuthStateChanged(cb: NextOrObserver<any>) {
	return _onAuthStateChanged(auth, cb);
}

export function onIdTokenChanged(cb: NextOrObserver<any>) {
  return _onIdTokenChanged(auth, cb);
}

export async function createUser(email: string, password: string, username: string) {
  try {
    const createUserRes = await createUserWithEmailAndPassword(auth, email, password);
    const userUid = createUserRes.user.uid;
    await setDoc((doc(db, "users", userUid)), {
      username,
      profilePicture: null,
      cars: [],
    });

    toastSuccess('Created new account!');
    return true;

  } catch (error: any) {
    if (error.message.includes("(auth/email-already-in-use)")) {
      toastError("There is already an account associated with this email.")
    } else if (error.message.includes("(auth/weak-password)")) {
      toastError("Please chose a stronger password");
    } else {
      console.error("Failed to create account", error);
    }
    return false;
  }
}

export async function signIn(email: string, password: string) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    toastSuccess('Signed in!');
    return true;
    
  } catch (error: any) {
    if (error.message.includes("(auth/invalid-credential)")) {
      toastError("Invalid login credentials");
    }
    else {
      toastError("Failed to login");
      console.error("Failed to sign in", error);
    }
    return false;
  }
}

export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Failed to log out", error);
  }
}
