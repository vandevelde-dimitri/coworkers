import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { convertToWebp } from "../../../utils/convertToWebp";
import { requestPermission } from "../../../utils/permission";
import { showToast } from "../../../utils/showToast";
import { supabase } from "../../../utils/supabase";
import { uriToArrayBuffer } from "../../../utils/uriToArrayBuffer";
import Button from "../../components/ui/Button";
import ConfirmModal from "../../components/ui/ConfirmModal";
import ScreenWrapper from "../../components/ui/CustomHeader";
import SmartImage from "../../components/ui/SmartImage";
import { useCurrentUser, useUploadAvatar } from "../../hooks/user/useUsers";

export default function UpdateAvatarScreen() {
    const { data: user } = useCurrentUser();
    const { mutate: updateAvatar } = useUploadAvatar();
    const [open, setOpen] = useState(false);

    if (!user) return <ActivityIndicator />;

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

            showToast("success", "Photo de profil mise à jour");
        } catch (e: any) {
            showToast("error", "Erreur lors de la mise à jour de la photo");
        } finally {
        }
    };

    /* ===================== DELETE ===================== */

    const deleteAvatar = async () => {
        try {
            updateAvatar({
                imageUri: null,
            });
            showToast("success", "Photo de profil supprimée");
        } catch (e: any) {
            showToast("error", "Erreur lors de la suppression de la photo");
        }
    };

    /* ===================== UI ===================== */

    return (
        <ScreenWrapper back title="Photo de profil">
            <View style={{ alignItems: "center", marginTop: 24 }}>
                <SmartImage userData={user} size={120} />

                <View style={{ width: "100%", marginTop: 32 }}>
                    {/* <Action
                        icon="camera"
                        label="Prendre une photo"
                        onPress={() => pickImage(true)}
                    /> */}
                    <Button
                        label="Prendre une photo"
                        onPress={() => pickImage(true)}
                    />
                    <Button
                        variant="secondary"
                        label="Choisir depuis la galerie"
                        onPress={() => pickImage(false)}
                    />
                    {avatarUrl && (
                        <Button
                            variant="danger"
                            label="Supprimer la photo"
                            onPress={() => setOpen(true)}
                        />
                    )}
                    <ConfirmModal
                        visible={open}
                        title="Supprimer la photo de profil ?"
                        description="Cette action est définitive et ne pourra pas être annulée."
                        confirmLabel="Oui"
                        cancelLabel="Non"
                        onCancel={() => setOpen(false)}
                        onConfirm={() => {
                            setOpen(false);
                            deleteAvatar();
                        }}
                        danger
                    />
                </View>
            </View>
        </ScreenWrapper>
    );
}
