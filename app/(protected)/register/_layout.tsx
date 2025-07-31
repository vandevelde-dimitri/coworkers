import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Slot } from "expo-router";

export default function RegisterLayout() {
    useRequireAuth();
    return <Slot />;
}
