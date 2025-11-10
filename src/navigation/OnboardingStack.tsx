import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ContractRegistrationScreen from "../screens/auth/register/contract";
import FloorRegistrationScreen from "../screens/auth/register/floor";
import LocationEditScreen from "../screens/auth/register/location";
import TeamRegistrationScreen from "../screens/auth/register/team";
import UsernameEditScreen from "../screens/auth/register/username";

const Stack = createNativeStackNavigator();

export default function OnboardingStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="UsernameEditScreen"
                component={UsernameEditScreen}
                options={{ title: "Enregistrement de l'utilisateur" }}
            />
            <Stack.Screen
                name="LocationEditScreen"
                component={LocationEditScreen}
                options={{ title: "Enregistrement de la ville" }}
            />
            <Stack.Screen
                name="ContractRegistrationScreen"
                component={ContractRegistrationScreen}
                options={{ title: "Enregistrement du contrat" }}
            />
            <Stack.Screen
                name="FloorRegistrationScreen"
                component={FloorRegistrationScreen}
                options={{ title: "Enregistrement du centre" }}
            />

            <Stack.Screen
                name="TeamRegistrationScreen"
                component={TeamRegistrationScreen}
                options={{ title: "Enregistrement de l'équipe" }}
            />
        </Stack.Navigator>
    );
}
