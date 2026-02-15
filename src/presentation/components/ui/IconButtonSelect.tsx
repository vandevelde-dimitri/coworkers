import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface IconButtonSelectProps {
    options: { label: string; value: string }[];
    onSelect: (value: string) => void;
    selectedValue?: string;
}

export const IconButtonSelect: React.FC<IconButtonSelectProps> = ({
    options,
    onSelect,
    selectedValue,
}) => {
    const [visible, setVisible] = useState(false);

    return (
        <>
            <TouchableOpacity
                onPress={() => setVisible(true)}
                activeOpacity={0.7}
                style={styles.button}
            >
                <Feather name="map-pin" size={20} color="#141E30" />
                {selectedValue && selectedValue !== "all" && (
                    <View style={styles.badge} />
                )}
            </TouchableOpacity>

            <Modal visible={visible} transparent animationType="fade">
                <Pressable
                    style={styles.overlay}
                    onPress={() => setVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.title}>Sélectionner un centre</Text>

                        <ScrollView bounces={false} style={{ maxHeight: 400 }}>
                            {options.map((opt) => (
                                <TouchableOpacity
                                    key={opt.value}
                                    onPress={() => {
                                        onSelect(opt.value);
                                        setVisible(false);
                                    }}
                                    style={styles.option}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            selectedValue === opt.value &&
                                                styles.optionTextActive,
                                        ]}
                                    >
                                        {opt.label}
                                    </Text>
                                    {selectedValue === opt.value && (
                                        <Feather
                                            name="check"
                                            size={18}
                                            color="#141E30"
                                        />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </Pressable>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#FFF",
        padding: 12,
        borderRadius: 12,
        marginRight: 8,
        borderWidth: 1,
        borderColor: "#E9ECEF",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        position: "relative",
    },
    badge: {
        position: "absolute",
        top: -2,
        right: -2,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#FF4757",
        borderWidth: 2,
        borderColor: "#FFF",
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(20, 30, 48, 0.4)",
        justifyContent: "center",
        padding: 24,
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    title: {
        fontWeight: "800",
        marginBottom: 20,
        fontSize: 18,
        color: "#141E30",
        textAlign: "center",
    },
    option: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F1F3F5",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    optionText: {
        fontSize: 16,
        color: "#495057",
        fontWeight: "500",
    },
    optionTextActive: {
        color: "#141E30",
        fontWeight: "700",
    },
});
