import { NavigatorScreenParams } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../screens/welcome";
import { AuthStackParamList } from "../types/navigation/authStackType";
import AuthStack from "./AuthStack";
import HomeStack from "./HomeStack";

export type PublicStackParamList = {
    Welcome: undefined;
    Auth: NavigatorScreenParams<AuthStackParamList>;
    HomeStack: undefined;
};

const Stack = createNativeStackNavigator<PublicStackParamList>();

export default function PublicStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* Point d’entrée */}
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            {/* Authentification */}
            <Stack.Screen name="Auth" component={AuthStack} />
            {/* Consultation libre */}
            <Stack.Screen name="HomeStack" component={HomeStack} />
        </Stack.Navigator>
    );
}
