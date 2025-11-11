import FeatherIcon from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
    Linking,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { formatDate } from "../../../utils/formatedDate";
import { ProfileCard } from "../../components/ProfileCard";
import SafeScreen from "../../components/SafeScreen";
import { useAuth } from "../../contexts/authContext";
import { useCurrentUser } from "../../hooks/user/useUsers";
import { accountStyles } from "../../styles/account.styles";

export default function ProfileScreen() {
    const { data: user } = useCurrentUser();
    const { session } = useAuth();
    const navigation = useNavigation();
    const formatedDate = formatDate(session?.user.created_at || "");

    console.log("user profile data:", user);

    return (
        <SafeScreen title="Profil">
            <ScrollView
                contentContainerStyle={accountStyles.content}
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <ProfileCard />

                {/* Section Informations */}
                <View style={accountStyles.section}>
                    <Text style={accountStyles.sectionTitle}>Informations</Text>
                    <View style={accountStyles.sectionBody}>
                        <View style={accountStyles.row}>
                            <Text style={accountStyles.rowLabel}>
                                Centre Amazon
                            </Text>
                            <Text style={accountStyles.rowValue}>
                                {user?.fc.name}
                            </Text>
                        </View>
                        <View style={accountStyles.row}>
                            <Text style={accountStyles.rowLabel}>Équipe</Text>
                            <Text style={accountStyles.rowValue}>
                                {user?.team}
                            </Text>
                        </View>
                        <View style={accountStyles.row}>
                            <Text style={accountStyles.rowLabel}>Contrat</Text>
                            <Text style={accountStyles.rowValue}>
                                {user?.contract}
                            </Text>
                        </View>
                        <View style={accountStyles.row}>
                            <Text style={accountStyles.rowLabel}>Ville</Text>
                            <Text style={accountStyles.rowValue}>
                                {user?.city}
                            </Text>
                        </View>
                        <View style={accountStyles.row}>
                            <Text style={accountStyles.rowLabel}>
                                Date d'inscription
                            </Text>
                            <Text style={accountStyles.rowValue}>
                                {formatedDate}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Section Actions */}
                <View style={accountStyles.section}>
                    <Text style={accountStyles.sectionTitle}>Actions</Text>
                    <View style={accountStyles.sectionBody}>
                        <TouchableOpacity
                            style={accountStyles.row}
                            onPress={() =>
                                navigation.navigate("FavoriteScreen")
                            }
                        >
                            <Text style={accountStyles.rowLabel}>
                                Mes favoris
                            </Text>
                            <FeatherIcon
                                name="chevron-right"
                                size={20}
                                color="#bcbcbc"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={accountStyles.row}>
                            <Text style={accountStyles.rowLabel}>
                                Mes candidatures
                            </Text>
                            <FeatherIcon
                                name="chevron-right"
                                size={20}
                                color="#bcbcbc"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 🧾 Section Mentions légales */}
                <View style={accountStyles.section}>
                    <Text style={accountStyles.sectionTitle}>
                        Mentions légales
                    </Text>
                    <View style={accountStyles.sectionBody}>
                        <TouchableOpacity
                            style={accountStyles.row}
                            onPress={() =>
                                Linking.openURL(
                                    "https://dimdev.notion.site/politique-de-confidentialite-coworkers-XXXXXXXXXXXX"
                                )
                            }
                        >
                            <Text style={accountStyles.rowLabel}>
                                Politique de confidentialité
                            </Text>
                            <FeatherIcon
                                name="external-link"
                                size={18}
                                color="#bcbcbc"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={accountStyles.row}
                            onPress={() =>
                                Linking.openURL(
                                    "https://dimdev.notion.site/conditions-utilisation-coworkers-XXXXXXXXXXXX"
                                )
                            }
                        >
                            <Text style={accountStyles.rowLabel}>
                                Conditions d’utilisation
                            </Text>
                            <FeatherIcon
                                name="external-link"
                                size={18}
                                color="#bcbcbc"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={accountStyles.row}
                            onPress={() =>
                                Linking.openURL(
                                    "mailto:vandevdimitri@gmail.com"
                                )
                            }
                        >
                            <Text style={accountStyles.rowLabel}>
                                Contacter le développeur
                            </Text>
                            <FeatherIcon
                                name="mail"
                                size={18}
                                color="#bcbcbc"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeScreen>
    );
}
