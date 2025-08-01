// src/components/ui/Header.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface HeaderProps {
  onMenuPress: () => void;
  onSignOut: () => void;
  theme: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuPress, onSignOut, theme }) => {
  return (
    <View className="flex flex-row items-center mx-1">
      <TouchableOpacity onPress={onMenuPress} className="mr-4">
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

      <TouchableOpacity onPress={onSignOut} className="absolute right-0 top-0">
        <Text
          className={`font-bold text-xl font-serif ${
            theme === "dark" ? "text-white" : "text-stone-950"
          }`}
        >
          Sign Out
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Header;
