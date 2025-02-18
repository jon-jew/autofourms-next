"use client";

import { createContext, useEffect, useState  } from 'react';

import { onAuthStateChanged } from '@/lib/firebase/auth';

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

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
