import { StyleSheet } from "react-native";

export const containerStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
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
    headerEdit: {
        position: "absolute",
        right: 0,
        height: "100%",
        justifyContent: "center",
        paddingRight: 12,
    },
    bottomButton: {
        marginTop: "auto",
    },
});
