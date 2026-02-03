import { Ionicons } from "@expo/vector-icons"; // Inclus par défaut dans Expo
import React, { useState } from "react";
import { Control, Controller } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

type InputType = "text" | "number" | "textarea" | "password" | "email";

interface FormInputProps {
    name: string;
    control: Control<any>;
    label: string;
    placeholder?: string;
    type?: InputType;
    rules?: object;
}

export const FormInput: React.FC<FormInputProps> = ({
    name,
    control,
    label,
    placeholder,
    type = "text",
    rules,
}) => {
    // État pour gérer la visibilité du mot de passe
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const getKeyboardType = () => {
        switch (type) {
            case "number":
                return "numeric";
            case "email":
                return "email-address";
            default:
                return "default";
        }
    };

    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
            }) => (
                <View style={{ marginBottom: 15 }}>
                    <Text
                        style={{
                            fontWeight: "600",
                            marginBottom: 6,
                            color: "#374151",
                        }}
                    >
                        {label}
                    </Text>

                    <View
                        style={{
                            position: "relative",
                            justifyContent: "center",
                        }}
                    >
                        <TextInput
                            style={[
                                {
                                    borderWidth: 1,
                                    borderRadius: 12,
                                    padding: 12,
                                    paddingRight: type === "password" ? 45 : 12, // On laisse de la place pour l'icône
                                    backgroundColor: "#f9fafb",
                                    fontSize: 16,
                                    borderColor: error ? "red" : "#e5e7eb",
                                    minHeight: type === "textarea" ? 100 : 48,
                                },
                            ]}
                            placeholder={placeholder}
                            value={value?.toString() ?? ""}
                            onBlur={onBlur}
                            onChangeText={(text) => {
                                if (type === "number") {
                                    onChange(Number(text));
                                } else {
                                    onChange(text);
                                }
                            }}
                            // On gère le masquage dynamiquement
                            secureTextEntry={
                                type === "password" && !isPasswordVisible
                            }
                            keyboardType={getKeyboardType()}
                            autoCapitalize={
                                type === "email" || type === "password"
                                    ? "none"
                                    : "sentences"
                            }
                            autoCorrect={
                                type !== "email" && type !== "password"
                            }
                            multiline={type === "textarea"}
                        />

                        {/* Icône pour afficher/masquer le mot de passe */}
                        {type === "password" && (
                            <TouchableOpacity
                                style={{
                                    position: "absolute",
                                    right: 15,
                                    height: "100%",
                                    justifyContent: "center",
                                }}
                                onPress={() =>
                                    setIsPasswordVisible(!isPasswordVisible)
                                }
                            >
                                <Ionicons
                                    name={isPasswordVisible ? "eye-off" : "eye"}
                                    size={20}
                                    color="#6b7280"
                                />
                            </TouchableOpacity>
                        )}
                    </View>

                    {error && (
                        <Text style={{ color: "red", marginTop: 4 }}>
                            {error.message}
                        </Text>
                    )}
                </View>
            )}
        />
    );
};
