import { useState } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";

export function CustomPicker({ label, selectedValue, onValueChange, items }) {
    const [visible, setVisible] = useState(false);

    return (
        <View style={{ marginBottom: 12 }}>
            <Text style={{ marginBottom: 6, fontWeight: "600" }}>{label}</Text>

            <TouchableOpacity
                onPress={() => setVisible(true)}
                style={{
                    padding: 12,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    backgroundColor: "#f9fafb",
                }}
            >
                <Text style={{ color: selectedValue ? "#374151" : "#9ca3af" }}>
                    {selectedValue || `Sélectionnez ${label.toLowerCase()}`}
                </Text>
            </TouchableOpacity>

            <Modal visible={visible} transparent animationType="slide">
                <TouchableOpacity
                    onPress={() => setVisible(false)}
                    style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)" }}
                >
                    <View
                        style={{
                            backgroundColor: "#fff",
                            marginHorizontal: 32,
                            marginTop: 200,
                            borderRadius: 18,
                            padding: 16,
                            maxHeight: 250,
                        }}
                    >
                        <FlatList
                            data={items}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        onValueChange(item);
                                        setVisible(false);
                                    }}
                                    style={{
                                        paddingVertical: 12,
                                        paddingHorizontal: 8,
                                        borderBottomWidth: 1,
                                        borderBottomColor: "#e5e7eb",
                                    }}
                                >
                                    <Text style={{ fontSize: 16 }}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}
