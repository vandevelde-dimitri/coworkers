import { Alert, Text, TouchableOpacity } from "react-native";
import { useRemoveParticipant } from "../../hooks/candidate/useCandidate";

export default function RemoveParticipantButton({ participant, annonce }) {
    const { mutate: removeParticipant } = useRemoveParticipant();

    return (
        <TouchableOpacity
            style={{
                backgroundColor: "#fee2e2",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 10,
            }}
            onPress={() =>
                Alert.alert(
                    "Confirmation",
                    `Voulez-vous vraiment retirer ${participant.users.firstname} de cette annonce ?`,
                    [
                        { text: "Annuler", style: "cancel" },
                        {
                            text: "Retirer",
                            style: "destructive",
                            onPress: () => {
                                removeParticipant({
                                    annonceId: annonce.id,
                                    participantId: participant.users.id,
                                    conversationId: annonce.conversation_id,
                                });
                            },
                        },
                    ]
                )
            }
        >
            <Text
                style={{
                    color: "#ef4444",
                    fontSize: 12,
                    fontWeight: "600",
                }}
            >
                Retirer
            </Text>
        </TouchableOpacity>
    );
}
