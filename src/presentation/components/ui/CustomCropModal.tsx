import { BlurView } from "expo-blur";
import React from "react";
import { Dimensions, Image, Modal, StyleSheet, Text, View } from "react-native";
import { AppButton } from "./AppButton";

const { width } = Dimensions.get("window");

interface CropModalProps {
  visible: boolean;
  imageUri: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const CustomCropModal = ({
  visible,
  imageUri,
  onClose,
  onConfirm,
}: CropModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />

        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Confirmer la photo</Text>

          <View style={styles.imagePreviewWrapper}>
            <Image
              source={{ uri: imageUri || "" }}
              style={styles.previewImage}
            />
          </View>

          <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
              <AppButton
                title="Annuler"
                variant="secondary"
                onPress={onClose}
              />
            </View>
            <View style={styles.buttonWrapper}>
              <AppButton title="Valider" onPress={onConfirm} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: "rgba(20, 20, 20, 0.9)",
    borderRadius: 30,
    padding: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  imagePreviewWrapper: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
    marginBottom: 25,
    backgroundColor: "#333",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 15,
    width: "100%",
    justifyContent: "space-between",
  },
  buttonWrapper: {
    flex: 1,
  },
});
