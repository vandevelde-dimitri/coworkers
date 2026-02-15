import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Control, Controller } from "react-hook-form";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type InputType = "text" | "number" | "textarea" | "password" | "email";

interface FormInputProps {
    name: string;
    control: Control<any>;
    label: string;
    placeholder?: string;
    type?: InputType;
    rules?: object;
    iconName: React.ComponentProps<typeof Ionicons>["name"];
}

export const FormInput = ({
    iconName,
    name,
    control,
    label,
    placeholder,
    type = "text",
    rules,
}: FormInputProps) => {
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
                <View style={styles.wrapper}>
                    <Text style={styles.label}>{label}</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons
                            name={iconName}
                            size={20}
                            color="#6C757D"
                            style={styles.icon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder={placeholder}
                            onBlur={onBlur}
                            placeholderTextColor="#ADB5BD"
                            secureTextEntry={
                                type === "password" && !isPasswordVisible
                            }
                            value={value}
                            keyboardType={getKeyboardType()}
                            onChangeText={(text) => {
                                if (type === "number") {
                                    onChange(Number(text));
                                } else {
                                    onChange(text);
                                }
                            }}
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
                        <Text style={{ color: "#991B1B", marginTop: 4 }}>
                            {error.message}
                        </Text>
                    )}
                </View>
            )}
        />
    );
};

const styles = StyleSheet.create({
    wrapper: { marginBottom: 20 },
    label: {
        color: "#FFF",
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
        paddingHorizontal: 15,
        height: 60,
    },
    icon: { marginRight: 10 },
    input: { flex: 1, color: "#FFF", fontSize: 16 },
});
