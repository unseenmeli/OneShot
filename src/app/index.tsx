import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
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
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  launchImageLibrary,
  ImageLibraryOptions,
  PhotoQuality,
} from "react-native-image-picker";
import { init, tx, id } from "@instantdb/react-native";

const db = init({
  appId: "ffb32298-8f58-4782-8b1f-c7677ebad2b6",
});

const panther = require("../images/panther.png");
const pantherDark = require("../images/panther1.jpg");

const App1 = () => {
  const [page, setPage] = useState("load");
  const [apps, setApps] = useState([]);
  const [appName, setAppName] = useState("");
  const [appDescription, setAppDescription] = useState("");
  const [appImage, setAppImage] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [appToDelete, setAppToDelete] = useState(null);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [theme, setTheme] = useState("light");

  const [login, setLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [savedEmails, setSavedEmails] = useState([]);
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

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

  useEffect(() => {
    LoadUser();
    loadSavedEmails();
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

  const saveTheme = async (newTheme) => {
    try {
      await AsyncStorage.setItem("oneshot_theme", newTheme);
      setTheme(newTheme);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

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

  const saveEmailToHistory = async (emailToSave) => {
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

  const LoadUser = async () => {
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
      Alert.alert("Error", "Failed to load user data");
      setTimeout(() => {
        setPage("auth");
      }, 2000);
    }
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    return null;
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      Alert.alert("Invalid Password", passwordError);
      return;
    }

    setLoading(true);
    try {
      // First check if email already exists
      const { data: existingUser } = await db.queryOnce({
        users: {
          $: {
            where: {
              email: email.toLowerCase(),
            },
          },
        },
      });

      if (existingUser?.users && existingUser.users.length > 0) {
        Alert.alert(
          "Error",
          "This email is already registered. Please sign in instead."
        );
        setLoading(false);
        return;
      }

      // If email doesn't exist, create new user
      const userId = id();
      const newUser = {
        id: userId,
        email: email.toLowerCase(),
        password: password,
        createdAt: Date.now(),
      };

      await db.transact([tx.users[userId].update(newUser)]);

      const userData = { id: userId, email: email.toLowerCase() };
      await AsyncStorage.setItem("oneshot_user", JSON.stringify(userData));
      await saveEmailToHistory(email);

      setCurrentUser(userData);
      setLogin(true);
      setEmail("");
      setPassword("");
      setPage("home");
    } catch (error) {
      console.error("Sign up error:", error);
      Alert.alert("Sign Up Error", error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const { data } = await db.queryOnce({
        users: {
          $: {
            where: {
              email: email.toLowerCase(),
            },
          },
        },
      });

      if (data?.users?.length > 0) {
        const user = data.users[0];

        if (user.password !== password) {
          Alert.alert("Sign In Error", "Invalid email or password");
          setLoading(false);
          return;
        }

        const userData = { id: user.id, email: user.email };
        await AsyncStorage.setItem("oneshot_user", JSON.stringify(userData));
        await saveEmailToHistory(user.email);

        setCurrentUser(userData);
        setLogin(true);
        setEmail("");
        setPassword("");
        setPage("home");
      } else {
        Alert.alert("Sign In Error", "User not found");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      Alert.alert(
        "Sign In Error",
        "Failed to sign in. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem("oneshot_user");
      setCurrentUser(null);
      setLogin(false);
      setApps([]);
      setPage("auth");
    } catch (error) {
      Alert.alert("Error", "Failed to sign out");
    }
  };

  const selectImage = () => {
    const options: ImageLibraryOptions = {
      mediaType: "photo",
      includeBase64: true,
      maxHeight: 200,
      maxWidth: 200,
      quality: 0.8 as PhotoQuality,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }
      if (response.assets && response.assets[0]) {
        setAppImage({
          uri: response.assets[0].uri,
          base64: response.assets[0].base64,
        });
      }
    });
  };

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

  const deleteApp = async (appId) => {
    if (!currentUser) return;

    try {
      await db.transact([tx.apps[appId].delete()]);

      setDeleteModalVisible(false);
      setAppToDelete(null);
      setSelectedApp(null);
      setPage("home");
    } catch (error) {
      console.error("Error deleting app:", error);
      Alert.alert("Error", "Failed to delete app");
    }
  };

  const showDeleteConfirmation = (app) => {
    setAppToDelete(app);
    setDeleteModalVisible(true);
  };

  return (
    <View className={`flex-1 ${theme === "dark" ? "bg-stone-950" : ""}`}>
      <Image
        className={`absolute -mx-96 p-8 -my-24 rotate-90 ${
          theme === "dark" ? "opacity-20" : "opacity-30"
        }`}
        source={theme === "dark" ? pantherDark : panther}
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

      {page === "auth" && (
        <View className="flex-1 justify-center px-8">
          <View className="bg-white rounded-2xl p-6 shadow-xl">
            <Text className="text-3xl font-bold font-serif text-center mb-6">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </Text>

            <View>
              <TextInput
                className="bg-gray-100 rounded-xl p-4 mb-2 font-bold"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setShowEmailSuggestions(true)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              {showEmailSuggestions && savedEmails.length > 0 && !isSignUp && (
                <View className="bg-white rounded-xl mb-2 shadow-lg overflow-hidden">
                  <Text className="px-3 pt-2 pb-1 text-xs text-gray-500 font-semibold">
                    Recent accounts:
                  </Text>
                  {savedEmails.map((savedEmail, index) => (
                    <TouchableOpacity
                      key={index}
                      className="px-3 py-3 border-t border-gray-100"
                      onPress={() => {
                        setEmail(savedEmail);
                        setShowEmailSuggestions(false);
                      }}
                    >
                      <Text className="font-semibold text-gray-700">
                        {savedEmail}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <TextInput
              className="bg-gray-100 rounded-xl p-4 mb-2 font-bold"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              onFocus={() => setShowEmailSuggestions(false)}
              secureTextEntry
              autoCapitalize="none"
            />

            {isSignUp && password.length > 0 && (
              <View className="mb-4 px-2">
                <Text
                  className={`text-xs ${
                    password.length >= 8 ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  • At least 8 characters {password.length >= 8 ? "✓" : ""}
                </Text>
                <Text
                  className={`text-xs ${
                    /[A-Z]/.test(password) ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  • One uppercase letter {/[A-Z]/.test(password) ? "✓" : ""}
                </Text>
                <Text
                  className={`text-xs ${
                    /[0-9]/.test(password) ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  • One number {/[0-9]/.test(password) ? "✓" : ""}
                </Text>
              </View>
            )}

            <TouchableOpacity
              className="bg-black rounded-xl p-4 mb-4"
              onPress={isSignUp ? handleSignUp : handleSignIn}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-center text-lg font-serif">
                  {isSignUp ? "Sign Up" : "Sign In"}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
              <Text className="text-center text-gray-600 font-serif">
                {isSignUp
                  ? "Already have an account? Sign In"
                  : "Don't have an account? Sign Up"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {page === "home" && login && (
        <View key="home" className="flex flex-1 px-8 py-24">
          <View className="flex flex-row items-center mx-1">
            <TouchableOpacity
              onPress={() => setSettingsModalVisible(true)}
              className="mr-4"
            >
              <View>
                <View
                  className={`h-0.5 ${
                    theme === "dark" ? "bg-white" : "bg-stone-950"
                  } w-6 mb-1 rounded`}
                ></View>
                <View
                  className={`h-0.5 ${
                    theme === "dark" ? "bg-white" : "bg-stone-950"
                  } w-6 mb-1 rounded`}
                ></View>
                <View
                  className={`h-0.5 ${
                    theme === "dark" ? "bg-white" : "bg-stone-950"
                  } w-6 rounded`}
                ></View>
              </View>
            </TouchableOpacity>

            <View className="flex left-28 justify-center">
              <Text
                className={`items-center font-bold text-center text-xl font-serif ${
                  theme === "dark" ? "text-white" : ""
                }`}
              >
                OneShot
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleSignOut}
              className="absolute right-0 top-0"
            >
              <Text
                className={`font-bold text-xl font-serif ${
                  theme === "dark" ? "text-white" : "text-stone-950"
                }`}
              >
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-1 flex-row gap-5 py-5 flex-wrap">
            {apps.map((app) => (
              <TouchableOpacity
                key={app.id}
                className="items-center"
                onPress={() => {
                  setSelectedApp(app);
                  setPage("appDetail");
                }}
                onLongPress={() => showDeleteConfirmation(app)}
              >
                <View className="bg-white shadow-lg w-20 h-20 flex justify-center items-center rounded-xl relative">
                  {app.image ? (
                    <Image
                      source={{
                        uri: `data:image/jpeg;base64,${app.image}`,
                      }}
                      className="w-full h-full rounded-xl"
                      resizeMode="cover"
                    />
                  ) : (
                    <Text className="text-2xl">
                      {app.name.charAt(0).toUpperCase()}
                    </Text>
                  )}
                </View>
                <Text
                  className={`py-1 font-bold font-serif ${
                    theme === "dark" ? "text-white" : ""
                  }`}
                  numberOfLines={1}
                >
                  {app.name}
                </Text>
              </TouchableOpacity>
            ))}

            <View className="items-center">
              <TouchableOpacity
                onPress={() => {
                  setPage("apps");
                }}
              >
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
        </View>
      )}

      {page === "apps" && (
        <ScrollView
          key="apps"
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
              <TouchableOpacity
                onPress={selectImage}
                className="bg-white shadow-lg h-32 w-96 rounded-2xl mb-6 self-center overflow-hidden"
              >
                {appImage ? (
                  <Image
                    source={{ uri: appImage.uri }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="mt-16 flex justify-center items-center">
                    <Text className="text-gray-500 font-bold font-serif">
                      upload a photo here
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

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
      )}

      {page === "appDetail" && selectedApp && (
        <View key="appDetail" className="flex flex-1 px-8 py-24">
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
              onPress={() => showDeleteConfirmation(selectedApp)}
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
        </View>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-2xl p-6 mx-8 shadow-2xl w-80">
            <Text className="text-2xl font-bold font-serif text-center mb-4">
              Delete App
            </Text>

            {appToDelete && (
              <View className="items-center mb-4">
                <View className="bg-gray-100 w-16 h-16 flex justify-center items-center rounded-xl mb-2 overflow-hidden">
                  {appToDelete.image ? (
                    <Image
                      source={{
                        uri: `data:image/jpeg;base64,${appToDelete.image}`,
                      }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <Text className="text-2xl font-bold">
                      {appToDelete.name.charAt(0).toUpperCase()}
                    </Text>
                  )}
                </View>
                <Text className="font-bold font-serif text-lg">
                  {appToDelete.name}
                </Text>
              </View>
            )}

            <Text className="text-center text-gray-600 mb-6 font-serif">
              Are you sure you want to delete this app? This action cannot be
              undone.
            </Text>

            <View className="flex-row justify-between gap-4">
              <TouchableOpacity
                className="flex-1 bg-gray-200 py-3 rounded-xl"
                onPress={() => {
                  setDeleteModalVisible(false);
                  setAppToDelete(null);
                }}
              >
                <Text className="text-center font-bold font-serif text-gray-700">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-red-500 py-3 rounded-xl"
                onPress={() => appToDelete && deleteApp(appToDelete.id)}
              >
                <Text className="text-center font-bold font-serif text-white">
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={settingsModalVisible}
        onRequestClose={() => setSettingsModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-2xl p-6 mx-8 shadow-2xl w-80">
            <Text className="text-2xl font-bold font-serif text-center mb-6">
              Settings
            </Text>

            <View>
              <Text className="text-lg font-semibold font-serif mb-3">
                Choose Theme
              </Text>

              <TouchableOpacity
                className={`flex-row items-center justify-between p-4 rounded-xl mb-2 ${
                  theme === "light"
                    ? "bg-teal-50 border-2 border-teal-500"
                    : "bg-gray-100"
                }`}
                onPress={() => saveTheme("light")}
              >
                <Text
                  className={`font-semibold ${
                    theme === "light" ? "text-stone-950" : "text-gray-700"
                  }`}
                >
                  Light Mode
                </Text>
                {theme === "light" && (
                  <View className="w-5 h-5 bg-stone-950 rounded-full items-center justify-center">
                    <Text className="text-white text-xs">✓</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-row items-center justify-between p-4 rounded-xl ${
                  theme === "dark"
                    ? "bg-teal-500 border-2 border-teal-600"
                    : "bg-stone-100"
                }`}
                onPress={() => saveTheme("dark")}
              >
                <Text
                  className={`font-semibold ${
                    theme === "dark" ? "text-white" : "text-stone-950"
                  }`}
                >
                  Dark Mode
                </Text>
                {theme === "dark" && (
                  <View className="w-5 h-5 bg-white rounded-full items-center justify-center">
                    <Text className="text-950 text-xs">✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="bg-gray-200 py-3 rounded-xl mt-6"
              onPress={() => setSettingsModalVisible(false)}
            >
              <Text className="text-center font-bold font-serif text-stone-950">
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const App = () => {
  return <App1 />;
};

export default App;
