import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
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

      <Modal visible={visible} transparent animationType="slide">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>Sélectionner un centre</Text>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  accessible={true}
                  accessibilityLabel={item.label}
                  accessibilityRole="radio"
                  accessibilityState={{
                    selected: item.value === selectedValue,
                  }}
                  onPress={() => {
                    onSelect(item.value);
                    setVisible(false);
                  }}
                  style={[
                    styles.optionItem,
                    item.value === selectedValue && styles.optionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item.value === selectedValue && styles.optionTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.value === selectedValue && (
                    <Ionicons name="checkmark-circle" size={22} color="#FFF" />
                  )}
                </TouchableOpacity>
              )}
            />
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
