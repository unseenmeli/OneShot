// src/components/screens/AppDetailScreen.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { tx } from "@instantdb/react-native";
import { db } from "../../app";
import { useUser } from "../context/UserContext";
import DeleteModal from "../ui/DeleteModal";

interface AppDetailScreenProps {
  setPage: (page: string) => void;
  selectedApp: any;
}

const AppDetailScreen: React.FC<AppDetailScreenProps> = ({
  setPage,
  selectedApp,
}) => {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const { currentUser } = useUser();

  const deleteApp = async (appId: string) => {
    if (!currentUser) return;

    try {
      await db.transact([tx.apps[appId].delete()]);
      setDeleteModalVisible(false);
      setPage("home");
    } catch (error) {
      console.error("Error deleting app:", error);
      Alert.alert("Error", "Failed to delete app");
    }
  };

  if (!selectedApp) return null;

  return (
    <View className="flex flex-1 px-8 py-24">
      <View className="flex flex-row">
        <View className="flex-1 justify-center">
          <Text className="items-center font-bold text-center text-xl font-serif">
            OneShot
          </Text>
        </View>
      </View>

      <View className="flex-1 py-10">
        <View className="bg-white shadow-lg p-6 rounded-2xl mb-6">
          <View className="flex items-center mb-6">
            <View className="bg-gray-100 w-24 h-24 flex justify-center items-center rounded-2xl overflow-hidden">
              {selectedApp.image ? (
                <Image
                  source={{
                    uri: `data:image/jpeg;base64,${selectedApp.image}`,
                  }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <Text className="text-4xl font-bold">
                  {selectedApp.name.charAt(0).toUpperCase()}
                </Text>
              )}
            </View>
          </View>

          <Text className="text-2xl font-bold font-serif text-center mb-6">
            {selectedApp.name}
          </Text>

          {selectedApp.description ? (
            <View>
              <Text className="text-lg font-semibold font-serif mb-2">
                Description
              </Text>
              <Text className="text-base leading-6 text-gray-700">
                {selectedApp.description}
              </Text>
            </View>
          ) : (
            <Text className="text-base text-gray-500 italic text-center">
              No description provided
            </Text>
          )}
        </View>

        <TouchableOpacity
          className="bg-red-500 py-3 px-6 rounded-xl mx-4"
          onPress={() => setDeleteModalVisible(true)}
        >
          <Text className="text-center font-bold font-serif text-white">
            Delete App
          </Text>
        </TouchableOpacity>
      </View>

      <View className="py-2 h-20 absolute bottom-0 left-0 right-0 items-center text-center">
        <TouchableOpacity onPress={() => setPage("home")}>
          <Text className="font-serif text-xl">Back</Text>
        </TouchableOpacity>
      </View>

      <DeleteModal
        visible={deleteModalVisible}
        app={selectedApp}
        onCancel={() => setDeleteModalVisible(false)}
        onDelete={() => deleteApp(selectedApp.id)}
      />
    </View>
  );
};

export default AppDetailScreen;
