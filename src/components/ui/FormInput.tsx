import React from "react";
import { Control, Controller } from "react-hook-form";
import { Text, TextInput } from "react-native";

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
                <>
                    <Text
                        style={{
                            fontWeight: "600",
                            marginBottom: 6,
                            color: "#374151",
                        }}
                    >
                        {label}
                    </Text>

                    <TextInput
                        style={[
                            {
                                borderWidth: 1,
                                borderRadius: 12,
                                padding: 12,
                                backgroundColor: "#f9fafb",
                                marginBottom: 8,
                                fontSize: 16,
                                borderColor: error ? "red" : "#e5e7eb",
                                minHeight: type === "textarea" ? 100 : 40,
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
                        secureTextEntry={type === "password"}
                        keyboardType={getKeyboardType()}
                        autoCapitalize={
                            type === "email" || type === "password"
                                ? "none"
                                : "sentences"
                        }
                        autoCorrect={type !== "email" && type !== "password"}
                        multiline={type === "textarea"}
                    />

                    {error && (
                        <Text style={{ color: "red", paddingBottom: 12 }}>
                            {error.message}
                        </Text>
                    )}
                </>
            )}
        />
    );
};
