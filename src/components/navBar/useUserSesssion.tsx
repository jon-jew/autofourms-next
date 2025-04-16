'use client';

import { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, onIdTokenChanged } from '@/lib/firebase/auth';
import { firebaseConfig } from '@/lib/firebase/config';

interface CookieValues {
  name?: string;
}

export default function useUserSession(initialUser: any) {
  // The initialUser comes from the server via a server component
  // const [user, setUser] = useState(initialUser);
  // const router = useRouter();

  // // Register the service worker that sends auth state back to server
  // // The service worker is built with npm run build-service-worker
  // // useEffect(() => {
  // //   if ('serviceWorker' in navigator) {
  // //     const serializedFirebaseConfig = encodeURIComponent(JSON.stringify(firebaseConfig));
  // //     const serviceWorkerUrl = `/auth-service-worker.js?firebaseConfig=${serializedFirebaseConfig}`

  // //     navigator.serviceWorker
  // //       .register(serviceWorkerUrl)
  // //       .then((registration) => console.log("scope is: ", registration.scope));
  // //   }
  // // }, []);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged((authUser) => {
  //     setUser(authUser)
  //   })

  //   return () => unsubscribe()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // useEffect(() => {
  //   onAuthStateChanged((authUser) => {
  //     if (user === undefined) return

  //     // refresh when user changed to ease testing
  //     if (user?.email !== authUser?.email) {
  //       router.refresh()
  //     }
  //   })
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [user])

  // return user;
  const cookies = new Cookies(null, { path: '/' });

  useEffect(() => {
    return onIdTokenChanged(async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        await cookies.set("__session", idToken);
      } else {
        await cookies.remove("__session");
      }
      if (initialUser?.uid === user?.uid) {
        return;
      }
      window.location.reload();
    });
  }, [initialUser]);

  return initialUser;
}
