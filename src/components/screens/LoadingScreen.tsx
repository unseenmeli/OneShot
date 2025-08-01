// src/components/screens/LoadingScreen.tsx
import React, { useEffect } from "react";
import { View, Text, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../context/UserContext";

interface LoadingScreenProps {
  fadeAnim: Animated.Value;
  translateY: Animated.Value;
  setPage: (page: string) => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  fadeAnim,
  translateY,
  setPage,
}) => {
  const { setCurrentUser, setLogin } = useUser();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const user = await AsyncStorage.getItem("oneshot_user");
      if (user) {
        const userData = JSON.parse(user);
        setCurrentUser(userData);
        setLogin(true);
        setTimeout(() => {
          setPage("home");
        }, 2000);
      } else {
        setLogin(false);
        setTimeout(() => {
          setPage("auth");
        }, 2000);
      }
    } catch (error) {
      console.error("Error loading user:", error);
      setTimeout(() => {
        setPage("auth");
      }, 2000);
    }
  };

  return (
    <View className="flex-1 justify-center items-center">
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: translateY }],
        }}
      >
        <Text className="bg-white shadow-xl py-2 px-4 font-serif font-bold text-4xl rounded-xl">
          Welcome to OneShot
        </Text>
      </Animated.View>
    </View>
  );
};

export default LoadingScreen;
