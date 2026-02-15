import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

interface RemoveParticipantButtonProps {
    participant: any;
    annonce: any;
}

export const RemoveParticipantButton = ({
    participant,
    annonce,
}: RemoveParticipantButtonProps) => {
    const isLoading = false;

    const handleRemove = () => {
        Alert.alert(
            "Retirer le passager",
            `Voulez-vous vraiment retirer ${participant.firstName} de ce trajet ?`,
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Retirer",
                    style: "destructive",
                    onPress: () => {
                        console.log(
                            `Suppression de ${participant.id} dans l'annonce ${annonce.id}`,
                        );
                    },
                },
            ],
        );
    };

    return (
        <TouchableOpacity
            onPress={handleRemove}
            style={styles.button}
            disabled={isLoading}
        >
            {isLoading ? (
                <ActivityIndicator size="small" color="#FF4D4D" />
            ) : (
                <View style={styles.iconContainer}>
                    <Ionicons
                        name="person-remove-outline"
                        size={20}
                        color="#FF4D4D"
                    />
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        marginLeft: "auto",
        padding: 8,
    },
    iconContainer: {
        backgroundColor: "rgba(255, 77, 77, 0.1)",
        padding: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(255, 77, 77, 0.2)",
    },
});
