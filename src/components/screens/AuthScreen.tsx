// src/components/screens/AuthScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { tx, id } from "@instantdb/react-native";
import { db } from "../../app";
import { useUser } from "../context/UserContext";
import EmailSuggestions from "../ui/EmailSuggestions";
import PasswordValidator from "../ui/PasswordValidator";

interface AuthScreenProps {
  setPage: (page: string) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ setPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);

  const { setCurrentUser, setLogin, savedEmails, saveEmailToHistory } =
    useUser();

  const validatePassword = (password: string) => {
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

  return (
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
            <EmailSuggestions
              emails={savedEmails}
              onSelect={(email) => {
                setEmail(email);
                setShowEmailSuggestions(false);
              }}
            />
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
          <PasswordValidator password={password} />
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
  );
};

export default AuthScreen;
