// src/components/ui/DeleteModal.tsx
import React from "react";
import { View, Text, TouchableOpacity, Modal, Image } from "react-native";

interface DeleteModalProps {
  visible: boolean;
  app: any;
  onCancel: () => void;
  onDelete: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  visible,
  app,
  onCancel,
  onDelete,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-2xl p-6 mx-8 shadow-2xl w-80">
          <Text className="text-2xl font-bold font-serif text-center mb-4">
            Delete App
          </Text>

          {app && (
            <View className="items-center mb-4">
              <View className="bg-gray-100 w-16 h-16 flex justify-center items-center rounded-xl mb-2 overflow-hidden">
                {app.image ? (
                  <Image
                    source={{
                      uri: `data:image/jpeg;base64,${app.image}`,
                    }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Text className="text-2xl font-bold">
                    {app.name.charAt(0).toUpperCase()}
                  </Text>
                )}
              </View>
              <Text className="font-bold font-serif text-lg">{app.name}</Text>
            </View>
          )}

          <Text className="text-center text-gray-600 mb-6 font-serif">
            Are you sure you want to delete this app? This action cannot be
            undone.
          </Text>

          <View className="flex-row justify-between gap-4">
            <TouchableOpacity
              className="flex-1 bg-gray-200 py-3 rounded-xl"
              onPress={onCancel}
            >
              <Text className="text-center font-bold font-serif text-gray-700">
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-red-500 py-3 rounded-xl"
              onPress={onDelete}
            >
              <Text className="text-center font-bold font-serif text-white">
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteModal;
