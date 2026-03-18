import { ScreenWrapper } from "@/src/presentation/components/ui/ScreenWrapper";
import { useAuth } from "@/src/presentation/hooks/authContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CustomToast } from "../../components/ui/CustomToast";
import { useToast } from "../../components/ui/molecules/Toast";
import { useUpdatePassword } from "../../hooks/mutations/useUpdatePassword"; // Ton hook

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState("");
  const { session, loading: authLoading } = useAuth();
  const { mutateAsync: updatePassword, isPending } = useUpdatePassword();
  const router = useRouter();
  const toast = useToast();

  // Sécurité : Si pas de session après le chargement, on redirige
  useEffect(() => {
    if (!authLoading && !session) {
      router.replace("/(auth)/login");
    }
  }, [session, authLoading]);

  const handleUpdate = async () => {
    try {
      await updatePassword(password);
      toast.show(
        <CustomToast title="Succès" message="Mot de passe mis à jour !" />,
        { type: "success" },
      );
      router.replace("/(tabs)/home");
    } catch (error: any) {
      toast.show(<CustomToast title="Erreur" message={error.message} />, {
        type: "error",
      });
    }
  };

  if (authLoading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: "#141E30", justifyContent: "center" },
        ]}
      >
        <ActivityIndicator color="#4FACFE" />
      </View>
    );
  }

  return (
    <ScreenWrapper title="Nouveau mot de passe">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Sécurisez votre compte</Text>
          <Text style={styles.subtitle}>
            Choisissez un mot de passe robuste pour votre prochaine session.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="rgba(255,255,255,0.4)"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Nouveau mot de passe"
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleUpdate}
            disabled={isPending}
          >
            <LinearGradient
              colors={["#4FACFE", "#007AFF"]}
              style={styles.gradient}
            >
              <Text style={styles.buttonText}>
                {isPending ? "Mise à jour..." : "Enregistrer"}
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
