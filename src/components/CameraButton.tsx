import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CameraButton({
    onPictureTaken,
}: {
    onPictureTaken: (uri: string) => void;
}) {
    const [permission, requestPermission] = useCameraPermissions();
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const cameraRef = useRef<CameraView>(null);

    useEffect(() => {
        if (!permission) {
            requestPermission();
        }
    }, [permission]);

    const takePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.8,
            });
            setPhotoUri(photo.uri);
            onPictureTaken(photo.uri);
        }
    };

    if (!permission) {
        return (
            <View>
                <Text>Chargement...</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: "center" }}>
                    Autorisez la caméra pour continuer
                </Text>
                <TouchableOpacity
                    onPress={requestPermission}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Donner l'autorisation</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (photoUri) {
        return (
            <View style={styles.previewContainer}>
                <Image source={{ uri: photoUri }} style={styles.preview} />
                <TouchableOpacity
                    onPress={() => setPhotoUri(null)}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Reprendre</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView ref={cameraRef} style={styles.camera} facing="front" />
            <TouchableOpacity
                onPress={takePicture}
                style={styles.captureButton}
            >
                <View style={styles.innerCircle} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    camera: {
        width: "100%",
        height: "80%",
        borderRadius: 20,
    },
    captureButton: {
        position: "absolute",
        bottom: 30,
        alignSelf: "center",
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "rgba(255,255,255,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    innerCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "white",
    },
    button: {
        backgroundColor: "#007AFF",
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
    previewContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    preview: {
        width: 250,
        height: 250,
        borderRadius: 125,
    },
});
