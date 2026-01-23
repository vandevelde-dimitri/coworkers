import { useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { useRemoveParticipant } from "../../hooks/candidate/useCandidate";
import ConfirmModal from "./ConfirmModal";

export default function RemoveParticipantButton({ participant, annonce }) {
    const { mutate: removeParticipant } = useRemoveParticipant();
    const [open, setOpen] = useState(false);

    return (
        <>
            <TouchableOpacity
                style={{
                    backgroundColor: "#fee2e2",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 10,
                }}
                onPress={() => setOpen(true)}
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
            <ConfirmModal
                visible={open}
                title="Supprimer cette personne ?"
                description="Cette action est définitive et ne pourra pas être annulée."
                confirmLabel="Supprimer"
                onCancel={() => setOpen(false)}
                onConfirm={() => {
                    setOpen(false);
                    removeParticipant({
                        annonceId: annonce.id,
                        participantId: participant.users.id,
                        conversationId: annonce.conversation_id,
                    });
                }}
                danger
            />
        </>
    );
}
