// src/components/ui/PasswordValidator.tsx
import React from "react";
import { View, Text } from "react-native";

interface PasswordValidatorProps {
  password: string;
}

const PasswordValidator: React.FC<PasswordValidatorProps> = ({ password }) => {
  return (
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
  );
};

export default PasswordValidator;
