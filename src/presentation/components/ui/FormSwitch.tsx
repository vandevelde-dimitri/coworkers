import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { ComponentProps } from "react";
import { Control, Controller } from "react-hook-form";
import { Platform, StyleSheet, Switch, Text, View } from "react-native";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

interface FormMenuSwitchProps {
    name: string;
    control: Control<any>;
    label: string;
    icon: IoniconName;
    description?: string;
    onAfterChange?: (value: boolean) => void;
}

export const FormMenuSwitch: React.FC<FormMenuSwitchProps> = ({
    name,
    control,
    label,
    icon,
    description,
    onAfterChange,
}) => {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value } }) => (
                <LinearGradient
                    colors={[
                        "rgba(255, 255, 255, 0.08)",
                        "rgba(255, 255, 255, 0.03)",
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.menuItem}
                >
                    <View style={styles.menuIconBg}>
                        <Ionicons name={icon} size={16} color="#fff" />
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={styles.label}>{label}</Text>
                        {description && (
                            <Text style={styles.description}>
                                {description}
                            </Text>
                        )}
                    </View>

                    <Switch
                        value={!!value}
                        onValueChange={(newValue) => {
                            onChange(newValue);
                            if (onAfterChange) {
                                onAfterChange(newValue);
                            }
                        }}
                        trackColor={{ false: "#3a3a3c", true: "#3B82F6" }}
                        thumbColor={
                            Platform.OS === "ios"
                                ? "#fff"
                                : !!value
                                  ? "#fff"
                                  : "#f4f3f4"
                        }
                        ios_backgroundColor="#3a3a3c"
                    />
                </LinearGradient>
            )}
        />
    );
};

const styles = StyleSheet.create({
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        marginBottom: 10,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    menuIconBg: {
        width: 35,
        height: 35,
        borderRadius: 10,
        backgroundColor: "rgba(255,255,255,0.1)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
        paddingRight: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
    },
    description: {
        fontSize: 12,
        color: "rgba(255, 255, 255, 0.5)",
        marginTop: 2,
    },
});
