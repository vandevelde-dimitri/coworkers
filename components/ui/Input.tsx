import { StyleSheet, Text, TextInput, View } from "react-native";

export default function Input({ title }) {
    return (
        <View>
            <Text style={styles.title}>{title}</Text>

            <TextInput
                style={styles.input}
                value="toto"
                placeholder={"placeholder"}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: "center",
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 28,
        fontWeight: "semibold",
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 18,
        color: "#555",
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
});
