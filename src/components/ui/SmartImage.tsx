import { Image } from "expo-image";
import React from "react";

import { Contract } from "../../types/enum/contract.enum";

type SmartImageProps = {
    userData: {
        image_profile: string;
        avatar_updated_at: string | number;
        contract: Contract;
    };
    size?: number;
};

const SmartImage = ({ userData, size = 80 }: SmartImageProps) => {
    const { image_profile, avatar_updated_at, contract } = userData;

    const imageSource = image_profile
        ? `${image_profile}?v=${new Date(avatar_updated_at).getTime()}`
        : null;

    const fallbackImage =
        "https://ctkoosixwtoxxtilcuqh.supabase.co/storage/v1/object/public/avatars/1903ad4c-4a65-4cb0-a21c-9590c00b6b63/avatar.webp";

    return (
        <Image
            source={imageSource || fallbackImage}
            style={{
                width: size,
                height: size,
                borderRadius: 9999,
                borderColor: getColor(contract),
                borderWidth: 2,
            }}
            contentFit="cover"
            transition={300}
            cachePolicy="disk"
            placeholderContentFit="cover"
        />
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
