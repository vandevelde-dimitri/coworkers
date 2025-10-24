import { StyleSheet } from "react-native";

export const accountStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    content: {
        padding: 16,
    },
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: "500",
        color: "#a69f9f",
        marginBottom: 8,
        textTransform: "uppercase",
    },
    sectionBody: {
        backgroundColor: "#fff",
        borderRadius: 12,
        elevation: 2,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 14,
        borderBottomWidth: 1,
        borderColor: "#f0f0f0",
        height: 48,
    },
    rowLabel: {
        fontSize: 16,
        color: "#000",
    },
    rowValue: {
        fontSize: 16,
        color: "#666",
    },
});
