import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

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
            {/* Le bouton carré avec l'icône */}
            <TouchableOpacity
                onPress={() => setVisible(true)}
                style={{
                    backgroundColor: "#e5e7eb",
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 12,
                    marginRight: 8,
                    marginBottom: 8,
                }}
            >
                <Feather name="sliders" size={20} color="#374151" />
            </TouchableOpacity>

            {/* La Modal (copiée de ton FormSelect) */}
            <Modal visible={visible} transparent animationType="fade">
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
                        <Text
                            style={{
                                fontWeight: "700",
                                marginBottom: 15,
                                fontSize: 16,
                                textAlign: "center",
                            }}
                        >
                            Filtrer par centre
                        </Text>
                        {options.map((opt) => (
                            <TouchableOpacity
                                key={opt.value}
                                onPress={() => {
                                    onSelect(opt.value);
                                    setVisible(false);
                                }}
                                style={{
                                    paddingVertical: 15,
                                    borderBottomWidth: 1,
                                    borderBottomColor: "#f3f4f6",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 16,
                                        color:
                                            selectedValue === opt.value
                                                ? "#2563eb"
                                                : "#111827",
                                        fontWeight:
                                            selectedValue === opt.value
                                                ? "700"
                                                : "400",
                                    }}
                                >
                                    {opt.label}
                                </Text>
                                {selectedValue === opt.value && (
                                    <Feather
                                        name="check"
                                        size={18}
                                        color="#2563eb"
                                    />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </Pressable>
            </Modal>
        </>
    );
};
