import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FormAnnouncementScreen from "../screens/add/AddAnnouncementScreen";
import { useRequireAuth } from "../hooks/useRequireAuth";

const Stack = createNativeStackNavigator();

export default function FormStack() {
    useRequireAuth();
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="FormAnnouncementScreen"
                component={FormAnnouncementScreen}
                options={{ title: "Nouvelle annonce" }}
            />
        </Stack.Navigator>
    );
}
