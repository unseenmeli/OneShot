// src/components/screens/HomeScreen.tsx
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { tx } from "@instantdb/react-native";
import { db } from "../../app";
import { useUser } from "../context/UserContext";
import AppCard from "../ui/AppCard";
import DeleteModal from "../ui/DeleteModal";
import SettingsModal from "../ui/SettingsModal";
import Header from "../ui/Header";

interface HomeScreenProps {
  setPage: (page: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
  setSelectedApp: (app: any) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  setPage,
  theme,
  setTheme,
  setSelectedApp,
}) => {
  const [apps, setApps] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [appToDelete, setAppToDelete] = useState(null);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

  const { currentUser, login } = useUser();

  const { data, isLoading } = db.useQuery(
    currentUser && currentUser.id
      ? {
          apps: {
            $: {
              where: {
                userId: currentUser.id,
              },
            },
          },
        }
      : {}
  );

  useEffect(() => {
    if (data?.apps) {
      setApps(data.apps);
    }
  }, [data]);

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem("oneshot_user");
      setPage("auth");
    } catch (error) {
      Alert.alert("Error", "Failed to sign out");
    }
  };

  const deleteApp = async (appId: string) => {
    if (!currentUser) return;

    try {
      await db.transact([tx.apps[appId].delete()]);
      setDeleteModalVisible(false);
      setAppToDelete(null);
    } catch (error) {
      console.error("Error deleting app:", error);
      Alert.alert("Error", "Failed to delete app");
    }
  };

  const showDeleteConfirmation = (app: any) => {
    setAppToDelete(app);
    setDeleteModalVisible(true);
  };

  const saveTheme = async (newTheme: string) => {
    try {
      await AsyncStorage.setItem("oneshot_theme", newTheme);
      setTheme(newTheme);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  if (!login) return null;

  return (
    <View className="flex flex-1 px-8 py-24">
      <Header
        onMenuPress={() => setSettingsModalVisible(true)}
        onSignOut={handleSignOut}
        theme={theme}
      />

      <View className="flex-1 flex-row gap-5 py-5 flex-wrap">
        {apps.map((app) => (
          <AppCard
            key={app.id}
            app={app}
            theme={theme}
            onPress={() => {
              setSelectedApp(app);
              setPage("appDetail");
            }}
            onLongPress={() => showDeleteConfirmation(app)}
          />
        ))}

        <View className="items-center">
          <TouchableOpacity onPress={() => setPage("apps")}>
            <View className="bg-white shadow-lg w-20 h-20 flex justify-center items-center rounded-xl relative">
              <View className="h-1 bg-stone-950 rounded absolute w-12"></View>
              <View className="h-1 bg-stone-950 rounded absolute w-12 rotate-90"></View>
            </View>
          </TouchableOpacity>
          <Text
            className={`py-1 font-bold font-serif ${
              theme === "dark" ? "text-white" : ""
            }`}
          >
            Add App
          </Text>
        </View>
      </View>

      <View className="py-2 h-20 absolute bottom-0 left-0 right-0 items-center text-center">
        <TouchableOpacity onPress={() => setPage("home")}>
          <Text
            className={`font-bold font-serif text-xl ${
              theme === "dark" ? "text-white" : ""
            }`}
          >
            Apps
          </Text>
        </TouchableOpacity>
      </View>

      <DeleteModal
        visible={deleteModalVisible}
        app={appToDelete}
        onCancel={() => {
          setDeleteModalVisible(false);
          setAppToDelete(null);
        }}
        onDelete={() => appToDelete && deleteApp(appToDelete.id)}
      />

      <SettingsModal
        visible={settingsModalVisible}
        theme={theme}
        onThemeChange={saveTheme}
        onClose={() => setSettingsModalVisible(false)}
      />
    </View>
  );
};

export default HomeScreen;
