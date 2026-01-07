import { useRemoveParticipant } from "../src/hooks/candidate/useCandidate";

const { mutate: removeParticipant } = useRemoveParticipant();

export const handleRemoveParticipant = (annonce, participantId: string) => {
    const participant = annonce.participant_requests.find(
        (p) => p.user_id === participantId
    );
    if (!participant) return;
    // Alert.alert(
    //     "Confirmation",
    //     `Voulez-vous vraiment retirer ${participant.users.firstname} de cette annonce ?`,
    //     [
    //         { text: "Annuler", style: "cancel" },
    //         {
    //             text: "Retirer",
    //             style: "destructive",
    //             onPress: () => {
    //                 removeParticipant({
    //                     annonceId: annonce.id,
    //                     participantId,
    //                     conversationId: annonce.conversation_id,
    //                 });
    //             },
    //         },
    //     ]
    // );
    // Alert.alert(
    //     "Confirmation",
    //     `Voulez-vous vraiment retirer ${participant.users.firstname} de cette annonce ?`,
    //     [
    //         { text: "Annuler", style: "cancel" },
    //         {
    //             text: "Retirer",
    //             style: "destructive",
    //             onPress: () => {
    //                 removeParticipant({
    //                     annonceId: annonce.id,
    //                     participantId,
    //                     conversationId: annonce.conversation_id,
    //                 });
    //             },
    //         },
    //     ]
    // );
};
