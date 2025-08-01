// src/components/ui/EmailSuggestions.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface EmailSuggestionsProps {
  emails: string[];
  onSelect: (email: string) => void;
}

const EmailSuggestions: React.FC<EmailSuggestionsProps> = ({
  emails,
  onSelect,
}) => {
  return (
    <View className="bg-white rounded-xl mb-2 shadow-lg overflow-hidden">
      <Text className="px-3 pt-2 pb-1 text-xs text-gray-500 font-semibold">
        Recent accounts:
      </Text>
      {emails.map((email, index) => (
        <TouchableOpacity
          key={index}
          className="px-3 py-3 border-t border-gray-100"
          onPress={() => onSelect(email)}
        >
          <Text className="font-semibold text-gray-700">{email}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default EmailSuggestions;
