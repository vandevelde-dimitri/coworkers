import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import React, { useRef, useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import SafeScreen from "../../components/SafeScreen";
import { useCurrentUser, useUploadAvatar } from "../../hooks/user/useUsers";
import { containerStyles } from "../../styles/container.styles";
import { formAuthStyles } from "../../styles/form.styles";

export default function AvatarRegistrationScreen() {
    const { data: user } = useCurrentUser();
    const { mutate: uploadAvatar, isPending } = useUploadAvatar();
    const [mode, setMode] = useState<"menu" | "camera" | "preview">("menu");
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView | null>(null);

    //-- afficher la photo dans la bdd --
    function saveAvatar() {
        if (!imageUri || !user?.id) return;

        uploadAvatar(
            {
                imageUri,
                userId: user.id,
            },
            {
                onSuccess: () => {
                    alert("🎉 Photo mise à jour !");
                    setMode("menu");
                },
                onError: (err) => {
                    console.log("❌ Erreur upload avatar:", err);
                    alert("Erreur lors de l’envoi !");
                },
            }
        );
    }
    // --- Galerie ---
    async function pickFromGallery() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            setMode("preview");
        }
    }

    // --- Caméra ---
    async function openCamera() {
        const { status } = await requestPermission();
        if (status === "granted") {
            setMode("camera");
        }
    }

    async function takePicture() {
        if (!cameraRef.current) return;
        const photo = await cameraRef.current.takePictureAsync();
        setImageUri(photo.uri);
        setMode("preview");
    }

    // --- UI ---
    return (
        <SafeScreen backBtn>
            <ScrollView>
                <Text style={formAuthStyles.title}>
                    Ajouter votre photo de profil
                </Text>

                {/* 1️⃣ Menu principal */}
                {mode === "menu" && (
                    <>
                        <Image
                            style={styles.avatar}
                            source={{
                                uri:
                                    user?.image_profile ||
                                    "https://randomuser.me/api/portraits/men/32.jpg",
                            }}
                        />
                        <TouchableOpacity
                            style={containerStyles.bottomButton}
                            onPress={openCamera}
                        >
                            <View style={formAuthStyles.buttonPrimary}>
                                <Text style={formAuthStyles.buttonText}>
                                    📸 Prendre une photo
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={containerStyles.bottomButton}
                            onPress={pickFromGallery}
                        >
                            <View style={formAuthStyles.buttonPrimary}>
                                <Text style={formAuthStyles.buttonText}>
                                    🖼 Choisir depuis la galerie
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </>
                )}

                {/* 2️⃣ Caméra */}
                {mode === "camera" && permission?.granted && (
                    <View style={styles.cameraContainer}>
                        <CameraView
                            ref={cameraRef}
                            style={styles.camera}
                            facing="front"
                        />
                        <TouchableOpacity
                            style={styles.captureButton}
                            onPress={takePicture}
                        >
                            <Text style={styles.captureText}>📷</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={containerStyles.bottomButton}
                            onPress={() => setMode("menu")}
                        >
                            <View style={formAuthStyles.buttonPrimary}>
                                <Text style={formAuthStyles.buttonText}>
                                    Retour
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}

                {/* 3️⃣ Aperçu après capture */}
                {mode === "preview" && imageUri && (
                    <>
                        <Image
                            source={{ uri: imageUri }}
                            style={styles.preview}
                        />
                        <TouchableOpacity
                            style={containerStyles.bottomButton}
                            onPress={() => setMode("menu")}
                        >
                            <View style={formAuthStyles.buttonPrimary}>
                                <Text style={formAuthStyles.buttonText}>
                                    Retour
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={containerStyles.bottomButton}
                            onPress={saveAvatar}
                            disabled={isPending}
                        >
                            <View style={formAuthStyles.buttonPrimary}>
                                <Text style={formAuthStyles.buttonText}>
                                    {isPending
                                        ? "Enregistrement..."
                                        : "Enregistrer"}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </>
                )}
            </ScrollView>
        </SafeScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingVertical: 20,
    },
    cameraContainer: {
        width: "100%",
        height: 500,
        position: "relative",
        borderRadius: 20,
        overflow: "hidden",
    },
    camera: {
        flex: 1,
    },
    captureButton: {
        position: "absolute",
        bottom: 30,
        alignSelf: "center",
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 50,
    },
    captureText: {
        fontSize: 24,
    },
    preview: {
        width: 250,
        height: 250,
        borderRadius: 20,
        marginVertical: 20,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 9999,
        marginBottom: 12,
    },
});
