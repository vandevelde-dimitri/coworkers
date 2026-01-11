import FeatherIcon from "@expo/vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { convertToWebp } from "../../../utils/convertToWebp";
import { requestPermission } from "../../../utils/permission";
import { supabase } from "../../../utils/supabase";
import { uriToArrayBuffer } from "../../../utils/uriToArrayBuffer";
import ScreenWrapper from "../../components/ui/CustomHeader";
import SmartImage from "../../components/ui/SmartImage";
import { useAuth } from "../../contexts/authContext";
import { useCurrentUser, useUploadAvatar } from "../../hooks/user/useUsers";

export default function UpdateAvatarScreen() {
    const { session } = useAuth();
    const { data: user } = useCurrentUser();
    const { mutate: updateAvatar } = useUploadAvatar();
    if (!user) return null;
    const userId = session?.user.id;

    const avatarUrl = user?.image_profile ?? null;

    /* ===================== PICK IMAGE ===================== */

    const pickImage = async (fromCamera: boolean) => {
        const canUseCamera = await requestPermission("camera");
        if (!canUseCamera) return;

        const canUseGallery = await requestPermission("mediaLibrary");
        if (!canUseGallery) return;

        const result = fromCamera
            ? await ImagePicker.launchCameraAsync({
                  allowsEditing: true,
                  aspect: [1, 1],
                  quality: 0.8,
              })
            : await ImagePicker.launchImageLibraryAsync({
                  allowsEditing: true,
                  aspect: [1, 1],
                  quality: 0.8,
              });

        if (result.canceled) return;

        const imageWebp = await convertToWebp(result.assets[0].uri);
        uploadAvatar(imageWebp);
    };

    /* ===================== UPLOAD ===================== */

    const uploadAvatar = async (uri: string) => {
        console.log("Uploading avatar:", uri);
        const fileExt = "webp";
        const filePath = `${user.id}/avatar.${fileExt}`;
        const arrayBuffer = await uriToArrayBuffer(uri);
        try {
            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(filePath, arrayBuffer, {
                    upsert: true,
                    contentType: `image/webp`,
                });

            if (uploadError) throw uploadError;

            const { data: publicUrlData } = supabase.storage
                .from("avatars")
                .getPublicUrl(filePath);

            console.log("Public URL:", publicUrlData.publicUrl);

            updateAvatar({ imageUri: publicUrlData.publicUrl });

            Alert.alert("Succès", "Photo mise à jour");
        } catch (e: any) {
            Alert.alert("Erreur", e.message);
        } finally {
        }
    };

    /* ===================== DELETE ===================== */

    const deleteAvatar = async () => {
        Alert.alert("Supprimer la photo", "Cette action est irréversible", [
            { text: "Annuler", style: "cancel" },
            {
                text: "Supprimer",
                style: "destructive",
                onPress: async () => {
                    try {
                        setLoading(true);

                        await supabase
                            .from("profiles")
                            .update({ avatar_url: null })
                            .eq("id", userId);

                        Alert.alert("Photo supprimée");
                    } catch (e: any) {
                        Alert.alert("Erreur", e.message);
                    } finally {
                        setLoading(false);
                    }
                },
            },
        ]);
    };

    /* ===================== UI ===================== */

    return (
        <ScreenWrapper back title="Photo de profil">
            <View style={{ alignItems: "center", marginTop: 24 }}>
                <SmartImage
                    userData={user}
                    size={120}
                    // source={
                    //     avatarUrl
                    //         ? { uri: avatarUrl }
                    //         : require("../../../assets/avatar-placeholder.png")
                    // }
                    // style={avatar}
                />

                <View style={{ width: "100%", marginTop: 32 }}>
                    <Action
                        icon="camera"
                        label="Prendre une photo"
                        onPress={() => pickImage(true)}
                    />
                    <Action
                        icon="image"
                        label="Choisir depuis la galerie"
                        onPress={() => pickImage(false)}
                    />
                    {avatarUrl && (
                        <Action
                            icon="trash-2"
                            label="Supprimer la photo"
                            danger
                            onPress={deleteAvatar}
                        />
                    )}
                </View>
            </View>
        </ScreenWrapper>
    );
}

/* ===================== COMPONENT ===================== */

const Action = ({ icon, label, onPress, danger = false }) => (
    <TouchableOpacity
        onPress={onPress}
        style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            backgroundColor: "#fff",
            borderRadius: 18,
            marginBottom: 12,
        }}
    >
        <FeatherIcon
            name={icon}
            size={20}
            color={danger ? "#EF4444" : "#1F2937"}
        />
        <Text
            style={{
                marginLeft: 12,
                fontSize: 15,
                fontWeight: "600",
                color: danger ? "#EF4444" : "#111827",
            }}
        >
            {label}
        </Text>
    </TouchableOpacity>
);

/* ===================== STYLES ===================== */

const avatar = {
    width: 120,
    height: 120,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
};
