import AnnouncementCardListItem from "@/components/ui/AnnouncementCardListItem";
import { MOCK_ANNOUNCEMENTS } from "@/src/mocks/announcements";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SymbolView } from "expo-symbols";
import React from "react";
import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function HomeScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <View style={styles.header}>
                <Text style={styles.mainTitle}>Annonces disponibles</Text>
                <View style={styles.searchBar}>
                    <SymbolView
                        name="magnifyingglass"
                        size={18}
                        tintColor="#999"
                    />
                    <TextInput
                        placeholder="Rechercher une ville..."
                        style={styles.searchInput}
                    />
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filterList}
                >
                    <TouchableOpacity
                        style={[styles.filterBtn, styles.filterBtnActive]}
                    >
                        <Text style={styles.filterTextActive}>Plus récent</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterBtn}>
                        <Text style={styles.filterText}>Places</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterBtn}>
                        <Text style={styles.filterText}>Près de moi</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            <FlatList
                data={MOCK_ANNOUNCEMENTS}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <AnnouncementCardListItem item={item} />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8F9FA" },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        backgroundColor: "#FFF",
        paddingBottom: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 4,
    },
    mainTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: "#1A1A1A",
        textAlign: "center",
        marginBottom: 20,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F1F3F5",
        borderRadius: 15,
        paddingHorizontal: 15,
        height: 50,
    },
    searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
    filterList: { marginTop: 15 },
    filterBtn: {
        backgroundColor: "#E9ECEF",
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 12,
        marginRight: 10,
    },
    filterBtnActive: { backgroundColor: "#228BE6" },
    filterText: { fontWeight: "600", color: "#495057" },
    filterTextActive: { color: "#FFF", fontWeight: "600" },
    listContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 130,
    },
});
