import { User } from "@/src/domain/entities/user/User";
import { UserContract } from "@/src/domain/entities/user/User.enum";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable } from "react-native";
import { useAuth } from "../../hooks/authContext";

type AvatarProps = {
  userData?: {
    profileAvatar: string | undefined;
    avatarUpdatedAt: string | null;
    contract: UserContract;
    id: string;
  };
  user?: User;
  size?: number;
  disablePress?: boolean;
};

const Avatar = ({
  userData,
  user,
  size = 80,
  disablePress = false,
}: AvatarProps) => {
  const avatarData = userData || {
    profileAvatar: user?.profileAvatar || "",
    avatarUpdatedAt: user?.avatarUpdatedAt,
    contract: user?.contract || UserContract.CDD,
    id: user?.id || "",
  };

  const { profileAvatar, avatarUpdatedAt, contract, id } = avatarData;
  const { session } = useAuth();
  const router = useRouter();
  const ownerProfile = id === session?.user.id;
  const cacheKey = avatarUpdatedAt ? new Date(avatarUpdatedAt).getTime() : "";
  const imageSource = profileAvatar ? `${profileAvatar}?v=${cacheKey}` : null;

  console.log("test du nom - prenom", userData);

  const fallbackImage =
    "https://images.unsplash.com/photo-1740252117044-2af197eea287?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  const handlePress = () => {
    if (disablePress) return;
    if (__DEV__) console.log("pressed");
    if (!ownerProfile) {
      router.push({
        pathname: "/user/[id]",
        params: { id: user?.id || id },
      });
    } else {
      router.push("/(tabs)/account");
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Image
        accessible={true}
        accessibilityLabel="Avatar de l'utilisateur"
        source={imageSource || fallbackImage}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: getColor(contract),
          borderWidth: 2,
        }}
        contentFit="cover"
        transition={300}
        cachePolicy="disk"
      />
    </Pressable>
  );
};

function getColor(contract_type: UserContract) {
  switch (contract_type) {
    case UserContract.CDD:
      return "#22C55E";
    case UserContract.CDI:
      return "#3B82F6";
    default:
      return "#d1d5db";
  }
}
export default Avatar;
