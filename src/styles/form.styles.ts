import { StyleSheet } from "react-native";

export const formAuthStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#fff",
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 24,
        textAlign: "center",
    },
    form: { gap: 16 },
    input: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#d1d5db",
        backgroundColor: "#f9fafb",
        fontSize: 16,
        color: "#111827",
    },
    buttonPrimary: {
        backgroundColor: "#10B981",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 8,
    },
    buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
    link: {
        textAlign: "center",
        color: "#10B981",
        fontWeight: "500",
        marginTop: 12,
    },
    error: {
        color: "#ff0000",
        fontSize: 14,
    },
});
