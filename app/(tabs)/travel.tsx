import { StyleSheet, View, Text } from 'react-native';

export default function TravelScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Travel</Text>
            <Text style={styles.subtitle}>Welcome to Travel Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
});