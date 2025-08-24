import { StyleSheet } from "react-native";

export const containerStyles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: "center",
        padding: 20,
        backgroundColor: "#fff",
    },
    header: {
        height: 60,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    headerBack: {
        position: "absolute",
        left: 0,
        height: "100%",
        justifyContent: "center",
        paddingLeft: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1D2A32",
    },
    bottomButton: {
        marginTop: "auto",
    },
});
