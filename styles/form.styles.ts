import { StyleSheet } from "react-native";

export const formAuthStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 32,
        fontWeight: "semibold",
    },
    subtitle: {
        fontSize: 15,
        fontWeight: "500",
        marginBottom: 24,
        color: "#929292",
    },
    input: {
        paddingVertical: 20,
        paddingHorizontal: 14,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "blue",
        padding: 12,
        marginBottom: 16,
    },
    btn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        backgroundColor: "#075eec",
        borderColor: "#075eec",
    },
    btnText: {
        fontSize: 18,
        lineHeight: 26,
        fontWeight: "600",
        color: "#fff",
    },
    error: {
        color: "#ff0000",
        fontSize: 14,
        marginBottom: 8,
    },
    link: {
        color: "#075eec",
        fontSize: 16,
        fontWeight: "500",
        marginTop: 16,
    },
});
