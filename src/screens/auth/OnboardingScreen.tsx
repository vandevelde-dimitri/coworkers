import { useState } from "react";
import {
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { supabase } from "../../../utils/supabase";
import { CustomPicker } from "../../components/ui/CustomPicker";
import { useAuth } from "../../contexts/authContext";

export default function OnboardingScreen() {
    const { session, refreshSession } = useAuth();

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

    const handleNext = async () => {
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
            const { data: user, error } = await supabase
                .from("users")
                .update({
                    firstname: prenom,
                    lastname: nom,
                    city: ville,
                    team: team,
                    // fc_id: centre,
                    // contract: contrat,
                })
                .eq("id", session?.user.id);

            if (error) {
                console.log("Erreur mise à jour user:", error.message);
                return;
            }

            console.log("Utilisateur mis à jour team:", user);
            await supabase.auth.updateUser({
                data: { profile_completed: true },
            });

            refreshSession();
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
