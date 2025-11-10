import FeatherIcon from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../../../utils/supabase";
import { ProfileCard } from "../../components/ProfileCard";
import SafeScreen from "../../components/SafeScreen";
import { accountStyles } from "../../styles/account.styles";

export default function SettingsScreen() {
    const navigation = useNavigation();

    const onLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error("Error signing out:", error.message);
    };

    const [form, setForm] = useState({
        emailNotifications: true,
        pushNotifications: false,
        vacationNotification: false,
    });

    return (
        <SafeScreen backBtn title="Détail de l'utilisateur">
            <View style={accountStyles.container}>
                <ScrollView
                    contentContainerStyle={accountStyles.content}
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1 }}
                >
                    <ProfileCard />

                    <View style={accountStyles.section}>
                        <Text style={accountStyles.sectionTitle}>
                            Mon compte
                        </Text>
                        <View style={accountStyles.sectionBody}>
                            <TouchableOpacity
                                style={accountStyles.row}
                                onPress={() =>
                                    navigation.navigate("EditProfileScreen")
                                }
                            >
                                <Text style={accountStyles.rowLabel}>
                                    Modifier mes informations
                                </Text>
                                <FeatherIcon
                                    name="chevron-right"
                                    size={20}
                                    color="#bcbcbc"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={accountStyles.row}
                                onPress={() =>
                                    navigation.navigate(
                                        "EmailRegistrationScreen"
                                    )
                                }
                            >
                                <Text style={accountStyles.rowLabel}>
                                    Changer l'email
                                </Text>
                                <FeatherIcon
                                    name="chevron-right"
                                    size={20}
                                    color="#bcbcbc"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={accountStyles.row}>
                                <Text style={accountStyles.rowLabel}>
                                    Changer le mot de passe
                                </Text>
                                <FeatherIcon
                                    name="chevron-right"
                                    size={20}
                                    color="#bcbcbc"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={accountStyles.section}>
                        <Text style={accountStyles.sectionTitle}>
                            Notifications
                        </Text>
                        <View style={accountStyles.sectionBody}>
                            <TouchableOpacity style={accountStyles.row}>
                                <Text style={accountStyles.rowLabel}>
                                    Notifications push
                                </Text>

                                <Switch
                                    thumbColor={
                                        form.pushNotifications
                                            ? "#10B981"
                                            : "#f4f3f4"
                                    }
                                    trackColor={{
                                        false: "#76757780",
                                        true: "#10b98186",
                                    }}
                                    onValueChange={(pushNotifications) =>
                                        setForm({ ...form, pushNotifications })
                                    }
                                    style={{
                                        transform: [
                                            { scaleX: 0.95 },
                                            { scaleY: 0.95 },
                                        ],
                                    }}
                                    value={form.pushNotifications}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={accountStyles.row}>
                                <Text style={accountStyles.rowLabel}>
                                    Notifications email
                                </Text>
                                <Switch
                                    thumbColor={
                                        form.emailNotifications
                                            ? "#10B981"
                                            : "#f4f3f4"
                                    }
                                    trackColor={{
                                        false: "#76757780",
                                        true: "#10b98186",
                                    }}
                                    onValueChange={(emailNotifications) =>
                                        setForm({ ...form, emailNotifications })
                                    }
                                    style={{
                                        transform: [
                                            { scaleX: 0.95 },
                                            { scaleY: 0.95 },
                                        ],
                                    }}
                                    value={form.emailNotifications}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={accountStyles.section}>
                        <Text style={accountStyles.sectionTitle}>
                            Disponibilité
                        </Text>
                        <View style={accountStyles.sectionBody}>
                            <TouchableOpacity style={accountStyles.row}>
                                <Text style={accountStyles.rowLabel}>
                                    Mode vacances
                                </Text>
                                <Switch
                                    thumbColor={
                                        form.vacationNotification
                                            ? "#10B981"
                                            : "#f4f3f4"
                                    }
                                    trackColor={{
                                        false: "#76757780",
                                        true: "#10b98186",
                                    }}
                                    onValueChange={(vacationNotification) =>
                                        setForm({
                                            ...form,
                                            vacationNotification,
                                        })
                                    }
                                    style={{
                                        transform: [
                                            { scaleX: 0.95 },
                                            { scaleY: 0.95 },
                                        ],
                                    }}
                                    value={form.vacationNotification}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={accountStyles.section}>
                        <Text style={accountStyles.sectionTitle}>Sécurité</Text>
                        <View style={accountStyles.sectionBody}>
                            <TouchableOpacity
                                style={accountStyles.row}
                                onPress={onLogout}
                            >
                                <Text
                                    style={[
                                        accountStyles.rowLabel,
                                        { color: "red" },
                                    ]}
                                >
                                    Se déconnecter
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={accountStyles.row}>
                                <Text
                                    style={[
                                        accountStyles.rowLabel,
                                        { color: "red" },
                                    ]}
                                >
                                    Supprimer mon compte
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeScreen>
    );
}
