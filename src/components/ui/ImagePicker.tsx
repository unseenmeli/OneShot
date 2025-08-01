// src/components/ui/ImagePicker.tsx
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import {
  launchImageLibrary,
  ImageLibraryOptions,
  PhotoQuality,
} from "react-native-image-picker";

interface ImagePickerProps {
  image: any;
  onImageSelected: (image: any) => void;
}

const ImagePicker: React.FC<ImagePickerProps> = ({
  image,
  onImageSelected,
}) => {
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
        onImageSelected({
          uri: response.assets[0].uri,
          base64: response.assets[0].base64,
        });
      }
    });
  };

  return (
    <TouchableOpacity
      onPress={selectImage}
      className="bg-white shadow-lg h-32 w-96 rounded-2xl mb-6 self-center overflow-hidden"
    >
      {image ? (
        <Image
          source={{ uri: image.uri }}
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
  );
};

export default ImagePicker;
