import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FormAnnouncementScreen from "../screens/add/AddAnnouncementScreen";

const Stack = createNativeStackNavigator();

export default function FormStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: true }}>
            <Stack.Screen
                name="FormAnnouncementScreen"
                component={FormAnnouncementScreen}
                options={{ title: "Nouvelle annonce" }}
            />
        </Stack.Navigator>
    );
}
