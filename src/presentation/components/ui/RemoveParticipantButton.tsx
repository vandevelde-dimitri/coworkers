import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useRemoveParticipant } from "../../hooks/mutations/useRemoveParticipant";
import ConfirmDialog from "./ConfirmDialog";

interface RemoveParticipantButtonProps {
  participant: any;
  annonce: any;
}

export const RemoveParticipantButton = ({
  participant,
  annonce,
}: RemoveParticipantButtonProps) => {
  const { mutate: removeParticipant, isPending } = useRemoveParticipant();
  const [open, setOpen] = useState(false);

  const handleRemove = () => {};

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={styles.button}
        disabled={isPending}
      >
        {isPending ? (
          <ActivityIndicator size="small" color="#FF4D4D" />
        ) : (
          <View style={styles.iconContainer}>
            <Ionicons name="person-remove-outline" size={20} color="#FF4D4D" />
          </View>
        )}
      </TouchableOpacity>
      <ConfirmDialog
        visible={open}
        title="Retirer le passager ?"
        description={`Voulez-vous vraiment retirer ${participant.firstName} de ce trajet ?`}
        onConfirm={() => {
          if (open) {
            removeParticipant({
              annonceId: annonce.id,
              participantId: participant.id,
              conversationId: annonce.conversationId,
            });
            setOpen(false);
          }
        }}
        onCancel={() => setOpen(false)}
        danger
      />
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    marginLeft: "auto",
    padding: 8,
  },
  iconContainer: {
    backgroundColor: "rgba(255, 77, 77, 0.1)",
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 77, 77, 0.2)",
  },
});
