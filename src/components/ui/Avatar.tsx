import { Image } from "react-native";

export const Avatar = ({ uri }) => (
    <Image
        source={{ uri }}
        style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: "#e5e7eb",
        }}
    />
);
