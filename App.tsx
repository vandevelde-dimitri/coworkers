import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    Alert,
    FlatList,
    Image,
    Modal,
    Platform,
    ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import AppNavigator from "./src/AppNavigator";
import { AuthProvider } from "./src/contexts/authContext";
import { MessageProvider } from "./src/contexts/messageContext";

/* ---------------- UI COMPONENTS ---------------- */
const Card = ({ children }) => (
    <View
        style={{
            backgroundColor: "#fff",
            borderRadius: 18,
            padding: 16,
            marginBottom: 14,
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowRadius: 10,
        }}
    >
        {children}
    </View>
);

const Avatar = ({ uri }) => (
    <Image
        source={{ uri }}
        style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: "#e5e7eb",
        }}
    />
);

/* ---------------- WELCOME SCREEN ---------------- */
function WelcomeScreen() {
    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: "#f3f4f6" }}
            contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 16,
            }}
        >
            {/* Logo */}
            <View style={{ marginBottom: 32, alignItems: "center" }}>
                <Image
                    source={require("./assets/logo.png")}
                    style={{ width: 180, height: 180, marginBottom: 16 }}
                    resizeMode="contain"
                />
                <Text
                    style={{
                        fontSize: 28,
                        fontWeight: "700",
                        color: "#2563eb",
                    }}
                >
                    Coworkers
                </Text>
                <Text
                    style={{
                        color: "#6b7280",
                        fontSize: 16,
                        marginTop: 4,
                        textAlign: "center",
                    }}
                >
                    Trouvez un covoiturage facilement entre collègues Amazon
                    France
                </Text>
            </View>

            {/* Boutons */}
            <View style={{ width: "100%" }}>
                <TouchableOpacity
                    style={{
                        backgroundColor: "#2563eb",
                        paddingVertical: 16,
                        borderRadius: 18,
                        alignItems: "center",
                        marginBottom: 16,
                    }}
                >
                    <Text
                        style={{
                            color: "#fff",
                            fontWeight: "700",
                            fontSize: 16,
                        }}
                    >
                        Commencer
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        paddingVertical: 16,
                        borderRadius: 18,
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: "#2563eb",
                    }}
                >
                    <Text
                        style={{
                            color: "#2563eb",
                            fontWeight: "700",
                            fontSize: 16,
                        }}
                    >
                        Créer un compte
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

/* ---------------- CUSTOM PICKER ---------------- */
function CustomPicker({ label, selectedValue, onValueChange, items }) {
    const [visible, setVisible] = useState(false);

    return (
        <View style={{ marginBottom: 12 }}>
            <Text style={{ marginBottom: 6, fontWeight: "600" }}>{label}</Text>

            <TouchableOpacity
                onPress={() => setVisible(true)}
                style={{
                    padding: 12,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    backgroundColor: "#f9fafb",
                }}
            >
                <Text style={{ color: selectedValue ? "#374151" : "#9ca3af" }}>
                    {selectedValue || `Sélectionnez ${label.toLowerCase()}`}
                </Text>
            </TouchableOpacity>

            <Modal visible={visible} transparent animationType="slide">
                <TouchableOpacity
                    onPress={() => setVisible(false)}
                    style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)" }}
                >
                    <View
                        style={{
                            backgroundColor: "#fff",
                            marginHorizontal: 32,
                            marginTop: 200,
                            borderRadius: 18,
                            padding: 16,
                            maxHeight: 250,
                        }}
                    >
                        <FlatList
                            data={items}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        onValueChange(item);
                                        setVisible(false);
                                    }}
                                    style={{
                                        paddingVertical: 12,
                                        paddingHorizontal: 8,
                                        borderBottomWidth: 1,
                                        borderBottomColor: "#e5e7eb",
                                    }}
                                >
                                    <Text style={{ fontSize: 16 }}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

/* ---------------- HOME ---------------- */
function HomeScreen() {
    const [sortBy, setSortBy] = useState("date");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

    const rides = [
        {
            id: "1",
            title: "Matin Amazon Lille",
            from: "Lille",
            to: "Amazon Lauwin-Planque",
            date: "2026-01-12T08:00",
            seats: 2,
            user: {
                name: "Jean Dupont",
                avatar: "https://i.pravatar.cc/150?img=12",
            },
        },
        {
            id: "2",
            title: "Soir Amazon Douai",
            from: "Douai",
            to: "Amazon Lauwin-Planque",
            date: "2026-01-11T18:00",
            seats: 3,
            user: {
                name: "Alice Martin",
                avatar: "https://i.pravatar.cc/150?img=32",
            },
        },
        {
            id: "3",
            title: "Midi Amazon Lille",
            from: "Lille",
            to: "Amazon Lauwin-Planque",
            date: "2026-01-13T12:00",
            seats: 1,
            user: {
                name: "Marc Leroy",
                avatar: "https://i.pravatar.cc/150?img=45",
            },
        },
        {
            id: "4",
            title: "Soir Amazon Lens",
            from: "Lens",
            to: "Amazon Lauwin-Planque",
            date: "2026-01-14T18:30",
            seats: 4,
            user: {
                name: "Sophie Dubois",
                avatar: "https://i.pravatar.cc/150?img=56",
            },
        },
        {
            id: "5",
            title: "Matin Amazon Douai",
            from: "Douai",
            to: "Amazon Lauwin-Planque",
            date: "2026-01-15T08:00",
            seats: 2,
            user: {
                name: "Paul Martin",
                avatar: "https://i.pravatar.cc/150?img=21",
            },
        },
        {
            id: "6",
            title: "Soir Amazon Lille",
            from: "Lille",
            to: "Amazon Lauwin-Planque",
            date: "2026-01-16T18:00",
            seats: 3,
            user: {
                name: "Laura Petit",
                avatar: "https://i.pravatar.cc/150?img=33",
            },
        },
    ];

    // Filtrer selon la recherche
    const filteredRides = rides.filter(
        (r) =>
            r.title.toLowerCase().includes(search.toLowerCase()) ||
            r.from.toLowerCase().includes(search.toLowerCase()) ||
            r.to.toLowerCase().includes(search.toLowerCase())
    );

    // Tri selon sortBy
    const sortedRides = [...filteredRides].sort((a, b) => {
        if (sortBy === "date") return new Date(a.date) - new Date(b.date);
        if (sortBy === "seats") return b.seats - a.seats;
        if (sortBy === "from") return a.from.localeCompare(b.from);
        return 0;
    });
    // Pagination
    const totalPages = Math.ceil(sortedRides.length / itemsPerPage);
    const displayedRides = sortedRides.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );
    return (
        <ScrollView style={{ padding: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 16 }}>
                Coworkers
            </Text>

            {/* Input de recherche */}
            <TextInput
                placeholder="Rechercher une annonce..."
                value={search}
                onChangeText={setSearch}
                style={{
                    backgroundColor: "#f3f4f6",
                    borderRadius: 16,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    fontSize: 15,
                    marginBottom: 16,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                }}
            />

            {/* Boutons de tri */}
            <View
                style={{
                    flexDirection: "row",
                    marginBottom: 16,
                    flexWrap: "wrap",
                }}
            >
                {[
                    { label: "Plus récent", value: "date" },
                    { label: "Places", value: "seats" },
                    // { label: "Popularité", value: "popularity" },
                    { label: "Près de moi", value: "from" },
                ].map((option) => (
                    <TouchableOpacity
                        key={option.value}
                        onPress={() => setSortBy(option.value)}
                        style={{
                            backgroundColor:
                                sortBy === option.value ? "#2563eb" : "#e5e7eb",
                            paddingVertical: 8,
                            paddingHorizontal: 12,
                            borderRadius: 12,
                            marginRight: 8,
                            marginBottom: 8,
                        }}
                    >
                        <Text
                            style={{
                                color:
                                    sortBy === option.value
                                        ? "#fff"
                                        : "#374151",
                                fontWeight: "600",
                            }}
                        >
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {sortedRides.map((ride) => (
                <Card key={ride.id}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 8,
                        }}
                    >
                        <Avatar uri={ride.user.avatar} />
                        <View style={{ marginLeft: 12 }}>
                            <Text style={{ fontWeight: "600" }}>
                                {ride.user.name}
                            </Text>
                            <Text style={{ fontSize: 12, color: "#6b7280" }}>
                                {new Date(ride.date).toLocaleString()}
                            </Text>
                        </View>
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: "700" }}>
                        {ride.title}
                    </Text>
                    <Text style={{ marginTop: 4, color: "#374151" }}>
                        {ride.from} → {ride.to}
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: 12,
                        }}
                    >
                        <Text>Places: {ride.seats}</Text>
                        <TouchableOpacity>
                            <Text
                                style={{ color: "#2563eb", fontWeight: "600" }}
                            >
                                Voir détails
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            ))}
            {/* Pagination avec flèches */}
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginTop: 12,
                    marginBottom: 24,
                    flexWrap: "wrap",
                    alignItems: "center",
                }}
            >
                <TouchableOpacity
                    onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
                    style={{
                        padding: 10,
                        margin: 4,
                        borderRadius: 12,
                        backgroundColor: "#e5e7eb",
                    }}
                >
                    <Text style={{ fontWeight: "600" }}>{"<"}</Text>
                </TouchableOpacity>
                {Array.from({ length: totalPages }, (_, i) => (
                    <TouchableOpacity
                        key={i + 1}
                        onPress={() => setPage(i + 1)}
                        style={{
                            padding: 10,
                            margin: 4,
                            borderRadius: 12,
                            backgroundColor:
                                page === i + 1 ? "#2563eb" : "#e5e7eb",
                        }}
                    >
                        <Text
                            style={{
                                color: page === i + 1 ? "#fff" : "#374151",
                                fontWeight: "600",
                            }}
                        >
                            {i + 1}
                        </Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity
                    onPress={() =>
                        setPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    style={{
                        padding: 10,
                        margin: 4,
                        borderRadius: 12,
                        backgroundColor: "#e5e7eb",
                    }}
                >
                    <Text style={{ fontWeight: "600" }}>{">"}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

/* ---------------- RIDE DETAILS ---------------- */
function RideDetailsScreen() {
    return (
        <ScrollView style={{ padding: 16 }}>
            <Card>
                <Text
                    style={{ fontSize: 20, fontWeight: "700", marginBottom: 6 }}
                >
                    Matin Amazon Lille
                </Text>
                <Text style={{ color: "#374151" }}>
                    Lille → Amazon Lauwin-Planque
                </Text>
                <Text style={{ marginTop: 6, color: "#6b7280" }}>
                    Départ : 12 Jan · 08:00
                </Text>
                <Text style={{ marginTop: 6 }}>Places disponibles : 2</Text>
            </Card>

            <Card>
                <Text style={{ fontWeight: "600", marginBottom: 10 }}>
                    Conducteur
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Avatar uri="https://i.pravatar.cc/150?img=12" />
                    <View style={{ marginLeft: 12 }}>
                        <Text style={{ fontWeight: "600" }}>Jean Dupont</Text>
                        <Text style={{ fontSize: 12, color: "#6b7280" }}>
                            jean@amazon.fr
                        </Text>
                    </View>
                </View>
            </Card>

            <Card>
                <Text style={{ fontWeight: "600", marginBottom: 10 }}>
                    Participants
                </Text>
                {[1, 2].map((p) => (
                    <View
                        key={p}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 12,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Avatar
                                uri={`https://i.pravatar.cc/150?img=${30 + p}`}
                            />
                            <View style={{ marginLeft: 12 }}>
                                <Text style={{ fontWeight: "500" }}>
                                    Participant {p}
                                </Text>
                                <Text
                                    style={{ fontSize: 12, color: "#22c55e" }}
                                >
                                    Accepté
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={{
                                backgroundColor: "#fee2e2",
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderRadius: 10,
                            }}
                        >
                            <Text
                                style={{
                                    color: "#ef4444",
                                    fontSize: 12,
                                    fontWeight: "600",
                                }}
                            >
                                Retirer
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </Card>

            <TouchableOpacity
                style={{
                    backgroundColor: "#2563eb",
                    padding: 16,
                    borderRadius: 16,
                    marginBottom: 10,
                }}
            >
                <Text
                    style={{
                        color: "#fff",
                        textAlign: "center",
                        fontWeight: "600",
                    }}
                >
                    Postuler
                </Text>
            </TouchableOpacity>

            <Text
                style={{
                    textAlign: "center",
                    marginBottom: 10,
                    color: "#6b7280",
                }}
            >
                Statut : En attente
            </Text>

            <TouchableOpacity
                style={{
                    backgroundColor: "#f59e0b",
                    padding: 16,
                    borderRadius: 16,
                    marginBottom: 10,
                }}
            >
                <Text
                    style={{
                        color: "#fff",
                        textAlign: "center",
                        fontWeight: "600",
                    }}
                >
                    Modifier
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={{
                    backgroundColor: "#ef4444",
                    padding: 16,
                    borderRadius: 16,
                }}
            >
                <Text
                    style={{
                        color: "#fff",
                        textAlign: "center",
                        fontWeight: "600",
                    }}
                >
                    Supprimer
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

/* ---------------- NOTIFICATIONS ---------------- */
function NotificationsScreen() {
    const requests = [
        {
            id: "1",
            type: "request",
            title: "Demande de participation",
            name: "Jean Dupont",
            candidate_image: "https://i.pravatar.cc/150?img=12",
        },
        {
            id: "2",
            type: "info",
            title: "Nouvelle annonce disponible",
            name: "Alice Martin",
            candidate_image: "https://i.pravatar.cc/150?img=32",
        },
        {
            annonce_id: "2a7a57ec-f745-4640-ab6d-4b826f7d4dff",
            annonce_title: "Annonce de john doe",
            candidate_firstname: "dim",
            candidate_id: "0a70e947-cdde-4379-a545-def6f5078afd",
            candidate_image: null,
            candidate_lastname: "Vandevelde ",
            created_at: "2026-01-07T17:29:34.119265+00:00",
            id: "0114718f-6113-4b30-b0ef-1d487301adc0",
            status: "accepted",
        },
    ];
    return (
        <ScrollView style={{ padding: 16 }}>
            <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 16 }}>
                Notifications
            </Text>
            {requests.map((r) => (
                <Card key={r.id}>
                    <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                    >
                        <Avatar uri={r.candidate_image} />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={{ fontWeight: "600" }}>{r.name}</Text>
                            <Text style={{ fontSize: 12, color: "#6b7280" }}>
                                {r.title}
                            </Text>
                        </View>
                    </View>
                    {r.type === "request" && (
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginTop: 12,
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    backgroundColor: "#22c55e",
                                    padding: 10,
                                    borderRadius: 12,
                                    flex: 1,
                                    marginRight: 6,
                                }}
                            >
                                <Text
                                    style={{
                                        color: "#fff",
                                        textAlign: "center",
                                    }}
                                >
                                    Accepter
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: "#ef4444",
                                    padding: 10,
                                    borderRadius: 12,
                                    flex: 1,
                                    marginLeft: 6,
                                }}
                            >
                                <Text
                                    style={{
                                        color: "#fff",
                                        textAlign: "center",
                                    }}
                                >
                                    Refuser
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Card>
            ))}
        </ScrollView>
    );
}

/* ---------------- CONVERSATIONS ---------------- */
function ConversationsScreen() {
    const conversations = [
        {
            id: "1",
            title: "Matin Amazon Lille",
            lastMessage: "Oui, il reste une place",
            time: "09:42",
            unread: 2,
            avatar: "https://i.pravatar.cc/150?img=12",
        },
        {
            id: "2",
            title: "Soir Amazon Douai",
            lastMessage: "Merci pour l'info",
            time: "Hier",
            unread: 0,
            avatar: "https://i.pravatar.cc/150?img=32",
        },
    ];
    return (
        <ScrollView style={{ padding: 16 }}>
            <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 16 }}>
                Messages
            </Text>
            {conversations.map((c) => (
                <TouchableOpacity key={c.id}>
                    <Card>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Avatar uri={c.avatar} />
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={{ fontWeight: "600" }}>
                                    {c.title}
                                </Text>
                                <Text
                                    numberOfLines={1}
                                    style={{ color: "#6b7280", fontSize: 13 }}
                                >
                                    {c.lastMessage}
                                </Text>
                            </View>
                            <View style={{ alignItems: "flex-end" }}>
                                <Text
                                    style={{ fontSize: 12, color: "#6b7280" }}
                                >
                                    {c.time}
                                </Text>
                                {c.unread > 0 && (
                                    <View
                                        style={{
                                            backgroundColor: "#2563eb",
                                            borderRadius: 5,
                                            minWidth: 10,
                                            minHeight: 10,
                                            paddingHorizontal: 6,
                                            marginTop: 6,
                                        }}
                                    ></View>
                                )}
                            </View>
                        </View>
                    </Card>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

/* ---------------- ONBOARDING ---------------- */
function OnboardingScreen({ navigation }) {
    const [step, setStep] = useState(1);

    // Données utilisateur
    const [prenom, setPrenom] = useState("");
    const [nom, setNom] = useState("");
    const [ville, setVille] = useState("");
    const [team, setTeam] = useState("");
    const [centre, setCentre] = useState("");
    const [contrat, setContrat] = useState("");

    const centres = [
        "Amazon Lauwin-Planque",
        "Amazon Boves",
        "Amazon Montélimar",
    ];
    const contrats = ["CDI", "Intérim"];

    const handleNext = () => {
        if (step === 1 && (!prenom || !nom)) {
            Alert.alert("Erreur", "Veuillez remplir votre prénom et nom.");
            return;
        }
        if (step === 2 && (!ville || !team)) {
            Alert.alert("Erreur", "Veuillez remplir votre ville et team.");
            return;
        }
        if (step === 3 && (!centre || !contrat)) {
            Alert.alert(
                "Erreur",
                "Veuillez choisir votre centre et type de contrat."
            );
            return;
        }

        if (step < 3) setStep(step + 1);
        else {
            // Fin de l'onboarding
            Alert.alert("Succès", "Profil complété !");
            // navigation.navigate('Home'); // rediriger vers home
        }
    };

    const handlePrev = () => {
        if (step > 1) setStep(step - 1);
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <View
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: 18,
                            padding: 16,
                            shadowColor: "#000",
                            shadowOpacity: 0.05,
                            shadowRadius: 6,
                            marginBottom: 24,
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: "700",
                                fontSize: 18,
                                marginBottom: 12,
                            }}
                        >
                            Vos informations personnelles
                        </Text>
                        <TextInput
                            placeholder="Prénom"
                            value={prenom}
                            onChangeText={setPrenom}
                            style={{
                                borderBottomWidth: 1,
                                borderBottomColor: "#e5e7eb",
                                marginBottom: 12,
                                fontSize: 16,
                                paddingVertical: 6,
                            }}
                        />
                        <TextInput
                            placeholder="Nom"
                            value={nom}
                            onChangeText={setNom}
                            style={{
                                borderBottomWidth: 1,
                                borderBottomColor: "#e5e7eb",
                                marginBottom: 12,
                                fontSize: 16,
                                paddingVertical: 6,
                            }}
                        />
                    </View>
                );
            case 2:
                return (
                    <View
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: 18,
                            padding: 16,
                            shadowColor: "#000",
                            shadowOpacity: 0.05,
                            shadowRadius: 6,
                            marginBottom: 24,
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: "700",
                                fontSize: 18,
                                marginBottom: 12,
                            }}
                        >
                            Informations professionnelles
                        </Text>
                        <TextInput
                            placeholder="Ville"
                            value={ville}
                            onChangeText={setVille}
                            style={{
                                borderBottomWidth: 1,
                                borderBottomColor: "#e5e7eb",
                                marginBottom: 12,
                                fontSize: 16,
                                paddingVertical: 6,
                            }}
                        />
                        <TextInput
                            placeholder="Team"
                            value={team}
                            onChangeText={setTeam}
                            style={{
                                borderBottomWidth: 1,
                                borderBottomColor: "#e5e7eb",
                                marginBottom: 12,
                                fontSize: 16,
                                paddingVertical: 6,
                            }}
                        />
                    </View>
                );
            case 3:
                return (
                    <View
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: 18,
                            padding: 16,
                            shadowColor: "#000",
                            shadowOpacity: 0.05,
                            shadowRadius: 6,
                            marginBottom: 24,
                        }}
                    >
                        <CustomPicker
                            label="Centre Amazon"
                            selectedValue={centre}
                            onValueChange={setCentre}
                            items={[
                                "Amazon Lauwin-Planque",
                                "Amazon Boves",
                                "Amazon Montélimar",
                            ]}
                        />

                        <CustomPicker
                            label="Type de contrat"
                            selectedValue={contrat}
                            onValueChange={setContrat}
                            items={["CDI", "Intérim"]}
                        />
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <ScrollView
            style={{ flex: 1, padding: 16, backgroundColor: "#f3f4f6" }}
        >
            <Text
                style={{
                    fontSize: 24,
                    fontWeight: "700",
                    marginBottom: 24,
                    textAlign: "center",
                }}
            >
                Onboarding
            </Text>
            {renderStep()}

            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                {step > 1 && (
                    <TouchableOpacity
                        onPress={handlePrev}
                        style={{
                            flex: 1,
                            backgroundColor: "#d1d5db",
                            padding: 14,
                            borderRadius: 18,
                            marginRight: 8,
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ fontWeight: "700", color: "#374151" }}>
                            Précédent
                        </Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    onPress={handleNext}
                    style={{
                        flex: 1,
                        backgroundColor: "#2563eb",
                        padding: 14,
                        borderRadius: 18,
                        marginLeft: step > 1 ? 8 : 0,
                        alignItems: "center",
                    }}
                >
                    <Text style={{ fontWeight: "700", color: "#fff" }}>
                        {step === 3 ? "Terminer" : "Suivant"}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

/* ---------------- LOGIN ---------------- */
function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        // Appel API ou supabase login
        if (!email || !password) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs.");
            return;
        }
        Alert.alert("Succès", "Connexion réussie !");
        // navigation.navigate('Home'); // rediriger vers Home après login
    };

    return (
        <ScrollView
            style={{ flex: 1, padding: 16, backgroundColor: "#f3f4f6" }}
        >
            <Text
                style={{
                    fontSize: 28,
                    fontWeight: "700",
                    marginBottom: 32,
                    textAlign: "center",
                }}
            >
                Se connecter
            </Text>

            <View
                style={{
                    backgroundColor: "#fff",
                    borderRadius: 18,
                    padding: 16,
                    marginBottom: 24,
                    shadowColor: "#000",
                    shadowOpacity: 0.05,
                    shadowRadius: 6,
                }}
            >
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    style={{
                        borderBottomWidth: 1,
                        borderBottomColor: "#e5e7eb",
                        marginBottom: 16,
                        fontSize: 16,
                        paddingVertical: 8,
                    }}
                />
                <TextInput
                    placeholder="Mot de passe"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={{
                        borderBottomWidth: 1,
                        borderBottomColor: "#e5e7eb",
                        marginBottom: 16,
                        fontSize: 16,
                        paddingVertical: 8,
                    }}
                />

                <TouchableOpacity
                    onPress={handleLogin}
                    style={{
                        backgroundColor: "#2563eb",
                        paddingVertical: 14,
                        borderRadius: 18,
                        alignItems: "center",
                        marginTop: 8,
                    }}
                >
                    <Text
                        style={{
                            color: "#fff",
                            fontWeight: "700",
                            fontSize: 16,
                        }}
                    >
                        Se connecter
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ marginTop: 16, alignItems: "center" }}
                >
                    <Text style={{ color: "#2563eb", fontWeight: "600" }}>
                        Créer un compte
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() =>
                        Alert.alert(
                            "Mot de passe oublié",
                            "Fonctionnalité à implémenter"
                        )
                    }
                    style={{ marginTop: 8, alignItems: "center" }}
                >
                    <Text style={{ color: "#6b7280" }}>
                        Mot de passe oublié ?
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

/* ---------------- REGISTER ---------------- */
function RegisterScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = () => {
        if (!email || !password) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs.");
            return;
        }
        Alert.alert("Succès", "Inscription réussie !");
        // navigation.navigate('Login'); // rediriger vers login après inscription
    };

    return (
        <ScrollView
            style={{ flex: 1, padding: 16, backgroundColor: "#f3f4f6" }}
        >
            <Text
                style={{
                    fontSize: 28,
                    fontWeight: "700",
                    marginBottom: 32,
                    textAlign: "center",
                }}
            >
                Créer un compte
            </Text>

            <View
                style={{
                    backgroundColor: "#fff",
                    borderRadius: 18,
                    padding: 16,
                    marginBottom: 24,
                    shadowColor: "#000",
                    shadowOpacity: 0.05,
                    shadowRadius: 6,
                }}
            >
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    style={{
                        borderBottomWidth: 1,
                        borderBottomColor: "#e5e7eb",
                        marginBottom: 16,
                        fontSize: 16,
                        paddingVertical: 8,
                    }}
                />
                <TextInput
                    placeholder="Mot de passe"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={{
                        borderBottomWidth: 1,
                        borderBottomColor: "#e5e7eb",
                        marginBottom: 16,
                        fontSize: 16,
                        paddingVertical: 8,
                    }}
                />

                <TouchableOpacity
                    onPress={handleRegister}
                    style={{
                        backgroundColor: "#2563eb",
                        paddingVertical: 14,
                        borderRadius: 18,
                        alignItems: "center",
                        marginTop: 8,
                    }}
                >
                    <Text
                        style={{
                            color: "#fff",
                            fontWeight: "700",
                            fontSize: 16,
                        }}
                    >
                        S'inscrire
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ marginTop: 16, alignItems: "center" }}
                >
                    <Text style={{ color: "#2563eb", fontWeight: "600" }}>
                        Déjà un compte ? Se connecter
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

/* ---------------- SETTINGS ---------------- */
function SettingsScreen() {
    const unreadCount = 0; // exemple, badge si besoin

    // Données utilisateur modifiables
    const [prenom, setPrenom] = useState("Jean");
    const [nom, setNom] = useState("Dupont");
    const [team, setTeam] = useState("Equipe A");
    const [ville, setVille] = useState("Lille");
    const [centre, setCentre] = useState("Amazon Lauwin-Planque");
    const [email, setEmail] = useState("jean.dupont@email.com");
    const [password, setPassword] = useState(""); // pour modifier
    const [pushNotifications, setPushNotifications] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [vehiculer, setVehiculer] = useState(true);
    const [disponible, setDisponible] = useState(true);

    const Card = ({ children }) => (
        <View
            style={{
                backgroundColor: "#fff",
                borderRadius: 18,
                padding: 16,
                marginBottom: 16,
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 6,
            }}
        >
            {children}
        </View>
    );

    const handleSave = () => {
        // Ici tu peux appeler ton API pour sauvegarder les données
        Alert.alert("Succès", "Vos informations ont été mises à jour.");
    };

    return (
        <ScrollView style={{ padding: 16, backgroundColor: "#f3f4f6" }}>
            <CustomHeader title="Paramètres" unreadCount={unreadCount} />

            {/* Infos personnelles */}
            <Card>
                <Text
                    style={{
                        fontWeight: "700",
                        fontSize: 16,
                        marginBottom: 12,
                    }}
                >
                    Informations personnelles
                </Text>
                <TextInput
                    placeholder="Prénom"
                    value={prenom}
                    onChangeText={setPrenom}
                    style={{
                        borderBottomWidth: 1,
                        borderBottomColor: "#e5e7eb",
                        marginBottom: 12,
                        fontSize: 16,
                        paddingVertical: 6,
                    }}
                />
                <TextInput
                    placeholder="Nom"
                    value={nom}
                    onChangeText={setNom}
                    style={{
                        borderBottomWidth: 1,
                        borderBottomColor: "#e5e7eb",
                        marginBottom: 12,
                        fontSize: 16,
                        paddingVertical: 6,
                    }}
                />
                <TextInput
                    placeholder="Team"
                    value={team}
                    onChangeText={setTeam}
                    style={{
                        borderBottomWidth: 1,
                        borderBottomColor: "#e5e7eb",
                        marginBottom: 12,
                        fontSize: 16,
                        paddingVertical: 6,
                    }}
                />
                <TextInput
                    placeholder="Ville"
                    value={ville}
                    onChangeText={setVille}
                    style={{
                        borderBottomWidth: 1,
                        borderBottomColor: "#e5e7eb",
                        marginBottom: 12,
                        fontSize: 16,
                        paddingVertical: 6,
                    }}
                />
                <TextInput
                    placeholder="Centre Amazon"
                    value={centre}
                    onChangeText={setCentre}
                    style={{
                        borderBottomWidth: 1,
                        borderBottomColor: "#e5e7eb",
                        marginBottom: 12,
                        fontSize: 16,
                        paddingVertical: 6,
                    }}
                />
            </Card>

            {/* Email & Mot de passe */}
            <Card>
                <Text
                    style={{
                        fontWeight: "700",
                        fontSize: 16,
                        marginBottom: 12,
                    }}
                >
                    Compte
                </Text>
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    style={{
                        borderBottomWidth: 1,
                        borderBottomColor: "#e5e7eb",
                        marginBottom: 12,
                        fontSize: 16,
                        paddingVertical: 6,
                    }}
                />
                <TextInput
                    placeholder="Mot de passe"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={{
                        borderBottomWidth: 1,
                        borderBottomColor: "#e5e7eb",
                        marginBottom: 12,
                        fontSize: 16,
                        paddingVertical: 6,
                    }}
                />
            </Card>

            {/* Paramètres / switchs */}
            <Card>
                <Text
                    style={{
                        fontWeight: "700",
                        fontSize: 16,
                        marginBottom: 12,
                    }}
                >
                    Paramètres
                </Text>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8,
                    }}
                >
                    <Text style={{ fontSize: 16 }}>Notifications push</Text>
                    <Switch
                        value={pushNotifications}
                        onValueChange={setPushNotifications}
                        thumbColor={pushNotifications ? "#2563eb" : "#f4f3f4"}
                        trackColor={{ true: "#bfdbfe", false: "#d1d5db" }}
                    />
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8,
                    }}
                >
                    <Text style={{ fontSize: 16 }}>Notifications email</Text>
                    <Switch
                        value={emailNotifications}
                        onValueChange={setEmailNotifications}
                        thumbColor={emailNotifications ? "#2563eb" : "#f4f3f4"}
                        trackColor={{ true: "#bfdbfe", false: "#d1d5db" }}
                    />
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8,
                    }}
                >
                    <Text style={{ fontSize: 16 }}>Véhiculé</Text>
                    <Switch
                        value={vehiculer}
                        onValueChange={setVehiculer}
                        thumbColor={vehiculer ? "#2563eb" : "#f4f3f4"}
                        trackColor={{ true: "#bfdbfe", false: "#d1d5db" }}
                    />
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Text style={{ fontSize: 16 }}>Disponible</Text>
                    <Switch
                        value={disponible}
                        onValueChange={setDisponible}
                        thumbColor={disponible ? "#2563eb" : "#f4f3f4"}
                        trackColor={{ true: "#bfdbfe", false: "#d1d5db" }}
                    />
                </View>
            </Card>

            {/* Bouton Sauvegarder */}
            <TouchableOpacity
                onPress={handleSave}
                style={{
                    backgroundColor: "#2563eb",
                    paddingVertical: 14,
                    borderRadius: 18,
                    alignItems: "center",
                    marginBottom: 24,
                }}
            >
                <Text
                    style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}
                >
                    Sauvegarder
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

//---------------- CUSTOM HEADER ---------------- */
function CustomHeader({ title, unreadCount = 0 }) {
    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView
            style={[
                {
                    flex: 1,
                    backgroundColor: "#fff",
                    paddingTop: 0,
                    paddingBottom: -insets.bottom, // Pas de padding bottom ici pour permettre le scroll complet
                },
            ]}
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    backgroundColor: "#fff",
                    borderRadius: 18,
                    marginBottom: 16,
                    shadowColor: "#000",
                    shadowOpacity: 0.05,
                    shadowRadius: 6,
                }}
            >
                <Text style={{ fontSize: 22, fontWeight: "700" }}>{title}</Text>

                <TouchableOpacity>
                    <View style={{ position: "relative" }}>
                        <Ionicons
                            name="notifications-outline"
                            size={28}
                            color="#2563eb"
                        />
                        {unreadCount > 0 && (
                            <View
                                style={{
                                    position: "absolute",
                                    top: -4,
                                    right: -4,
                                    backgroundColor: "red",
                                    width: 16,
                                    height: 16,
                                    borderRadius: 8,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Text
                                    style={{
                                        color: "#fff",
                                        fontSize: 10,
                                        fontWeight: "700",
                                    }}
                                >
                                    {unreadCount}
                                </Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

/* ---------------- CHAT ---------------- */
function ChatScreen() {
    const messages = [
        {
            id: "1",
            text: "Salut, il reste une place ?",
            time: "09:40",
            sender: "other",
            avatar: "https://i.pravatar.cc/150?img=32",
        },
        {
            id: "2",
            text: "Oui, une seule 👍",
            time: "09:41",
            sender: "me",
            avatar: "https://i.pravatar.cc/150?img=12",
        },
    ];
    return (
        <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
            <ScrollView style={{ flex: 1, padding: 16 }}>
                {messages.map((msg) => (
                    <View
                        key={msg.id}
                        style={{
                            flexDirection:
                                msg.sender === "me" ? "row-reverse" : "row",
                            alignItems: "flex-end",
                            marginBottom: 12,
                        }}
                    >
                        <Avatar uri={msg.avatar} />
                        <View
                            style={{
                                backgroundColor:
                                    msg.sender === "me" ? "#2563eb" : "#e5e7eb",
                                borderRadius: 16,
                                padding: 12,
                                marginHorizontal: 8,
                                maxWidth: "75%",
                            }}
                        >
                            <Text
                                style={{
                                    color:
                                        msg.sender === "me" ? "#fff" : "#000",
                                }}
                            >
                                {msg.text}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 10,
                                    color:
                                        msg.sender === "me"
                                            ? "#dbeafe"
                                            : "#6b7280",
                                    marginTop: 4,
                                    textAlign: "right",
                                }}
                            >
                                {msg.time}
                            </Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 10,
                    borderTopWidth: 1,
                    borderTopColor: "#e5e7eb",
                    backgroundColor: "#ffffff",
                }}
            >
                <TextInput
                    placeholder="Écrire un message…"
                    placeholderTextColor="#9ca3af"
                    style={{
                        flex: 1,
                        backgroundColor: "#f9fafb",
                        borderRadius: 24,
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        fontSize: 15,
                        borderWidth: 1,
                        borderColor: "#e5e7eb",
                    }}
                />
                <TouchableOpacity
                    style={{
                        marginLeft: 8,
                        backgroundColor: "#2563eb",
                        padding: 12,
                        borderRadius: 24,
                    }}
                >
                    <Ionicons name="send" size={20} color="#ffffff" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

function AddRideScreen({ navigation }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [seats, setSeats] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const handleSubmit = () => {
        if (!title || !description || !seats || !startDate || !endDate) {
            alert("Veuillez remplir tous les champs");
            return;
        }

        console.log({
            title,
            description,
            seats,
            startDate,
            endDate,
        });

        // appel API / Supabase ici
    };

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: "#f3f4f6", padding: 16 }}
        >
            {/* Header maison */}
            <CustomHeader title="Nouvelle annonce" />

            {/* Card formulaire */}
            <View
                style={{
                    backgroundColor: "#fff",
                    borderRadius: 18,
                    padding: 16,
                    marginTop: 16,
                    shadowColor: "#000",
                    shadowOpacity: 0.05,
                    shadowRadius: 6,
                }}
            >
                {/* Titre */}
                <Text style={label}>Titre de l’annonce</Text>
                <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Ex : Lille → Lauwin-Planque"
                    style={input}
                />

                {/* Description */}
                <Text style={label}>Description</Text>
                <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Horaires, lieu précis, conditions..."
                    multiline
                    numberOfLines={4}
                    style={[input, { height: 100, textAlignVertical: "top" }]}
                />

                {/* Places */}
                <Text style={label}>Nombre de places disponibles</Text>
                <TextInput
                    value={seats}
                    onChangeText={setSeats}
                    placeholder="Ex : 3"
                    keyboardType="numeric"
                    style={input}
                />

                {/* Date début */}
                <Text style={label}>Date de début</Text>
                <TouchableOpacity
                    onPress={() => setShowStartPicker(true)}
                    style={dateInput}
                >
                    <Text style={{ color: startDate ? "#111827" : "#9ca3af" }}>
                        {startDate
                            ? startDate.toLocaleString()
                            : "Sélectionner une date"}
                    </Text>
                </TouchableOpacity>

                {showStartPicker && (
                    <DateTimePicker
                        value={startDate || new Date()}
                        mode="datetime"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={(e, date) => {
                            setShowStartPicker(false);
                            if (date) setStartDate(date);
                        }}
                    />
                )}

                {/* Date fin */}
                <Text style={label}>Date de fin</Text>
                <TouchableOpacity
                    onPress={() => setShowEndPicker(true)}
                    style={dateInput}
                >
                    <Text style={{ color: endDate ? "#111827" : "#9ca3af" }}>
                        {endDate
                            ? endDate.toLocaleString()
                            : "Sélectionner une date"}
                    </Text>
                </TouchableOpacity>

                {showEndPicker && (
                    <DateTimePicker
                        value={endDate || new Date()}
                        mode="datetime"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={(e, date) => {
                            setShowEndPicker(false);
                            if (date) setEndDate(date);
                        }}
                    />
                )}

                {/* Bouton */}
                <TouchableOpacity
                    onPress={handleSubmit}
                    style={{
                        backgroundColor: "#2563eb",
                        paddingVertical: 16,
                        borderRadius: 18,
                        alignItems: "center",
                        marginTop: 24,
                    }}
                >
                    <Text
                        style={{
                            color: "#fff",
                            fontWeight: "700",
                            fontSize: 16,
                        }}
                    >
                        Publier l’annonce
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

/* ---------------- PROFILE ---------------- */
function ProfileScreen() {
    const [pushNotifications, setPushNotifications] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [vehiculer, setVehiculer] = useState(true);
    const [disponible, setDisponible] = useState(true);

    const user = {
        nom: "Dupont",
        prenom: "Jean",
        team: "Equipe A",
        ville: "Lille",
        centre: "Amazon Lauwin-Planque",
        membreDepuis: "Janvier 2025",
        avatar: "https://i.pravatar.cc/150?img=12",
    };

    const Card = ({ children }) => (
        <View
            style={{
                backgroundColor: "#fff",
                borderRadius: 18,
                padding: 16,
                marginBottom: 16,
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 6,
            }}
        >
            {children}
        </View>
    );

    const Link = ({ title }) => (
        <TouchableOpacity
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 14,
            }}
        >
            <Text style={{ fontWeight: "600", color: "#2563eb", fontSize: 16 }}>
                {title}
            </Text>
            <Text style={{ color: "#2563eb", fontWeight: "600" }}>{">"}</Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={{ padding: 16, backgroundColor: "#f3f4f6" }}>
            {/* Header Profil */}
            <CustomHeader title="Mon profil" unreadCount={"2"} />
            <View style={{ alignItems: "center", marginBottom: 24 }}>
                <Image
                    source={{ uri: user.avatar }}
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        marginBottom: 12,
                    }}
                />
                <Text style={{ fontSize: 22, fontWeight: "700" }}>
                    {user.prenom} {user.nom}
                </Text>
                <Text style={{ color: "#6b7280", marginTop: 4 }}>
                    {user.team} • {user.ville}
                </Text>
            </View>

            {/* Informations personnelles */}
            <Card>
                <Text
                    style={{
                        fontWeight: "700",
                        fontSize: 16,
                        marginBottom: 12,
                    }}
                >
                    Informations personnelles
                </Text>
                <Text style={{ color: "#374151", marginBottom: 6 }}>
                    Nom : {user.nom}
                </Text>
                <Text style={{ color: "#374151", marginBottom: 6 }}>
                    Prénom : {user.prenom}
                </Text>
                <Text style={{ color: "#374151", marginBottom: 6 }}>
                    Team : {user.team}
                </Text>
                <Text style={{ color: "#374151", marginBottom: 6 }}>
                    Ville : {user.ville}
                </Text>
                <Text style={{ color: "#374151", marginBottom: 6 }}>
                    Centre Amazon : {user.centre}
                </Text>
                <Text style={{ color: "#374151" }}>
                    Membre depuis : {user.membreDepuis}
                </Text>
            </Card>

            {/* Paramètres */}
            <Card>
                <Text
                    style={{
                        fontWeight: "700",
                        fontSize: 16,
                        marginBottom: 12,
                    }}
                >
                    Paramètres
                </Text>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8,
                    }}
                >
                    <Text style={{ fontSize: 16 }}>Notifications push</Text>
                    <Switch
                        value={pushNotifications}
                        onValueChange={setPushNotifications}
                        thumbColor={pushNotifications ? "#2563eb" : "#f4f3f4"}
                        trackColor={{ true: "#bfdbfe", false: "#d1d5db" }}
                    />
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8,
                    }}
                >
                    <Text style={{ fontSize: 16 }}>Notifications email</Text>
                    <Switch
                        value={emailNotifications}
                        onValueChange={setEmailNotifications}
                        thumbColor={emailNotifications ? "#2563eb" : "#f4f3f4"}
                        trackColor={{ true: "#bfdbfe", false: "#d1d5db" }}
                    />
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8,
                    }}
                >
                    <Text style={{ fontSize: 16 }}>Véhiculé</Text>
                    <Switch
                        value={vehiculer}
                        onValueChange={setVehiculer}
                        thumbColor={vehiculer ? "#2563eb" : "#f4f3f4"}
                        trackColor={{ true: "#bfdbfe", false: "#d1d5db" }}
                    />
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Text style={{ fontSize: 16 }}>Disponible</Text>
                    <Switch
                        value={disponible}
                        onValueChange={setDisponible}
                        thumbColor={disponible ? "#2563eb" : "#f4f3f4"}
                        trackColor={{ true: "#bfdbfe", false: "#d1d5db" }}
                    />
                </View>
            </Card>

            {/* Liens rapides */}
            <Card>
                <Text
                    style={{
                        fontWeight: "700",
                        fontSize: 16,
                        marginBottom: 12,
                    }}
                >
                    Actions
                </Text>
                <Link title="Mes favoris" />
                <Link title="Mes candidatures" />
            </Card>
            <Card>
                <Text
                    style={{
                        fontWeight: "700",
                        fontSize: 16,
                        marginBottom: 12,
                    }}
                >
                    Mentions légales
                </Text>
                <Link title="Consignes d'utilisation" />
                <Link title="Politique de confidentialité" />
            </Card>
            {/* Déconnexion */}
            <TouchableOpacity
                style={{
                    backgroundColor: "#ef4444",
                    paddingVertical: 14,
                    borderRadius: 18,
                    alignItems: "center",
                    marginBottom: 24,
                }}
            >
                <Text
                    style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}
                >
                    Se déconnecter
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    backgroundColor: "#ef4444",
                    paddingVertical: 14,
                    borderRadius: 18,
                    alignItems: "center",
                    marginBottom: 24,
                }}
            >
                <Text
                    style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}
                >
                    Supprimer mon compte
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

/* ---------------- NAVIGATION ---------------- */
const Tab = createBottomTabNavigator();
export default function App() {
    const queryClient = new QueryClient();
    return (
        // <NavigationContainer>
        //     <Tab.Navigator
        //         screenOptions={({ route }) => ({
        //             headerShown: false,
        //             tabBarIcon: ({ color, size }) => {
        //                 const icons = {
        //                     Home: "home",
        //                     Notifications: "notifications",
        //                     Trajets: "car",
        //                     Messages: "chatbubble",
        //                     Profile: "person",
        //                 };
        //                 return (
        //                     <Ionicons
        //                         name={icons[route.name]}
        //                         size={size}
        //                         color={color}
        //                     />
        //                 );
        //             },
        //             tabBarActiveTintColor: "#2563eb",
        //         })}
        //     >
        //         <Tab.Screen name="Home" component={HomeScreen} />
        //         {/* <Tab.Screen name="Onboarding" component={OnboardingScreen} /> */}
        //         {/* <Tab.Screen name="login" component={LoginScreen} /> */}
        //         {/* <Tab.Screen name="Register" component={RegisterScreen} /> */}
        //         <Tab.Screen name="Trajets" component={ProfileScreen} />
        //         <Tab.Screen name="ajouter" component={AddRideScreen} />
        //         <Tab.Screen name="Message" component={ConversationsScreen} />
        //         <Tab.Screen name="Profile" component={ProfileScreen} />
        //         {/* <Tab.Screen name="Welcome" component={WelcomeScreen} /> */}
        //         {/* <Tab.Screen name="Sethings" component={SettingsScreen} /> */}
        //     </Tab.Navigator>
        // </NavigationContainer>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <MessageProvider>
                    <StatusBar style="auto" />
                    <AppNavigator />
                </MessageProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}

const input = {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#f9fafb",
    marginBottom: 16,
    fontSize: 16,
};

const label = {
    fontWeight: "600",
    marginBottom: 6,
    color: "#374151",
};

const dateInput = {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#f9fafb",
    marginBottom: 16,
};
