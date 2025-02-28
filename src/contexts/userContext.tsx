"use client";

import { createContext, useEffect, useState  } from 'react';

import { onAuthStateChanged } from '@/lib/firebase/auth';

export const UserContext = createContext({ user: null, userLoading: false });

export const UserContextProvider = ({ children }: { children: React.JSX.Element}) => {
  const [user, setUser] = useState<any>(null);
  const [userLoading, setUserLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setUserLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{user, userLoading}}>
      {children}
    </UserContext.Provider>
  );
};
