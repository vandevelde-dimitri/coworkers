import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Control, Controller } from "react-hook-form";
import {
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

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
                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>{label}</Text>

                        <Pressable
                            onPress={() => setVisible(true)}
                            style={[
                                styles.selectTrigger,
                                error
                                    ? styles.borderError
                                    : styles.borderNormal,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.triggerText,
                                    !selected && styles.placeholderText,
                                ]}
                            >
                                {selected?.label ?? placeholder}
                            </Text>
                            <Ionicons
                                name="chevron-down"
                                size={20}
                                color="rgba(255,255,255,0.5)"
                            />
                        </Pressable>

                        {error && (
                            <Text style={styles.errorText}>
                                {error.message}
                            </Text>
                        )}

                        <Modal
                            visible={visible}
                            transparent
                            animationType="slide"
                        >
                            <Pressable
                                style={styles.modalOverlay}
                                onPress={() => setVisible(false)}
                            >
                                <View style={styles.modalContent}>
                                    <View style={styles.modalHeader}>
                                        <View style={styles.modalHandle} />
                                        <Text style={styles.modalTitle}>
                                            {label}
                                        </Text>
                                    </View>

                                    <FlatList
                                        data={options}
                                        keyExtractor={(item) => item.value}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    onChange(item.value);
                                                    setVisible(false);
                                                }}
                                                style={[
                                                    styles.optionItem,
                                                    item.value === value &&
                                                        styles.optionSelected,
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.optionText,
                                                        item.value === value &&
                                                            styles.optionTextSelected,
                                                    ]}
                                                >
                                                    {item.label}
                                                </Text>
                                                {item.value === value && (
                                                    <Ionicons
                                                        name="checkmark-circle"
                                                        size={22}
                                                        color="#FFF"
                                                    />
                                                )}
                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>
                            </Pressable>
                        </Modal>
                    </View>
                );
            }}
        />
    );
};

const styles = StyleSheet.create({
    fieldContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#B9B9B9",
        marginBottom: 8,
        marginLeft: 4,
    },
    selectTrigger: {
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        borderRadius: 16,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
    },
    borderNormal: {
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    borderError: {
        borderWidth: 1,
        borderColor: "#FF6B6B",
    },
    triggerText: {
        fontSize: 16,
        color: "#FFF",
    },
    placeholderText: {
        color: "rgba(255, 255, 255, 0.3)",
    },
    errorText: {
        color: "#FF6B6B",
        fontSize: 12,
        marginTop: 6,
        marginLeft: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "#1C2C42",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingBottom: 40,
        maxHeight: "70%",
    },
    modalHeader: {
        alignItems: "center",
        paddingVertical: 15,
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: "rgba(255,255,255,0.2)",
        borderRadius: 2,
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#FFF",
    },
    optionItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 18,
        paddingHorizontal: 25,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.05)",
    },
    optionSelected: {
        backgroundColor: "rgba(255,255,255,0.08)",
    },
    optionText: {
        fontSize: 16,
        color: "rgba(255,255,255,0.7)",
    },
    optionTextSelected: {
        color: "#FFF",
        fontWeight: "700",
    },
});
