import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Animated,
} from "react-native";

const panther = require("../images/panther.png");

const App1 = () => {
  const [page, setPage] = useState("load");
  const [apps, setApps] = useState([]);
  const [appName, setAppName] = useState("");
  const [appDescription, setAppDescription] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 3000,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      setPage("home");
    }, 4000);
  }, []);

  const addApp = () => {
    const newApp = { name: appName, description: appDescription };
    setApps([...apps, newApp]);
    setAppName("");
    setAppDescription("");
    setPage("home");
  };

  return (
    <View className="flex-1">
      <Image
        className="absolute opacity-50 -mx-96 p-8 -my-24 rotate-90"
        source={panther}
      />

      {page === "load" && (
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
      )}

      {page === "home" && (
        <View key="home" className="flex flex-1 px-8 py-24">
          <View className="flex flex-row">
            <View className="flex-1 justify-center">
              <Text className="items-center font-bold text-center text-xl font-serif">
                OneShot
              </Text>
            </View>
          </View>

          <View className="flex-1 flex-row gap-5 py-5 flex-wrap">
            {apps.length > 0
              ? apps.map((app, index) => (
                  <View key={index} className="items-center">
                    <View className="bg-white shadow-lg w-20 h-20 flex justify-center items-center rounded-xl relative"></View>
                    <Text className="py-1 font-bold font-serif">
                      {app.name}
                    </Text>
                  </View>
                ))
              : null}

            <View className="items-center">
              <TouchableOpacity
                onPress={() => {
                  setPage("apps");
                }}
              >
                <View className="bg-white shadow-lg w-20 h-20 flex justify-center items-center rounded-xl relative">
                  <View className="h-1 bg-stone-950 rounded absolute w-12 z-10"></View>
                  <View className="h-1 bg-stone-950 rounded absolute w-12 z-10 rotate-90"></View>
                </View>
              </TouchableOpacity>
              <Text className="py-1 font-bold font-serif">Add App</Text>
            </View>
          </View>

          <View className="py-2 h-20 absolute bottom-0 left-0 right-0 items-center text-center">
            <TouchableOpacity onPress={() => setPage("home")}>
              <Text className="font-serif text-xl">Apps</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {page === "apps" && (
        <View key="apps" className="flex flex-1 px-8 py-24">
          <View className="flex flex-row">
            <View className="flex-1 justify-center">
              <Text className="items-center font-bold text-center text-xl font-serif">
                OneShot
              </Text>
            </View>
          </View>

          <View className="py-20">
            <Text className="text-xl font-bold font-serif p-2">App Name</Text>
            <View className="bg-white shadow-lg h-12 w-96 rounded-2xl">
              <TextInput
                className="p-4 font-bold"
                placeholder="Write the name here..."
                value={appName}
                onChangeText={setAppName}
              />
            </View>

            <Text className="text-xl font-bold font-serif p-2">
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
              >
                <Text className="font-bold font-serif text-xl text-center">
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="py-2 h-20 absolute bottom-0 left-0 right-0 items-center text-center">
            <TouchableOpacity onPress={() => setPage("home")}>
              <Text className="font-serif text-xl">Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {page !== "home" && page !== "apps" && (
        <View>
          <Text>.</Text>
        </View>
      )}
    </View>
  );
};

const App = () => {
  return <App1 />;
};

export default App;
