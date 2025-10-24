import React from "react";
import { Control, Controller } from "react-hook-form";
import { Text, TextInput } from "react-native";
import { formAuthStyles } from "../../styles/form.styles";

type InputType = "text" | "number" | "textarea";

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
                            fontSize: 16,
                            fontWeight: "600",
                            marginBottom: 8,
                            color: "#111827",
                        }}
                    >
                        {label}
                    </Text>

                    <TextInput
                        style={[
                            formAuthStyles.input,
                            {
                                borderColor: error ? "red" : "#d1d5db",
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
                        keyboardType={type === "number" ? "numeric" : "default"}
                        multiline={type === "textarea"}
                    />

                    {error && (
                        <Text style={{ color: "red", paddingBottom: 5 }}>
                            {error.message}
                        </Text>
                    )}
                </>
            )}
        />
    );
};
