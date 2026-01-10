import FeatherIcon from "@expo/vector-icons/Feather";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../../../utils/supabase";
import ScreenWrapper from "../../components/ui/CustomHeader";
import { useAuth } from "../../contexts/authContext";

export default function UpdateAvatarScreen() {
    const { session } = useAuth();
    const userId = session?.user.id;

    const [loading, setLoading] = useState(false);
    const avatarUrl = session?.user?.user_metadata?.avatar_url ?? null;

    /* ===================== PICK IMAGE ===================== */

    const pickImage = async (fromCamera: boolean) => {
        const permission = fromCamera
            ? await ImagePicker.requestCameraPermissionsAsync()
            : await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            Alert.alert("Permission refusée");
            return;
        }

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

        uploadAvatar(result.assets[0].uri);
    };

    /* ===================== UPLOAD ===================== */

    const uploadAvatar = async (uri: string) => {
        try {
            setLoading(true);

            const fileExt = uri.split(".").pop();
            const filePath = `${userId}.${fileExt}`;

            const fileBase64 = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const buffer = Uint8Array.from(atob(fileBase64), (c) =>
                c.charCodeAt(0)
            );

            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(filePath, buffer, {
                    upsert: true,
                    contentType: `image/${fileExt}`,
                });

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from("avatars")
                .getPublicUrl(filePath);

            await supabase
                .from("profiles")
                .update({ avatar_url: data.publicUrl })
                .eq("id", userId);

            Alert.alert("Succès", "Photo mise à jour");
        } catch (e: any) {
            Alert.alert("Erreur", e.message);
        } finally {
            setLoading(false);
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
                <Image
                    source={
                        avatarUrl
                            ? { uri: avatarUrl }
                            : require("../../../assets/avatar-placeholder.png")
                    }
                    style={avatar}
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
