import { useState } from "react";
import { useAuth } from "../../hooks/authContext";
import { useApply } from "../../hooks/mutations/useApply";
import { AppButton } from "./AppButton";
import ConfirmDialog from "./ConfirmDialog";

export default function ApplyButton({ annonce }: { annonce: any }) {
  const { session } = useAuth();
  const { request, isLoading, toggleApply } = useApply(
    annonce.id,
    session?.user.id,
  );
  const [confirmOpen, setConfirmOpen] = useState(false);

  const status = request?.status;
  const isFull = annonce.places <= 0;

  const getButtonConfig = () => {
    if (status === "accepted")
      return { title: "Annuler ma place", variant: "danger" as const };
    if (status === "pending")
      return { title: "Retirer ma demande", variant: "secondary" as const };
    if (status === "refused")
      return { title: "Refusé", variant: "secondary" as const, disabled: true };
    if (isFull)
      return {
        title: "Complet",
        variant: "secondary" as const,
        disabled: true,
      };
    return { title: "Réserver une place", variant: "primary" as const };
  };

  const config = getButtonConfig();

  const handlePress = async () => {
    if (status === "pending" || status === "accepted") {
      setConfirmOpen(true);
    } else {
      await toggleApply();
    }
  };

  return (
    <>
      <AppButton
        title={config.title}
        variant={config.variant}
        disabled={config.disabled}
        isLoading={isLoading}
        onPress={handlePress}
      />

      <ConfirmDialog
        visible={confirmOpen}
        title="Annuler ?"
        description={
          status === "accepted"
            ? "Voulez-vous vraiment annuler votre demande ?"
            : "Voulez-vous vraiment retirer votre demande ?"
        }
        onConfirm={async () => {
          setConfirmOpen(false);
          await toggleApply();
        }}
        onCancel={() => setConfirmOpen(false)}
        danger
      />
    </>
  );
}
