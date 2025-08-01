// src/app/index.tsx
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import React, { useState, useEffect, useRef } from "react";
import { View, Image, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { init } from "@instantdb/react-native";

// Import screens
import LoadingScreen from "../components/screens/LoadingScreen";
import AuthScreen from "../components/screens/AuthScreen";
import HomeScreen from "../components/screens/HomeScreen";
import AddAppScreen from "../components/screens/AddAppScreen";
import AppDetailScreen from "../components/screens/AppDetailScreen";

// Import context
import { ThemeProvider } from "../components/context/ThemeContext";
import { UserProvider } from "../components/context/UserContext";
import { AppProvider } from "../components/context/AppContext";

export const db = init({
  appId: "ffb32298-8f58-4782-8b1f-c7677ebad2b6",
});

const panther = require("../images/panther.png");
const pantherDark = require("../images/panther1.jpg");

const App = () => {
  const [page, setPage] = useState("load");
  const [selectedApp, setSelectedApp] = useState(null);
  const [theme, setTheme] = useState("light");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    loadTheme();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("oneshot_theme");
      if (savedTheme) {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    }
  };

  const renderScreen = () => {
    switch (page) {
      case "load":
        return (
          <LoadingScreen
            fadeAnim={fadeAnim}
            translateY={translateY}
            setPage={setPage}
          />
        );
      case "auth":
        return <AuthScreen setPage={setPage} />;
      case "home":
        return (
          <HomeScreen
            setPage={setPage}
            theme={theme}
            setTheme={setTheme}
            setSelectedApp={setSelectedApp}
          />
        );
      case "apps":
        return <AddAppScreen setPage={setPage} theme={theme} />;
      case "appDetail":
        return <AppDetailScreen setPage={setPage} selectedApp={selectedApp} />;
      default:
        return null;
    }
  };

  return (
    <ThemeProvider value={{ theme, setTheme }}>
      <UserProvider>
        <AppProvider>
          <View className={`flex-1 ${theme === "dark" ? "bg-stone-950" : ""}`}>
            <Image
              className={`absolute -mx-96 p-8 -my-24 rotate-90 ${
                theme === "dark" ? "opacity-20" : "opacity-30"
              }`}
              source={theme === "dark" ? pantherDark : panther}
            />
            {renderScreen()}
          </View>
        </AppProvider>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
