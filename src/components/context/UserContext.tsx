// src/components/context/UserContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: string;
  email: string;
}

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  login: boolean;
  setLogin: (login: boolean) => void;
  savedEmails: string[];
  saveEmailToHistory: (email: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [login, setLogin] = useState(false);
  const [savedEmails, setSavedEmails] = useState<string[]>([]);

  useEffect(() => {
    loadSavedEmails();
  }, []);

  const loadSavedEmails = async () => {
    try {
      const emails = await AsyncStorage.getItem("oneshot_saved_emails");
      if (emails) {
        setSavedEmails(JSON.parse(emails));
      }
    } catch (error) {
      console.error("Error loading saved emails:", error);
    }
  };

  const saveEmailToHistory = async (emailToSave: string) => {
    try {
      const emails = await AsyncStorage.getItem("oneshot_saved_emails");
      let emailList = emails ? JSON.parse(emails) : [];

      if (!emailList.includes(emailToSave.toLowerCase())) {
        emailList.unshift(emailToSave.toLowerCase());
        emailList = emailList.slice(0, 5);

        await AsyncStorage.setItem(
          "oneshot_saved_emails",
          JSON.stringify(emailList)
        );
        setSavedEmails(emailList);
      }
    } catch (error) {
      console.error("Error saving email to history:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        login,
        setLogin,
        savedEmails,
        saveEmailToHistory,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
