// src/components/ui/SettingsModal.tsx
import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";

interface SettingsModalProps {
  visible: boolean;
  theme: string;
  onThemeChange: (theme: string) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  theme,
  onThemeChange,
  onClose,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
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
              onPress={() => onThemeChange("light")}
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
              onPress={() => onThemeChange("dark")}
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
            onPress={onClose}
          >
            <Text className="text-center font-bold font-serif text-stone-950">
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SettingsModal;
