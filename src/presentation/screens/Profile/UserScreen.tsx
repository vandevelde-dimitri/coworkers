import { UserPublic } from "@/src/domain/entities/user/User";
import { useRouter } from "expo-router";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { AppButton } from "../../components/ui/AppButton";
import { Bento } from "../../components/ui/Bento";
import { ScreenWrapper } from "../../components/ui/ScreenWrapper";
import ProfileSkeleton from "../../components/ui/skeleton/ProfileSkeleton";
import { UserHeader } from "../../components/ui/UserHeader";
import { useGetUserProfile } from "../../hooks/queries/useGetUserProfile";

export default function UserScreen({ userId }: { userId: string }) {
  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useGetUserProfile<UserPublic>(userId);
  const router = useRouter();

  if (isLoading) {
    return (
      <ScreenWrapper title="Chargement..." showBackButton={false}>
        <ProfileSkeleton />
      </ScreenWrapper>
    );
  }

  if (isError || !user) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>
          Impossible de charger le profil pour le moment.
        </Text>
        <AppButton
          title="Réessayer"
          onPress={() => refetch()}
          variant="primary"
        />
      </View>
    );
  }

  const createdAt = user.memberSince
    ? new Date(user.memberSince).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  return (
    <ScreenWrapper
      title={`Profil de ${user.firstName}`}
      showBackButton={false}
      style={{ paddingTop: Platform.OS === "ios" ? 10 : 20 }}
    >
      {Platform.OS === "ios" && <View style={styles.modalHandle} />}

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <UserHeader user={user} dateLabel={createdAt} />

        <View style={styles.bentoGrid}>
          <View style={styles.row}>
            <Bento icon="business" label="Site" value={user.fcName || "N/A"} />
            <Bento icon="people" label="Équipe" value={user.team || "N/A"} />
          </View>

          <View style={styles.row}>
            <Bento icon="location" label="Ville" value={user.city || "N/A"} />
            <Bento
              icon="calendar"
              label="Disponibilité"
              value={user.settings.available ? "Disponible" : "Non-disponible"}
            />
          </View>
        </View>

        {Platform.OS !== "ios" && (
          <AppButton
            title="Fermer"
            onPress={() => {
              router.back();
            }}
            variant="primary"
            style={{ marginTop: 20 }}
          />
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 150,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 10,
  },
  errorText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  bentoGrid: {
    flexDirection: "column",
    gap: 15,
    marginBottom: 30,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
});
