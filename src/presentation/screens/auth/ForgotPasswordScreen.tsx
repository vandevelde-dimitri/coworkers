import { ScreenWrapper } from "@/src/presentation/components/ui/ScreenWrapper";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CustomToast } from "../../components/ui/CustomToast";
import { useToast } from "../../components/ui/molecules/Toast";
import { useForgotPassword } from "../../hooks/mutations/useForgotPassword";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const toast = useToast();
  const { mutateAsync: sendEmail, isPending } = useForgotPassword();

  const handleRequest = async () => {
    const testUrl = Linking.createURL("reset-password");
    console.log("🔗 URL à copier dans Supabase :", testUrl);

    try {
      await sendEmail(email);
      toast.show(
        <CustomToast
          title="Vérifiez vos mails"
          message="Un lien de récupération vous a été envoyé."
        />,
        { type: "success" },
      );
    } catch (error: any) {
      toast.show(<CustomToast title="Erreur" message={error.message} />, {
        type: "error",
      });
    }
  };

  return (
    <ScreenWrapper title="Mot de passe oublié" showBackButton={true}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Un petit oubli ?</Text>
          <Text style={styles.subtitle}>
            Entrez votre adresse mail pour recevoir un lien de réinitialisation.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="rgba(255,255,255,0.4)"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email professionnel"
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleRequest}
            disabled={isPending}
          >
            <LinearGradient
              colors={["#4FACFE", "#007AFF"]}
              style={styles.gradient}
            >
              <Text style={styles.buttonText}>
                {isPending ? "Envoi..." : "Envoyer le lien"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 30, justifyContent: "center" },
  header: { marginBottom: 40 },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  subtitle: { fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 24 },
  form: { gap: 20 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 15,
    height: 60,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, color: "#FFFFFF", fontSize: 16 },
  button: { height: 60, borderRadius: 20, overflow: "hidden", marginTop: 10 },
  gradient: { flex: 1, justifyContent: "center", alignItems: "center" },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
});
