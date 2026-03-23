import { Login } from "@/src/domain/entities/auth/Login";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as yup from "yup";
import { FormInput } from "../../components/ui/FormInput";
import { ScreenWrapper } from "../../components/ui/ScreenWrapper";
import { useLogin } from "../../hooks/mutations/useLogin";

export default function LoginScreen() {
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();
  const schema = yup.object({
    email: yup.string().email("Email invalide").required("Email requis"),
    password: yup.string().required("Mot de passe requis"),
  });
  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleLogin = async (data: Login) => {
    login(data);
  };

  return (
    <ScreenWrapper title="Connexion" showBackButton>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.welcomeTitle}>Ravi de vous revoir !</Text>
            <Text style={styles.welcomeSubtitle}>
              Connectez-vous pour retrouver vos trajets.
            </Text>
          </View>

          <FormInput
            control={control}
            name="email"
            label="Email"
            type="email"
            iconName="mail-outline"
            placeholder="john@doe.fr"
          />

          <FormInput
            control={control}
            name="password"
            type="password"
            label="Mot de passe"
            iconName="lock-closed-outline"
            placeholder="••••••••"
          />
          <View style={styles.forgotPasswordContainer}>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/forgot-password")}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotPasswordText}>
                Mot de passe oublié ?
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.loginButton,
              (isPending || !isDirty) && { opacity: 0.5 },
            ]}
            onPress={handleSubmit(handleLogin)}
            disabled={isPending || !isDirty}
          >
            <Text style={styles.loginButtonText}>
              {isPending ? "Connexion..." : "Se connecter"}
            </Text>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.noAccountText}>Pas encore de compte ? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
              <Text style={styles.signupActionText}>S'inscrire</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 20, paddingBottom: 150 },
  headerTextContainer: { marginBottom: 40 },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFF",
    marginBottom: 10,
  },
  welcomeSubtitle: { fontSize: 16, color: "#B9B9B9" },
  loginButton: {
    backgroundColor: "#FFF",
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  loginButtonText: { color: "#141E30", fontSize: 18, fontWeight: "700" },
  forgotPasswordContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
    fontWeight: "500",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 35,
  },
  noAccountText: {
    color: "#B9B9B9",
    fontSize: 15,
  },
  signupActionText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "800",
    textDecorationLine: "underline",
  },
});
