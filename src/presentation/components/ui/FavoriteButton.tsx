import { useRouter } from "expo-router";
import { useAuth } from "../../hooks/authContext";
import { useFavorite } from "../../hooks/mutations/useFavorite";
import { AppButton } from "./AppButton";

export default function FavoriteButton({ annonceId }: { annonceId: string }) {
  const { session } = useAuth();
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorite(
    session?.user.id,
    annonceId,
  );

  const onPress = async () => {
    if (!session) {
      router.push("/(auth)/login");
      return;
    }

    await toggleFavorite(!isFavorite);
  };

  return (
    <AppButton
      variant="secondary"
      title={isFavorite ? "Retirer favoris" : "Ajouter favoris"}
      onPress={onPress}
    />
  );
}
