// ui/toastConfig.tsx
import FeatherIcon from "@expo/vector-icons/Feather";
import React from "react";
import { Text, View } from "react-native";
import { BaseToastProps } from "react-native-toast-message";

const Container = ({ children, bg, border }: any) => (
    <View
        style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 14,
            marginHorizontal: 16,
            borderRadius: 14,
            backgroundColor: bg,
            borderLeftWidth: 4,
            borderLeftColor: border,
        }}
    >
        {children}
    </View>
);

export const toastConfig = {
    success: ({ text1, text2 }: BaseToastProps) => {
        return (
            <Container bg="#ECFDF5" border="#10B981">
                <FeatherIcon name="check-circle" size={22} color="#10B981" />
                <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontWeight: "700", color: "#065F46" }}>
                        {text1}
                    </Text>
                    {text2 && (
                        <Text style={{ color: "#047857", marginTop: 2 }}>
                            {text2}
                        </Text>
                    )}
                </View>
            </Container>
        );
    },

    error: ({ text1, text2 }: BaseToastProps) => {
        return (
            <Container bg="#FEF2F2" border="#EF4444">
                <FeatherIcon name="x-circle" size={22} color="#EF4444" />
                <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontWeight: "700", color: "#7F1D1D" }}>
                        {text1}
                    </Text>
                    {text2 && (
                        <Text style={{ color: "#991B1B", marginTop: 2 }}>
                            {text2}
                        </Text>
                    )}
                </View>
            </Container>
        );
    },

    info: ({ text1, text2 }: BaseToastProps) => {
        return (
            <Container bg="#EFF6FF" border="#2563EB">
                <FeatherIcon name="info" size={22} color="#2563EB" />
                <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontWeight: "700", color: "#1E3A8A" }}>
                        {text1}
                    </Text>
                    {text2 && (
                        <Text style={{ color: "#1D4ED8", marginTop: 2 }}>
                            {text2}
                        </Text>
                    )}
                </View>
            </Container>
        );
    },
};
