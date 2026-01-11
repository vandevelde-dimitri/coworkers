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
    console.log("userData", userData);

    const imageSource = image_profile
        ? `${image_profile}?v=${new Date(avatar_updated_at).getTime()}`
        : null;

    const fallbackImage =
        "https://ui-avatars.com/api/?name=User&background=random";

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
            return "#fd0202";
        case Contract.CDI:
            return "#60a5fa";
        default:
            return "#d1d5db";
    }
}
export default SmartImage;
