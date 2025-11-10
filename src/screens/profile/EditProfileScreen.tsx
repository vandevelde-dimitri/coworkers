import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import SafeScreen from "../../components/SafeScreen";
import { useCurrentUser } from "../../hooks/user/useUsers";
import { accountStyles } from "../../styles/account.styles";

const EditProfileScreen = () => {
    const { data: user } = useCurrentUser();
    const navigation = useNavigation<any>();

    return (
        <SafeScreen backBtn>
            <ScrollView
                contentContainerStyle={accountStyles.content}
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={accountStyles.section}>
                    <Text style={accountStyles.sectionTitle}>Informations</Text>
                    <View style={accountStyles.sectionBody}>
                        <TouchableOpacity
                            style={accountStyles.row}
                            // onPress={() => {
                            //     navigation.navigate("UsernameRegisterScreen");
                            // }}
                        >
                            <Text style={accountStyles.rowLabel}>
                                Photo de profil
                            </Text>
                            <Text style={accountStyles.rowValue}>
                                <Image
                                    style={styles.avatar}
                                    source={{
                                        uri: "https://randomuser.me/api/portraits/men/32.jpg",
                                    }}
                                />
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={accountStyles.row}
                            onPress={() => {
                                navigation.navigate("UsernameRegisterScreen");
                            }}
                        >
                            <Text style={accountStyles.rowLabel}>
                                Nom / Prénom
                            </Text>
                            <Text style={accountStyles.rowValue}>
                                {user?.firstname} {user?.lastname}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={accountStyles.row}
                            onPress={() => {
                                navigation.navigate("FloorRegistrationScreen");
                            }}
                        >
                            <Text style={accountStyles.rowLabel}>
                                Centre Amazon
                            </Text>
                            <Text style={accountStyles.rowValue}>
                                {user?.fc.name}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={accountStyles.row}
                            onPress={() => {
                                navigation.navigate("TeamRegistrationScreen");
                            }}
                        >
                            <Text style={accountStyles.rowLabel}>Équipe</Text>
                            <Text style={accountStyles.rowValue}>
                                {user?.team}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={accountStyles.row}
                            onPress={() => {
                                navigation.navigate(
                                    "ContractRegistrationScreen"
                                );
                            }}
                        >
                            <Text style={accountStyles.rowLabel}>Contrat</Text>
                            <Text style={accountStyles.rowValue}>
                                {user?.contract}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={accountStyles.row}
                            onPress={() => {
                                navigation.navigate(
                                    "LocationRegistrationScreen"
                                );
                            }}
                        >
                            <Text style={accountStyles.rowLabel}>Ville</Text>
                            <Text style={accountStyles.rowValue}>
                                {user?.city}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeScreen>
    );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
    avatar: {
        width: 20,
        height: 20,
        borderRadius: 9999,
        marginBottom: 12,
    },
});
