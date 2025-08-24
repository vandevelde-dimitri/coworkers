import { StyleSheet } from "react-native";

export const containerStyles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: "center",
        padding: 20,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        // justifyContent: "space-between",
        marginBottom: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#000",
    },
    headerBack: {
        padding: 8,
        paddingBottom: 0,
        paddingTop: 24,
        position: "relative",
        marginLeft: -16,
        paddingHorizontal: 24,
    },
    bottomButton: {
        marginTop: "auto",
    },
});
