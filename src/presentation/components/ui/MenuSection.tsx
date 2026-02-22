import { StyleSheet, Text, View } from "react-native";

export function MenuSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <View style={styles.menuSection}>
            <Text style={styles.menuTitle}>{title}</Text>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    menuSection: { marginBottom: 30 },
    menuTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 15,
    },
});
