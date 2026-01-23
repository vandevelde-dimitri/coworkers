import { useNavigation } from "@react-navigation/native"; // Utilisation de useNavigation
import { Image } from "expo-image";
import React from "react";
import { Pressable } from "react-native";
import { Contract } from "../../types/enum/contract.enum";

type SmartImageProps = {
    userData: {
        image_profile: string;
        avatar_updated_at: string | number;
        contract: Contract;
        user_id: string;
    };
    size?: number;
    disablePress?: boolean;
};

const SmartImage = ({
    userData,
    size = 80,
    disablePress = false,
}: SmartImageProps) => {
    const { image_profile, avatar_updated_at, contract, user_id, id } =
        userData;
    const navigation = useNavigation<any>(); // On récupère l'objet navigation

    const imageSource = image_profile
        ? `${image_profile}?v=${new Date(avatar_updated_at).getTime()}`
        : null;

    const fallbackImage =
        "https://ctkoosixwtoxxtilcuqh.supabase.co/storage/v1/object/public/avatars/1903ad4c-4a65-4cb0-a21c-9590c00b6b63/avatar.webp";

    const handlePress = () => {
        console.log("SmartImage pressed!", { disablePress, user_id });
        if ((!disablePress && user_id) || id) {
            console.log("Navigating to ProfileUserScreen with id:", user_id);
            // "Profile" doit correspondre au nom défini dans ton Stack.Screen
            navigation.navigate("ProfileUserScreen", { id: user_id || id });
        }
    };

    return (
        <Pressable
            onPress={handlePress}
            style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1, // Feedback visuel plus marqué
            })}
        >
            <Image
                source={imageSource || fallbackImage}
                style={{
                    width: size,
                    height: size,
                    borderRadius: size / 2, // Plus précis que 9999
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

function getColor(contract_type: Contract) {
    switch (contract_type) {
        case Contract.CDD:
            return "#2af501";
        case Contract.CDI:
            return "#60a5fa";
        default:
            return "#d1d5db";
    }
}
export default SmartImage;
