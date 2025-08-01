// src/components/screens/AddAppScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { tx, id } from "@instantdb/react-native";
import { db } from "../../app";
import { useUser } from "../context/UserContext";
import ImagePicker from "../ui/ImagePicker";

interface AddAppScreenProps {
  setPage: (page: string) => void;
  theme: string;
}

const AddAppScreen: React.FC<AddAppScreenProps> = ({ setPage, theme }) => {
  const [appName, setAppName] = useState("");
  const [appDescription, setAppDescription] = useState("");
  const [appImage, setAppImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useUser();

  const addApp = async () => {
    if (!appName.trim()) {
      Alert.alert("Error", "Please enter an app name");
      return;
    }

    if (!currentUser) {
      Alert.alert("Error", "You must be logged in to add apps");
      return;
    }

    setLoading(true);
    try {
      const appId = id();
      const newApp = {
        id: appId,
        name: appName.trim(),
        description: appDescription.trim(),
        image: appImage ? appImage.base64 : null,
        userId: currentUser.id,
        createdAt: Date.now(),
      };

      await db.transact([tx.apps[appId].update(newApp)]);

      setAppName("");
      setAppDescription("");
      setAppImage(null);
      setPage("home");
    } catch (error) {
      console.error("Error adding app:", error);
      Alert.alert("Error", "Failed to add app. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      className={`flex flex-1 ${theme === "dark" ? "bg-stone-950" : ""}`}
    >
      <View className="px-8 py-24">
        <View className="flex flex-row">
          <View className="flex-1 justify-center">
            <Text
              className={`items-center font-bold text-center text-xl font-serif ${
                theme === "dark" ? "text-white" : ""
              }`}
            >
              OneShot
            </Text>
          </View>
        </View>

        <View className="py-20">
          <Text
            className={`text-xl font-bold font-serif p-2 ${
              theme === "dark" ? "text-white" : ""
            }`}
          >
            App Logo
          </Text>

          <ImagePicker image={appImage} onImageSelected={setAppImage} />

          <Text
            className={`text-xl font-bold font-serif p-2 ${
              theme === "dark" ? "text-white" : ""
            }`}
          >
            App Name
          </Text>
          <View className="bg-white shadow-lg h-12 w-96 rounded-2xl">
            <TextInput
              className="p-4 font-bold"
              placeholder="Write the name here..."
              value={appName}
              onChangeText={setAppName}
            />
          </View>

          <Text
            className={`text-xl font-bold font-serif p-2 ${
              theme === "dark" ? "text-white" : ""
            }`}
          >
            App Description
          </Text>
          <View className="bg-white shadow-lg h-40 w-96 rounded-2xl">
            <TextInput
              className="p-4 font-bold"
              placeholder="Describe your app here..."
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              value={appDescription}
              onChangeText={setAppDescription}
            />
          </View>

          <View className="flex items-center">
            <TouchableOpacity
              className="my-10 justify-center shadow-lg w-48 h-16 bg-white rounded-2xl"
              onPress={addApp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator />
              ) : (
                <Text className="font-bold font-serif text-xl text-center">
                  Submit
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View className="py-2 h-20 absolute bottom-0 left-0 right-0 items-center text-center">
          <TouchableOpacity
            onPress={() => {
              setPage("home");
              setAppImage(null);
              setAppName("");
              setAppDescription("");
            }}
          >
            <Text
              className={`font-serif text-xl ${
                theme === "dark" ? "text-white" : ""
              }`}
            >
              Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default AddAppScreen;
