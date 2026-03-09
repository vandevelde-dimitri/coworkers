import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useVacationMode } from "../../hooks/useVacationMode";
import { StackHeader } from "./Header";
import { VacationBanner } from "./VacationBanner";

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
  const isVacationMode = useVacationMode();
  const router = useRouter();
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
        {isVacationMode && (
          <VacationBanner
            onPress={() => router.push("/(tabs)/account/settings")}
          />
        )}
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
