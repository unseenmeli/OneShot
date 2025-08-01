// src/components/context/AppContext.tsx
import React, { createContext, useContext, useState } from "react";
import { App } from "../types/index";

interface AppContextType {
  apps: App[];
  setApps: (apps: App[]) => void;
  selectedApp: App | null;
  setSelectedApp: (app: App | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [apps, setApps] = useState<App[]>([]);
  const [selectedApp, setSelectedApp] = useState<App | null>(null);

  return (
    <AppContext.Provider
      value={{
        apps,
        setApps,
        selectedApp,
        setSelectedApp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApps = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApps must be used within an AppProvider");
  }
  return context;
};
