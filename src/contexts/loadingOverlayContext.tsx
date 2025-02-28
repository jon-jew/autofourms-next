"use client";

import React, { createContext, useState, useEffect } from "react";

import LoadingOverlay from "@/components/loadingOverlay";

export const LoadingContext = createContext({
  isLoading: true,
  setIsLoading: (value: boolean) => { },
});

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <LoadingContext.Provider value={{
      isLoading,
      setIsLoading: (value: boolean) => setIsLoading(value),
    }}>
      <LoadingOverlay isLoading={isLoading} />
      {children}
    </LoadingContext.Provider>
  );
};
