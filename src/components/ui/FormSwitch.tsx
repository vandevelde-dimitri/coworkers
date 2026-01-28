import React from "react";
import { Control, Controller } from "react-hook-form";
import { View, Text, Switch, StyleSheet } from "react-native";

interface FormSwitchProps {
    name: string;
    control: Control<any>;
    label: string;
    description?: string; // Optionnel : pour ajouter un petit texte explicatif
    onAfterChange?: (value: boolean) => void; // Pour lancer la mutation direct après le switch
}

export const FormSwitch: React.FC<FormSwitchProps> = ({
    name,
    control,
    label,
    description,
    onAfterChange,
}) => {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value } }) => (
                <View style={styles.container}>
                    <View style={styles.textContainer}>
                        <Text style={styles.label}>{label}</Text>
                        {description && (
                            <Text style={styles.description}>
                                {description}
                            </Text>
                        )}
                    </View>

                    <Switch
                        // Force le booléen pour éviter les erreurs de type
                        value={!!value}
                        onValueChange={(newValue) => {
                            onChange(newValue); // Met à jour React Hook Form
                            if (onAfterChange) {
                                onAfterChange(newValue); // Lance l'api/mutation
                            }
                        }}
                        // Optionnel : couleurs personnalisées
                        trackColor={{ false: "#d1d5db", true: "#10b981" }}
                        thumbColor={"#ffffff"}
                    />
                </View>
            )}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f3f4f6",
    },
    textContainer: {
        flex: 1,
        paddingRight: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#374151",
    },
    description: {
        fontSize: 14,
        color: "#6b7280",
        marginTop: 2,
    },
});
