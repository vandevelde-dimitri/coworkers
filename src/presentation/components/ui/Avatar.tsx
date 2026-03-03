import { User } from "@/src/domain/entities/user/User";
import { UserContract } from "@/src/domain/entities/user/User.enum";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable } from "react-native";

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
  const router = useRouter();

  const cacheKey = avatarUpdatedAt ? new Date(avatarUpdatedAt).getTime() : "";
  const imageSource = profileAvatar ? `${profileAvatar}?v=${cacheKey}` : null;

  const fallbackImage =
    "https://ctkoosixwtoxxtilcuqh.supabase.co/storage/v1/object/public/avatars/1903ad4c-4a65-4cb0-a21c-9590c00b6b63/avatar.webp";

  const handlePress = () => {
    if (disablePress) return;
    console.log("pressed");
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Image
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
