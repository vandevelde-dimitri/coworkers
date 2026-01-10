import React, { useState } from "react";
import { Control, Controller } from "react-hook-form";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

type SelectOption = {
    label: string;
    value: string;
};

interface FormSelectProps {
    name: string;
    control: Control<any>;
    label: string;
    placeholder?: string;
    options: SelectOption[];
}

export const FormSelect: React.FC<FormSelectProps> = ({
    name,
    control,
    label,
    placeholder = "Sélectionner",
    options,
}) => {
    const [visible, setVisible] = useState(false);

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { value, onChange }, fieldState: { error } }) => {
                const selected = options.find((opt) => opt.value === value);

                return (
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

                        <Pressable
                            onPress={() => setVisible(true)}
                            style={{
                                borderWidth: 1,
                                borderRadius: 12,
                                padding: 12,
                                backgroundColor: "#f9fafb",
                                marginBottom: 16,
                                borderColor: error ? "red" : "#e5e7eb",
                            }}
                        >
                            <Text
                                style={{
                                    color: selected ? "#111827" : "#9CA3AF",
                                }}
                            >
                                {selected?.label ?? placeholder}
                            </Text>
                        </Pressable>

                        {error && (
                            <Text style={{ color: "red", marginBottom: 8 }}>
                                {error.message}
                            </Text>
                        )}

                        <Modal
                            visible={visible}
                            transparent
                            animationType="fade"
                        >
                            <Pressable
                                style={{
                                    flex: 1,
                                    backgroundColor: "rgba(0,0,0,0.4)",
                                    justifyContent: "center",
                                    padding: 24,
                                }}
                                onPress={() => setVisible(false)}
                            >
                                <View
                                    style={{
                                        backgroundColor: "#fff",
                                        borderRadius: 16,
                                        padding: 16,
                                    }}
                                >
                                    {options.map((opt) => (
                                        <TouchableOpacity
                                            key={opt.value}
                                            onPress={() => {
                                                onChange(opt.value);
                                                setVisible(false);
                                            }}
                                            style={{
                                                paddingVertical: 12,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 16,
                                                    color: "#111827",
                                                }}
                                            >
                                                {opt.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </Pressable>
                        </Modal>
                    </>
                );
            }}
        />
    );
};
