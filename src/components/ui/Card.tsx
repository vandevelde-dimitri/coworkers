import { ReactNode } from "react";
import { View } from "react-native";

export const Card = ({ children }: { children: ReactNode }) => (
    <View
        style={{
            backgroundColor: "#fff",
            borderRadius: 18,
            padding: 16,
            marginBottom: 14,
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowRadius: 10,
        }}
    >
        {children}
    </View>
);
