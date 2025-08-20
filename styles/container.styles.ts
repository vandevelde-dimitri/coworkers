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
        justifyContent: "space-between",
        marginBottom: 12,
    },
    headerTitle: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: 16,
        paddingRight: 16,
    },
    headerBack: {
        padding: 8,
        paddingBottom: 0,
        paddingTop: 0,
        position: "relative",
        marginLeft: -16,
    },
    bottomButton: {
        marginTop: "auto", // 👈 pousse vers le bas
    },
});
