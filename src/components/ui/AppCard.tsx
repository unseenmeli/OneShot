// src/components/ui/AppCard.tsx
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

interface App {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

interface AppCardProps {
  app: App;
  onPress: () => void;
  onLongPress: () => void;
  theme: string;
}

const AppCard: React.FC<AppCardProps> = ({
  app,
  onPress,
  onLongPress,
  theme,
}) => {
  return (
    <TouchableOpacity
      className="items-center"
      onPress={onPress}
      onLongPress={onLongPress}
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
          <Text className="text-2xl">{app.name.charAt(0).toUpperCase()}</Text>
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
  );
};

export default AppCard;
