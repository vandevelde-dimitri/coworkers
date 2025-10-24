import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Control, Controller } from "react-hook-form";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { formAuthStyles } from "../../styles/form.styles";

interface FormDatePickerProps {
    name: string;
    control: Control<any>;
    label: string;
    rules?: object;
}

export const FormDatePicker: React.FC<FormDatePickerProps> = ({
    name,
    control,
    label,
    rules,
}) => {
    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field: { value, onChange }, fieldState: { error } }) => {
                const [show, setShow] = useState(false);

                const handleChange = (_: any, selectedDate?: Date) => {
                    setShow(Platform.OS === "ios");
                    if (selectedDate) {
                        // Format YYYY-MM-DD
                        const formatted = selectedDate
                            .toISOString()
                            .split("T")[0];
                        onChange(formatted);
                    }
                };
                // Si value est une string, on la convertit en Date
                const displayDate = value ? new Date(value) : new Date();
                return (
                    <View style={{ marginBottom: 16 }}>
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

                        <TouchableOpacity
                            onPress={() => setShow(true)}
                            style={formAuthStyles.input}
                        >
                            <Text style={{ color: "#111827" }}>
                                {value
                                    ? new Date(value).toLocaleDateString(
                                          "fr-FR"
                                      ) // Affiche en format français
                                    : "Sélectionner une date"}
                            </Text>
                        </TouchableOpacity>

                        {show && (
                            <DateTimePicker
                                value={displayDate}
                                mode="date"
                                display={
                                    Platform.OS === "ios"
                                        ? "spinner"
                                        : "default"
                                }
                                onChange={handleChange}
                            />
                        )}

                        {error && (
                            <Text style={{ color: "red", paddingBottom: 5 }}>
                                {error.message}
                            </Text>
                        )}
                    </View>
                );
            }}
        />
    );
};
