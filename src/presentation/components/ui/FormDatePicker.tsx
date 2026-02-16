import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Control, Controller } from "react-hook-form";
import {
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

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

                const handleChange = (
                    event: DateTimePickerEvent,
                    selectedDate?: Date,
                ) => {
                    // Sur Android, on ferme après sélection
                    if (Platform.OS === "android") setShow(false);

                    if (selectedDate) {
                        // On garde l'objet Date pour le display, mais on envoie le string au form
                        const formatted = selectedDate
                            .toISOString()
                            .split("T")[0];
                        onChange(formatted);
                    }
                };

                const displayDate = value ? new Date(value) : new Date();

                return (
                    <View style={styles.container}>
                        <Text style={styles.label}>{label}</Text>

                        <TouchableOpacity
                            onPress={() => setShow(true)}
                            activeOpacity={0.7}
                            style={[
                                styles.pickerButton,
                                error
                                    ? styles.errorBorder
                                    : styles.normalBorder,
                            ]}
                        >
                            <Ionicons
                                name="calendar-outline"
                                size={20}
                                color="#6C757D"
                            />
                            <Text style={styles.dateText}>
                                {value
                                    ? new Date(value).toLocaleDateString(
                                          "fr-FR",
                                          {
                                              day: "numeric",
                                              month: "long",
                                              year: "numeric",
                                          },
                                      )
                                    : "Sélectionner une date"}
                            </Text>
                        </TouchableOpacity>

                        {/* Rendu spécifique par Plateforme pour le design Dark */}
                        {Platform.OS === "ios" ? (
                            <Modal
                                visible={show}
                                transparent
                                animationType="slide"
                            >
                                <View style={styles.modalOverlay}>
                                    <View style={styles.glassContent}>
                                        <View style={styles.header}>
                                            <Text style={styles.headerTitle}>
                                                {label}
                                            </Text>
                                            <TouchableOpacity
                                                onPress={() => setShow(false)}
                                            >
                                                <Text style={styles.doneText}>
                                                    OK
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <DateTimePicker
                                            value={displayDate}
                                            mode="date"
                                            display="spinner"
                                            onChange={handleChange}
                                            textColor="#FFF"
                                        />
                                    </View>
                                </View>
                            </Modal>
                        ) : (
                            show && (
                                <DateTimePicker
                                    value={displayDate}
                                    mode="date"
                                    display="default"
                                    onChange={handleChange}
                                />
                            )
                        )}

                        {error && (
                            <Text style={styles.errorText}>
                                {error.message}
                            </Text>
                        )}
                    </View>
                );
            }}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        color: "#FFF",
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
        marginLeft: 4,
    },
    pickerButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 15,
        borderWidth: 1,
        gap: 12,
        height: 60,
    },
    normalBorder: {
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    errorBorder: {
        borderColor: "#FF4D4D",
    },
    dateText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "500",
    },
    errorText: {
        color: "#FF4D4D",
        fontSize: 12,
        marginTop: 6,
        marginLeft: 4,
    },
    // Styles Modal iOS
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "flex-end",
    },
    glassContent: {
        backgroundColor: "#1C2637",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingBottom: 40,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 20,
    },
    headerTitle: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "700",
    },
    doneText: {
        color: "#4FACFE",
        fontSize: 16,
        fontWeight: "700",
    },
});
