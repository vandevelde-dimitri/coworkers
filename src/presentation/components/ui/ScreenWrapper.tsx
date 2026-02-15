import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackHeader } from "./Header";

interface ScreenWrapperProps {
    children: React.ReactNode;
    title?: string;
    showBackButton?: boolean;
    headerRight?: React.ReactNode;
    style?: ViewStyle;
    withScroll?: boolean;
}

export const ScreenWrapper = ({
    children,
    title,
    showBackButton,
    headerRight,
    style,
}: ScreenWrapperProps) => {
    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {(title || showBackButton) && (
                <StackHeader
                    title={title}
                    showBackButton={showBackButton}
                    rightElement={headerRight}
                    backgroundColor="transparent"
                />
            )}

            <SafeAreaView
                style={[styles.content, style]}
                edges={["left", "right", "bottom"]}
            >
                {children}
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#141E30",
    },
    content: {
        flex: 1,
    },
});
