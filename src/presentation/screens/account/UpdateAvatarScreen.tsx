import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";

import { AppButton } from "../../components/ui/AppButton";
import { MenuItem } from "../../components/ui/MenuItem";
import { MenuSection } from "../../components/ui/MenuSection";
import { ScreenWrapper } from "../../components/ui/ScreenWrapper";
import { useDeleteAvatar } from "../../hooks/mutations/useDeleteAvatar";
import { useCurrentUser } from "../../hooks/queries/useUser";

export default function EditAvatarScreen() {
  const { data: user } = useCurrentUser();
  const { mutate: deleteAvatar } = useDeleteAvatar();

  const handleTakePhoto = () => {
    console.log("Ouvrir caméra");
  };

  const handleSelectGallery = () => {
    console.log("Ouvrir galerie");
  };

  const handleDeletePhoto = () => {
    deleteAvatar();
  };

  return (
    <ScreenWrapper title="Modifier la photo" showBackButton={true}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.avatarPreviewContainer}>
          <LinearGradient
            colors={["rgba(255, 255, 255, 0.05)", "transparent"]}
            style={styles.avatarGradient}
          >
            <Image
              source={{ uri: user?.profileAvatar }}
              style={styles.avatar}
            />
          </LinearGradient>
        </View>

        <MenuSection title="">
          <MenuItem
            label="Prendre une photo"
            icon="camera-outline"
            onPress={handleTakePhoto}
          />
          <MenuItem
            label="Choisir dans la galerie"
            icon="image-outline"
            onPress={handleSelectGallery}
          />
        </MenuSection>

        <AppButton
          title="Supprimer la photo"
          variant="danger"
          onPress={handleDeletePhoto}
        />
        <View style={styles.footer}>
          <AppButton
            title="Enregistrer la photo"
            onPress={() => console.log("Sauvegarde")}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 100,
  },
  avatarPreviewContainer: {
    position: "relative",
    marginVertical: 30,
    alignItems: "center",
  },
  avatarGradient: {
    padding: 5,
    borderRadius: 80,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  editIconWrapper: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#3B82F6",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#000",
  },
  section: {
    width: "100%",
    marginBottom: 25,
  },
  sectionTitle: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
    marginLeft: 5,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  destructiveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 69, 58, 0.05)",
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 69, 58, 0.2)",
  },
  destructiveText: {
    color: "#FF453A",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 10,
  },
  footer: {
    width: "100%",
    marginTop: 10,
  },
});
